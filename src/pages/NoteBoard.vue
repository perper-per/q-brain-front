<template>
  <q-page class="board-page" style="padding: 0">
    <div class="board-container" :class="{ 'mobile-view': isMobileView }" ref="boardRef">
      <!-- 左側欄 - 在桌面版顯示 -->
      <div class="left-column" v-if="!isMobileView">
        <!-- 視圖模式切換 -->
        <div class="view-mode-switcher q-mb-md">
          <q-btn-group flat vertical>
            <q-btn
              flat
              :color="viewMode === 'auto' ? 'primary' : ''"
              icon="devices"
              @click="viewMode = 'auto'"
            >
              <q-tooltip anchor="center right" self="center left">自動模式</q-tooltip>
            </q-btn>
          </q-btn-group>
        </div>

        <div class="add-btn-container">
          <q-btn
            ref="addButton"
            @click="addNewNote"
            :disabled="isLoading"
            flat
            icon="add"
            class="add-note-btn"
          >
            <q-tooltip anchor="center right" self="center left">新增便條</q-tooltip>
          </q-btn>
        </div>
      </div>

      <!-- 右側區域 -->
      <div class="right-section">
        <!-- 保護區：緊急便條按鈕 -->
        <div class="protected-area">
          <div v-if="isLoading">載入中...</div>
          <div v-if="errorMessage" class="error">{{ errorMessage }}</div>

          <!-- 緊急便條按鈕 -->
          <div v-if="urgentNotes.length > 0" class="urgent-notes-preview">
            <q-btn
              v-for="note in urgentNotes"
              :key="note._id"
              flat
              dense
              class="urgent-note-btn"
              @click="scrollToNote(note._id)"
            >
              <q-icon name="warning" color="red" size="xs" class="q-mr-xs" />
              {{ note.title || '無標題' }}
            </q-btn>
          </div>
        </div>

        <!-- 便條展示區 -->
        <div class="note-display-area" :class="{ 'mobile-layout': isMobileView }">
          <!-- 桌面視圖：正常渲染 -->
          <template v-if="!isMobileView">
            <note-origin
              v-for="(note, index) in orderedNotes"
              :key="note._id"
              :note="note"
              :forceMobile="false"
              :index="index"
              ref="noteRefs"
              @dragstart="onNoteDragStart(note._id)"
              @dragend="onNoteDragEnd"
              @dragover="onNoteDragOver(note._id)"
              @reorder="handleReorder"
            />
          </template>

          <!-- 移動視圖：使用虛擬滾動 -->
          <q-virtual-scroll
            v-else
            :items="orderedNotes"
            :virtual-scroll-item-size="180"
            :virtual-scroll-slice-size="10"
            :virtual-scroll-sticky-size-start="48"
            class="mobile-virtual-scroll"
            style="height: calc(100vh - 100px)"
          >
            <template v-slot="{ item: note }">
              <note-origin
                :key="note._id"
                :note="note"
                :forceMobile="true"
                :index="orderedNotes.indexOf(note)"
                @dragstart="onNoteDragStart(note._id)"
                @dragend="onNoteDragEnd"
                @dragover="onNoteDragOver(note._id)"
                @reorder="handleReorder"
              />
            </template>
          </q-virtual-scroll>
        </div>
      </div>

      <!-- 手機版的新增按鈕 -->
      <div class="mobile-add-btn q-pa-md" v-if="isMobileView">
        <q-btn
          ref="addButton"
          @click="addNewNote"
          :disabled="isLoading"
          color="primary"
          label="新增便條"
          class="full-width"
          icon="add"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue';
import { useNoteStore, defaultNote } from '../stores/noteStore';
import { storeToRefs } from 'pinia';
import NoteOrigin from '../components/noteOrigin.vue';
import { useQuasar } from 'quasar';
import { useNoteActions } from '../composables/useNoteActions';

const $q = useQuasar();
const noteStore = useNoteStore();
const { notes, orderedNotes } = storeToRefs(noteStore);
const isLoading = ref(false);
const errorMessage = ref('');
const addButton = ref(null);
const noteRefs = ref([]);

// 添加 isReordering 變數定義
const isReordering = ref(false);

// 使用 useNoteActions hook 獲取移動視圖狀態
const { isMobileView } = useNoteActions();

// 添加視圖模式控制
const viewMode = ref('auto'); // 'auto', 'mobile', 'desktop'
const draggedNoteId = ref(null);
const mobileNoteOrder = ref([]);

// 注意：如果模板中不需要 displayMode，可以移除這段代碼
// 或者在模板中使用它，例如 :class="{ 'mobile-layout': displayMode === 'mobile' }"
/*
const displayMode = computed(() => {
  if (viewMode.value === 'auto') {
    return isMobileView.value ? 'mobile' : 'desktop';
  }
  return viewMode.value;
});
*/

// 處理便條拖曳開始
const onNoteDragStart = (noteId) => {
  draggedNoteId.value = noteId;
  // 添加拖曳中的視覺效果
  const noteElement = document.querySelector(`[data-note-id="${noteId}"]`);
  if (noteElement) {
    noteElement.classList.add('dragging');
  }
};

// 處理便條拖曳結束
const onNoteDragEnd = () => {
  // 移除拖曳效果
  const draggedElement = document.querySelector('.dragging');
  if (draggedElement) {
    draggedElement.classList.remove('dragging');
  }
  draggedNoteId.value = null;
};

// 處理便條拖曳過程
const onNoteDragOver = (noteId) => {
  if (!draggedNoteId.value || draggedNoteId.value === noteId) return;

  const currentOrder = [...mobileNoteOrder.value];
  const draggedIndex = currentOrder.indexOf(draggedNoteId.value);
  const targetIndex = currentOrder.indexOf(noteId);

  if (draggedIndex !== -1 && targetIndex !== -1) {
    // 交換位置
    currentOrder.splice(draggedIndex, 1);
    currentOrder.splice(targetIndex, 0, draggedNoteId.value);
    mobileNoteOrder.value = currentOrder;
  }
};

// 監聽便條列表變化
watch(() => notes.value, (newNotes) => {
  // 更新手機版排序列表
  const currentIds = new Set(mobileNoteOrder.value);
  const newIds = newNotes.map(note => note._id);

  // 移除不存在的便條
  mobileNoteOrder.value = mobileNoteOrder.value.filter(id => newIds.includes(id));

  // 添加新便條到列表末尾
  for (const id of newIds) {
    if (!currentIds.has(id)) {
      mobileNoteOrder.value.push(id);
    }
  }
}, { deep: true });

// 修改 watch 函數，添加錯誤處理
watch(
  () => notes.value.map(note => ({ id: note._id, isUrgent: note.isUrgent })),
  async (newVal, oldVal) => {
    if (!isMobileView.value || isReordering.value) return;

    try {
      // 檢查是否有便條的緊急狀態發生變化
      const changedIndex = newVal.findIndex((item, index) => {
        return oldVal && oldVal[index] && item.isUrgent !== oldVal[index].isUrgent;
      });

      if (changedIndex === -1) return; // 沒有變化則跳過

      isReordering.value = true;

      // 只處理緊急狀態變化的便條
      const changedNoteId = newVal[changedIndex]?.id;
      if (!changedNoteId) return;

      const changedNote = notes.value.find(note => note._id === changedNoteId);
      if (!changedNote) return;

      // 根據便條的新緊急狀態決定其位置
      let newPosition;
      if (changedNote.isUrgent) {
        // 如果變為緊急，移到所有緊急便條之後
        const urgentCount = notes.value.filter(n => n.isUrgent && n._id !== changedNote._id).length;
        newPosition = urgentCount;
      } else {
        // 如果取消緊急，移到非緊急便條最前面
        const urgentCount = notes.value.filter(n => n.isUrgent).length;
        newPosition = urgentCount;
      }

      // 只更新這一個便條的位置
      await noteStore.updateSinglePosition(changedNote._id, newPosition);

    } catch (error) {
      console.error('更新緊急便條順序失敗:', error);
      $q.notify({
        message: '更新順序失敗',
        color: 'negative',
        position: 'top'
      });
    } finally {
      setTimeout(() => {
        isReordering.value = false;
      }, 300);
    }
  },
  {
    deep: true,
    // 添加错误处理
    onError: (err) => {
      console.error('監視緊急狀態時出錯:', err);
      isReordering.value = false;
    }
  }
);

// 初始化時設置排序
onMounted(() => {
  mobileNoteOrder.value = notes.value.map(note => note._id);
  updateViewMode(); // 初始設置
  window.addEventListener('resize', updateViewMode);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateViewMode);
});

// 計算緊急便條
const urgentNotes = computed(() => {
  console.log('Computing urgent notes:', notes.value.filter(note => note.isUrgent));  // 添加日誌
  return notes.value.filter(note => note.isUrgent);
});

// 滾動到指定便條
const scrollToNote = (noteId) => {
  const noteElements = noteRefs.value;
  const targetNote = noteElements.find(
    noteRef => noteRef.props.note._id === noteId
  );

  if (targetNote?.$el) {
    targetNote.$el.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
    // 高亮效果
    targetNote.$el.classList.add('highlight');
    setTimeout(() => {
      targetNote.$el.classList.remove('highlight');
    }, 2000);
  }
};

const addNewNote = async () => {
  // Fallback for browsers that don't support View Transitions API
  if (!document.startViewTransition) {
    try {
      await handleAddNote();
    } catch (error) {
      errorMessage.value = `新增便條失敗：${error.message}`;
    }
    return;
  }

  // With View Transition
  document.startViewTransition(async () => {
    try {
      await handleAddNote();
    } catch (error) {
      errorMessage.value = `新增便條失敗：${error.message}`;
    }
  });
};

// 將原本的邏輯抽出來成為一個單獨的函數
const handleAddNote = async () => {
  isLoading.value = true;
  const protectedArea = document.querySelector('.protected-area');
  const protectedHeight = protectedArea.getBoundingClientRect().height;
  const rightSection = document.querySelector('.right-section');
  const rightRect = rightSection.getBoundingClientRect();

  let newX;
  let newY;

  if ($q.screen.lt.sm) {
    // 手機版的位置計算
    newX = 20;
    newY = rightRect.top + protectedHeight + 20;
  } else {
    // 桌面版的位置計算
    newX = rightRect.left + 20;
    newY = rightRect.top + protectedHeight + 20;
  }

  const newNote = {
    ...defaultNote,
    x: newX,
    y: newY
  };

  await noteStore.addNote(newNote);
  isLoading.value = false;
};

const loadNotes = async () => {
  try {
    isLoading.value = true;
    await noteStore.loadNotes();
    console.log('Notes loaded:', notes.value);  // 添加日誌
  } catch (error) {
    console.error('載入便條失敗:', error);
    errorMessage.value = '載入便條失敗';
  } finally {
    isLoading.value = false;
  }
};

// 確保在組件掛載時載入便條
onMounted(() => {
  loadNotes();
});

// 修改 handleReorder 函數以使用新的單個更新方法
const handleReorder = async ({ from, to }) => {
  try {
    if (isReordering.value || from === to) return; // 如果正在重排序或位置未變，則跳過
    isReordering.value = true;

    // 獲取當前便條列表的副本
    const notesList = [...orderedNotes.value];

    // 獲取要移動的便條
    const movedNote = notesList[from];

    // 只更新移動的便條，不更新其他便條
    if (movedNote) {
      // 直接調用專門的單個位置更新方法
      await noteStore.updateSinglePosition(movedNote._id, to);

      // 成功提示
      $q.notify({
        message: '便條順序已更新',
        color: 'positive',
        position: 'top',
        timeout: 1000
      });
    }
  } catch (error) {
    console.error('更新順序失敗:', error);
    $q.notify({
      message: '更新順序失敗',
      color: 'negative',
      position: 'top'
    });
  } finally {
    // 延遲恢復標記，避免頻繁觸發
    setTimeout(() => {
      isReordering.value = false;
    }, 300);
  }
};

// 簡化視圖模式更新功能，避免無限遞迴
const updateViewMode = () => {
  // 檢查方法是否存在，且當前狀態與新狀態不同時才更新
  if (noteStore.setMobileView && noteStore.isMobileView !== $q.platform.is.mobile) {
    noteStore.setMobileView($q.platform.is.mobile);
  }
}
</script>

<style scoped>
/* 移除 q-page 的預設 padding */
:deep(.q-page) {
  padding: 0 !important;
  min-height: unset !important;
}

.board-page {
  height: 100%;
  width: 100%;
  overflow: hidden;
  padding: 0;
  display: flex;
}

.board-container {
  display: flex;
  flex: 1;
  width: 100%;
  overflow: hidden;
}

.left-column {
  width: fit-content;
  min-width: 120px;
  background-color: #333333;
  border-right: 1px solid #ddd;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  overflow: hidden;
  gap: 20px;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.add-btn-container {
  display: flex;
  justify-content: center;
  width: 100%;
}

.add-note-btn {
  width: 48px;
  height: 48px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.add-note-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* 暗色模式適配 */
.q-dark .add-note-btn {
  border-color: rgba(255, 255, 255, 0.1);
}

.q-dark .add-note-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.right-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.note-display-area {
  flex: 1;
  position: relative;
  padding: 20px;
  overflow: auto;
}

.protected-area {
  padding: 8px;
  background-color: rgba(255, 255, 255, 0.8); /* 半透明背景 */
  backdrop-filter: blur(4px);
  border-bottom: 1px solid #eee;
  min-height: 40px;
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: #333;
}

.error {
  color: red;
  margin: 10px 0;
}

.urgent-notes-preview {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  padding: 4px 0;
}

.urgent-note-btn {
  background: rgba(255, 68, 68, 0.1);
  color: #ff4444;
  font-size: 0.9em;
  border-radius: 16px;
  padding: 4px 12px;
  min-height: unset;
  transition: all 0.3s ease;
}

.urgent-note-btn:hover {
  background: rgba(255, 68, 68, 0.2);
  transform: translateY(-1px);
}

/* 便條高亮動畫 */
@keyframes highlight {
  0%, 100% { background-color: transparent; }
  50% { background-color: rgba(255, 68, 68, 0.1); }
}

.highlight {
  animation: highlight 2s ease;
}

/* 手機版樣式 */
.mobile-add-btn {
  position: fixed;
  bottom: 16px;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-top: 1px solid #eee;
}

/* 響應式調整 */
@media (max-width: 599px) {
  .board-container {
    flex-direction: column;
  }

  .right-section {
    width: 100%;
  }

  .note-display-area {
    padding: 10px;
  }

  .protected-area {
    padding: 8px;
  }

  .urgent-note-btn {
    font-size: 0.8em;
    padding: 2px 8px;
  }
}

/* 新增便條的轉場效果 */
::view-transition-old(new-note) {
  animation: fade-out 0.3s ease-in-out;
}

::view-transition-new(new-note) {
  animation: scale-in 0.3s ease-in-out;
}

@keyframes scale-in {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes fade-out {
  from { opacity: 1; }
  to { opacity: 0; }
}

/* 視圖模式切換器樣式 */
.view-mode-switcher {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.view-mode-switcher .q-btn-group {
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  display: flex;
  flex-direction: column;
}

.view-mode-switcher .q-btn {
  padding: 12px;
  width: 48px;
  height: 48px;
}

.view-mode-switcher .q-btn:not(:last-child) {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.view-mode-switcher .q-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.view-mode-switcher .q-btn.text-primary {
  background: rgba(255, 255, 255, 0.15);
}

/* 暗色模式適配 */
.q-dark .view-mode-switcher .q-btn-group {
  border-color: rgba(255, 255, 255, 0.1);
}

.q-dark .view-mode-switcher .q-btn:not(:last-child) {
  border-bottom-color: rgba(255, 255, 255, 0.1);
}

/* 移動視圖樣式 */
.mobile-view .board-container {
  flex-direction: column;
}

.mobile-view .right-section {
  width: 100%;
}

.mobile-layout {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  padding-bottom: 80px; /* 為底部按鈕留出空間 */
  padding-right: 50px;
}

/* 修改手機版便條的樣式 */
.mobile-layout :deep(.note) {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  position: relative;
  transition: transform 0.2s ease, opacity 0.2s ease;
  padding-left: 50px; /* 改為左側預留空間 */
  padding-right: 0; /* 移除右側空間 */
}

.mobile-layout :deep(.note.dragging) {
  opacity: 0.7;
  transform: scale(1.02);
}

.mobile-layout :deep(.tools-group) {
  opacity: 1; /* 改為完全不透明 */
}

.mobile-layout :deep(.tools-group:hover) {
  opacity: 1;
}

/* 暗色模式適配 */
.q-dark .mobile-add-btn {
  background: rgba(40, 40, 40, 0.9);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

/* 虛擬滾動樣式 */
.mobile-virtual-scroll {
  width: 100%;
  border-radius: 0;
  background: transparent;
}

/* 防止虛擬滾動項目閃爍 */
.q-virtual-scroll__content {
  contain: content;
}
</style>
