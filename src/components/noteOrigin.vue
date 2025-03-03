<template>
  <div
    class="note"
    :style="{
      transform: props.forceMobile ? 'none' : `translate(${currentPosition.x}px, ${currentPosition.y}px)`,
      backgroundColor: noteColor,
      color: props.note?.color?.text || (isDarkMode ? '#ffffff' : '#000000'),
      zIndex: zIndex
    }"
    draggable="true"
    @dragstart.stop="onDragStart"
    @drag.stop="onDrag"
    @dragend.stop="onDragEnd"
    @dragover.prevent="onDragOver"
    @drop.prevent="onDrop"
    @click="onNoteClick"
    :class="{
      'resizable': isExpanded,
      'urgent-note': props.note.isUrgent,
      'dragging': isDragging,
      'dark-mode': isDarkMode,
      'mobile-mode': props.forceMobile
    }"
    :data-urgent="props.note.isUrgent"
    :view-transition-name="viewTransitionName"
  >
    <!-- 標題欄 -->
    <div class="note-header" @click.stop>
      <div class="title-container">
        <textarea
          v-model="noteTitle"
          class="title-input"
          @blur="saveNote"
          @input="autoGrowTitle"
          @focus="onTitleFocus"
          :placeholder="t('note.title')"
          :class="{ 'urgent-title': props.note.isUrgent }"
          :style="{
            maxHeight: `${LINE_HEIGHT * MAX_TITLE_LINES}px`
          }"
          rows="1"
          ref="titleInput"
        ></textarea>
      </div>
      <div class="note-controls">
        <q-btn
          flat
          dense
          :icon="isExpanded ? 'expand_less' : 'expand_more'"
          @click.stop="toggleExpand"
        />
      </div>
    </div>

    <!-- 內容區 -->
    <div v-show="isExpanded" class="note-content" @click="closeColorPanels">
      <!-- 文字格式工具欄 -->
      <div class="format-toolbar" @click.stop>
        <div class="format-buttons">
          <q-btn-group flat dense class="format-group">
            <q-btn
              v-for="btn in formatButtons"
              :key="btn.command"
              flat
              dense
              size="xs"
              @click="formatText(btn.command)"
              :color="isFormatActive(btn.command) ? 'primary' : ''"
              class="format-btn"
            >
              <q-icon :name="btn.icon" size="xs" />
              <q-tooltip>{{ t(`note.format.${btn.command}`) }}</q-tooltip>
            </q-btn>
          </q-btn-group>
        </div>
      </div>

      <!-- 內容編輯區 -->
      <div
        class="content-editor"
        contenteditable="true"
        ref="editor"
        @input="onEditorInput"
        @blur="saveNote"
        @focus="onEditorFocus"
        @keydown="handleEditorKeydown"
        @click.stop
        :style="{
          minHeight: contentMinHeight,
          maxHeight: contentMaxHeight
        }"
      ></div>

      <!-- 功能列容器 -->
      <div
        class="footer-container"
        :class="{ 'mobile-tools-container': props.forceMobile }"
        @mouseenter="showTools = true"
        @mouseleave="handleToolsLeave"
      >
        <div class="tools-group" :class="{ 'tools-collapsed': !showTools && !forceMobile }">
          <!-- 向上標籤 (僅桌面版顯示) -->
          <div class="tools-indicator" v-if="!forceMobile">
            <q-icon :name="showTools ? 'keyboard_arrow_down' : 'keyboard_arrow_up'" />
          </div>

          <!-- 工具列 -->
          <div class="footer-tools" :class="{ 'mobile-footer-tools': forceMobile }">
            <div class="tools-buttons" :class="{ 'mobile-buttons': forceMobile }">
              <q-btn-dropdown
                flat
                dense
                size="sm"
                icon="palette"
                class="color-dropdown"
              >
                <!-- 顏色選擇面板 -->
                <template v-slot:default>
                  <div class="color-panel q-pa-sm">
                    <div class="color-grid">
                      <div
                        v-for="color in colorOptions"
                        :key="color.name"
                        class="color-option"
                        :style="{ backgroundColor: isDarkMode ? color.dark : color.light }"
                        @click="selectColor(color)"
                      >
                        <q-icon
                          v-if="isCurrentColor(color)"
                          name="check"
                          size="xs"
                          :style="{ color: color.text }"
                        />
                      </div>
                    </div>
                  </div>
                </template>

                <!-- tooltip 放在 label 插槽中 -->
                <template v-slot:label>
                  <div class="row items-center no-wrap">
                    <q-icon name="palette" />
                    <q-tooltip>便條顏色</q-tooltip>
                  </div>
                </template>
              </q-btn-dropdown>
              <q-btn
                flat
                dense
                size="sm"
                icon="content_copy"
                @click="duplicateNote"
              >
                <q-tooltip>複製便條</q-tooltip>
              </q-btn>
              <q-btn
                flat
                dense
                size="sm"
                :icon="props.note.isUrgent ? 'warning' : 'report'"
                :color="props.note.isUrgent ? 'red' : ''"
                @click="toggleUrgent"
              >
                <q-tooltip>{{ props.note.isUrgent ? '取消緊急' : '設為緊急' }}</q-tooltip>
              </q-btn>
              <q-btn
                flat
                dense
                size="sm"
                icon="delete"
                color="negative"
                @click="confirmDelete"
              >
                <q-tooltip>刪除便條</q-tooltip>
              </q-btn>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部功能欄 -->
    <div v-if="isExpanded" class="note-footer">

    </div>

    <!-- 手機版工具列 -->
    <div
      v-if="props.forceMobile"
      class="mobile-tools-container"
    >
      <div class="mobile-footer-tools">
        <div class="mobile-buttons">
          <q-btn-dropdown
            flat
            dense
            size="xs"
            class="color-dropdown"
          >
            <template v-slot:default>
              <div class="color-panel q-pa-sm">
                <div class="color-grid">
                  <div
                    v-for="color in colorOptions"
                    :key="color.name"
                    class="color-option"
                    :style="{ backgroundColor: isDarkMode ? color.dark : color.light }"
                    @click="selectColor(color)"
                  >
                  </div>
                </div>
              </div>
            </template>

            <!-- tooltip 放在 label 插槽中 -->
            <template v-slot:label>
              <div class="row items-center no-wrap">
                <q-icon name="palette" />
                <q-tooltip>便條顏色</q-tooltip>
              </div>
            </template>
          </q-btn-dropdown>
          <q-btn
            flat
            dense
            size="xs"
            icon="content_copy"
            @click="duplicateNote"
          >
            <q-tooltip>複製便條</q-tooltip>
          </q-btn>
          <q-btn
            flat
            dense
            size="xs"
            :icon="props.note.isUrgent ? 'warning' : 'report'"
            :color="props.note.isUrgent ? 'red' : ''"
            @click="toggleUrgent"
          >
            <q-tooltip>{{ props.note.isUrgent ? '取消緊急' : '設為緊急' }}</q-tooltip>
          </q-btn>
          <q-btn
            flat
            dense
            size="xs"
            icon="delete"
            color="negative"
            @click="confirmDelete"
          >
            <q-tooltip>{{ t('note.tooltip.delete') }}</q-tooltip>
          </q-btn>
        </div>
      </div>
    </div>

    <!-- 修改顏色面板，移除未使用的事件處理器 -->
    <div
      v-if="showColorPanel"
      class="color-panel"
      style="position: fixed; z-index: 9999;"
    >
      <div class="color-grid">
        <div
          v-for="color in colorOptions"
          :key="color.name"
          class="color-option"
          :style="{ backgroundColor: isDarkMode ? color.dark : color.light }"
          @click.stop="selectColor(color)"
        >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch, onBeforeUnmount, shallowRef } from 'vue';
import { useNoteStore } from '../stores/noteStore';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n'
import { useNoteActions } from '../composables/useNoteActions';
import { debounce } from 'lodash';

const props = defineProps({
  note: {
    type: Object,
    required: true
  },
  forceMobile: {
    type: Boolean,
    default: false
  },
  index: {
    type: Number,
    default: -1
  }
});

const noteStore = useNoteStore();
const editor = ref(null);
const $q = useQuasar();
const { t } = useI18n()

// 修改後：
const isUrgent = ref(false); // 先設定初始值

// 確保在初始化和更新時都能正確同步
watch(() => props.note.isUrgent, (newValue) => {
  isUrgent.value = newValue;
}, { immediate: true }); // immediate: true 確保組件創建時就執行

const noteTitle = ref(props.note.title || '');

// 預設尺寸設定
const DEFAULT_WIDTH = 200; // px
const LINE_HEIGHT = 20;    // 每行文字高度
const MIN_VISIBLE_LINES = 6; // 內容最小可見行數
const MAX_VISIBLE_LINES = 10; // 內容最大可見行數
const MAX_TITLE_LINES = 5;  // 標題最大行數

// 計算內容區域的最小和最大高度
const contentMinHeight = computed(() => `${LINE_HEIGHT * MIN_VISIBLE_LINES}px`);
const contentMaxHeight = computed(() => `${LINE_HEIGHT * MAX_VISIBLE_LINES}px`);

const isExpanded = ref(props.note.isExpanded);

// 新增狀態
const isDragging = ref(false);
const zIndex = ref(1);

// 拖曳相關
const startPos = ref({ x: 0, y: 0 });
const currentPosition = shallowRef({
  x: props.note?.x || 0,
  y: props.note?.y || 0
});

// 添加高亮狀態
const isHighlighted = ref(false);

// 添加一個響應式的暗色模式狀態
const isDarkMode = computed(() => $q.dark.isActive);

// 修改 noteColor 計算屬性
const noteColor = computed(() => {
  const isDark = isDarkMode.value;  // 使用計算屬性

  if (!props.note?.color) {
    return isDark ? '#424242' : '#ffffff';
  }

  try {
    const { light, dark } = props.note.color;

    if (!light || !dark) {
      throw new Error('Missing light or dark color value');
    }

    const selectedColor = isDark ? dark : light;
    console.log('Color selection:', {
      isDark,
      light,
      dark,
      selected: selectedColor
    });

    return selectedColor;
  } catch (error) {
    console.warn('Error processing color:', error);
    return isDark ? '#424242' : '#ffffff';
  }
});

const updateZIndex = () => {
  zIndex.value = Date.now();
};

// 在編輯器獲得焦點時更新 zIndex
const onEditorFocus = () => {
  updateZIndex();
};

// 在標題輸入框獲得焦點時更新 zIndex
const onTitleFocus = () => {
  updateZIndex();
};

// 在 setup 中獲取共用函數
const {
  toggleUrgent: doToggleUrgent,
  duplicateNote: doDuplicateNote,
  deleteNote: doDeleteNote,
  saveNote: doSaveNote
} = useNoteActions();

// 添加邊界限制常量
const BOUNDARY_MARGIN = 20; // 邊界安全距離

// 修改拖曳相關的代碼
const onDragStart = (e) => {
  if (props.forceMobile) {
    // 手機版的拖曳排序邏輯
    isDragging.value = true
    e.dataTransfer.effectAllowed = 'move'
    // 儲存當前拖曳的便條索引
    e.dataTransfer.setData('text/plain', props.index)
    emit('dragstart', props.index)
  } else {
    // 桌面版的自由拖曳邏輯保持不變
    isDragging.value = true
    startPos.value = {
      x: e.clientX - currentPosition.value.x,
      y: e.clientY - currentPosition.value.y
    }
    updateZIndex()
    emit('dragstart', props.note._id)
  }
}

const onDrag = (e) => {
  if (!isDragging.value) return

  if (!props.forceMobile) {
    // 桌面版的自由拖曳邏輯
    if (e.clientX === 0 && e.clientY === 0) return
    let newX = e.clientX - startPos.value.x
    let newY = e.clientY - startPos.value.y

    // 獲取容器邊界
    const container = document.querySelector('.board-page')
    if (!container) return

    const containerRect = container.getBoundingClientRect()
    const noteRect = {
      width: 200,
      height: 200
    }

    // 限制範圍
    newX = Math.max(BOUNDARY_MARGIN, Math.min(containerRect.width - noteRect.width - BOUNDARY_MARGIN, newX))
    newY = Math.max(BOUNDARY_MARGIN, Math.min(containerRect.height - noteRect.height - BOUNDARY_MARGIN, newY))

    // 更新位置，拖動過程中使用防抖保存
    currentPosition.value = { x: newX, y: newY }
    debouncedUpdatePosition(newX, newY)
  }
}

const onDragEnd = async () => {
  if (!isDragging.value) return

  isDragging.value = false
  emit('dragend')

  // 如果不是手機版，則更新位置
  if (!props.forceMobile) {
    // 取消任何尚未執行的防抖更新
    debouncedUpdatePosition.cancel()

    // 確保位置有效
    const { x, y } = currentPosition.value
    if (typeof x === 'number' && typeof y === 'number' &&
        Number.isFinite(x) && Number.isFinite(y)) {
      // 保存最終位置（僅執行一次）
      await noteStore.updateNote(props.note._id, { x, y })
    }
  }
}

// 添加拖曳排序相關的處理函數
const onDragOver = (e) => {
  if (props.forceMobile) {
    e.preventDefault()
    emit('dragover', props.index)
  }
}

const onDrop = (e) => {
  if (props.forceMobile) {
    e.preventDefault()
    const fromIndex = Number.parseInt(e.dataTransfer.getData('text/plain'))
    emit('reorder', { from: fromIndex, to: props.index })
  }
}

// 監聽位置變化
watch(() => props.note?.x, (newX) => {
  if (newX !== undefined) {
    currentPosition.value.x = newX
  }
}, { immediate: true })

watch(() => props.note?.y, (newY) => {
  if (newY !== undefined) {
    currentPosition.value.y = newY
  }
}, { immediate: true })

const toggleUrgent = async () => {
  const newState = await doToggleUrgent(props.note._id, props.note.isUrgent);
  isUrgent.value = newState;
};

const duplicateNote = async () => {
  await doDuplicateNote(props.note);
};

const saveNote = async () => {
  if (!props.note._id) return;

  try {
    const updates = {
      title: noteTitle.value,
      content: editor.value?.innerHTML || '',
      isExpanded: isExpanded.value,
      isUrgent: isUrgent.value
    };

    await doSaveNote(props.note._id, updates);
  } catch (error) {
    console.error('保存便條失敗:', error);
  }
};

// 基礎顏色變數
const noteColors = {
  default: {
    name: 'default',
    light: {
      bg: '#ffffff',
      text: '#000000'
    },
    dark: {
      bg: '#424242',
      text: '#ffffff'
    }
  },
  blue: {
    name: 'blue',
    light: {
      bg: '#E3F2FD',
      text: '#1565C0'
    },
    dark: {
      bg: '#1565C0',
      text: '#E3F2FD'
    }
  },
  green: {
    name: 'green',
    light: {
      bg: '#E8F5E9',
      text: '#2E7D32'
    },
    dark: {
      bg: '#2E7D32',
      text: '#E8F5E9'
    }
  },
  yellow: {
    name: 'yellow',
    light: {
      bg: '#FFF8E1',
      text: '#F9A825'
    },
    dark: {
      bg: '#F9A825',
      text: '#FFF8E1'
    }
  },
  pink: {
    name: 'pink',
    light: {
      bg: '#FCE4EC',
      text: '#C2185B'
    },
    dark: {
      bg: '#C2185B',
      text: '#FCE4EC'
    }
  },
  purple: {
    name: 'purple',
    light: {
      bg: '#F3E5F5',
      text: '#7B1FA2'
    },
    dark: {
      bg: '#7B1FA2',
      text: '#F3E5F5'
    }
  },
  orange: {
    name: 'orange',
    light: {
      bg: '#FFF3E0',
      text: '#EF6C00'
    },
    dark: {
      bg: '#EF6C00',
      text: '#FFF3E0'
    }
  },
  gray: {
    name: 'gray',
    light: {
      bg: '#F5F5F5',
      text: '#616161'
    },
    dark: {
      bg: '#616161',
      text: '#F5F5F5'
    }
  }
};

// 轉換為 colorOptions 格式
const colorOptions = computed(() =>
  Object.values(noteColors).map(color => ({
    name: color.name,
    light: color.light.bg,
    dark: color.dark.bg,
    text: isDarkMode.value ? color.dark.text : color.light.text
  }))
);

// 檢查是否為當前顏色功能需要調整
const isCurrentColor = (color) => {
  if (!props.note.color) return false;
  return (
    props.note.color.light === color.light &&
    props.note.color.dark === color.dark &&
    props.note.color.text === color.text
  );
};

// 選擇顏色
const selectColor = async (color) => {
  console.log('選擇顏色:', color);
  try {
    const updatedNote = {
      ...props.note,
      color: {
        light: color.light,
        dark: color.dark,
        text: color.text
      }
    };

    emit('update:note', updatedNote);

    await noteStore.updateNote(props.note._id, {
      color: {
        light: color.light,
        dark: color.dark,
        text: color.text
      }
    });

    showColorPanel.value = false;

    $q.notify({
      message: '顏色已更新',
      color: 'positive',
      position: 'top',
      timeout: 1000
    });
  } catch (error) {
    console.error('更新顏色失敗:', error);
    $q.notify({
      message: '更新顏色失敗',
      color: 'negative',
      position: 'top'
    });
  }
};

const titleInput = ref(null);

// 自動調整文本區域高度
const autoGrowTitle = () => {
  if (titleInput.value?.style) {
    titleInput.value.style.height = 'auto';
    const newHeight = Math.min(
      titleInput.value.scrollHeight,
      LINE_HEIGHT * MAX_TITLE_LINES
    );
    titleInput.value.style.height = `${newHeight}px`;
  }
};

// 監聽標題變化
watch(noteTitle, () => {
  nextTick(autoGrowTitle);
});

// 組件掛載後初始化
onMounted(() => {
  nextTick(() => {
    autoGrowTitle();
  });
  console.log('Note component mounted:', {
    isDark: $q.dark.isActive,
    initialColor: props.note?.color,
    computedColor: noteColor.value
  });
});

// 控制工具列顯示
const showTools = ref(false);

const handleToolsLeave = () => {
  if (props.forceMobile) return; // 手機版不自動隱藏
  showTools.value = false;
};

// 修改點擊事件處理
const onNoteClick = () => {
  updateZIndex();
  // 點擊時移除高亮
  isHighlighted.value = false;
};

// 確保在初始化時正確載入內容
onMounted(() => {
  if (editor.value) {
    editor.value.innerHTML = props.note.content || '';
  }
});

// 修改 debouncedUpdatePosition 的延遲時間
const debouncedUpdatePosition = debounce(async (x, y) => {
  try {
    // 確保位置有效且便條還存在
    if (props.note._id &&
        typeof x === 'number' &&
        typeof y === 'number' &&
        Number.isFinite(x) &&
        Number.isFinite(y)) {
      await noteStore.updateNote(props.note._id, { x, y });
    }
  } catch (error) {
    console.error('更新位置失敗:', error);
  }
}, 300);

// 監聽 props 變化
watch(() => props.note, (newNote) => {
  if (newNote) {
    isExpanded.value = newNote.isExpanded;
    isUrgent.value = newNote.isUrgent;
    noteTitle.value = newNote.title || '';
    currentPosition.value = {
      x: newNote.x || 0,
      y: newNote.y || 0
    };
  }
}, { deep: true });

// 添加設置高亮的方法
const highlight = () => {
  isHighlighted.value = true;
};

// 暴露方法給父組件
defineExpose({
  highlight
});

// 新增 viewTransitionName
const viewTransitionName = ref('');

// 監聽暗色模式變化，並強制更新
watch(isDarkMode, (newIsDark) => {
  console.log('Dark mode changed:', {
    isDark: newIsDark,
    currentColor: props.note?.color,
    computedColor: noteColor.value
  });

  // 強制更新組件
  nextTick(() => {
    // 觸發重新渲染
    if (props.note?.color) {
      const { light, dark } = props.note.color;
      console.log('Recomputing color:', {
        isDark: newIsDark,
        selectedColor: newIsDark ? dark : light
      });
    }
  });
}, { immediate: true });

// 在 script setup 開頭添加 emit 定義
const emit = defineEmits([
  'dragstart',
  'dragend',
  'delete',
  'dragover',
  'update:note',
  'position-change',
  'reorder'  // 新增排序事件
])

// 組件卸載時清理
onBeforeUnmount(() => {
  if (colorPanelTimer.value) {
    clearTimeout(colorPanelTimer.value);
  }
});

// 顏色面板相關函數
const closeColorPanels = () => {
  showColorPanel.value = false
}

// 修改顏色面板相關邏輯
// const toggleColorPanel = () => {
//   showColorPanel.value = !showColorPanel.value

//   if (showColorPanel.value) {
//     nextTick(() => {
//       const closePanel = (e) => {
//         if (!e.target.closest('.color-panel') && !e.target.closest('.tools-buttons')) {
//           showColorPanel.value = false
//           document.removeEventListener('click', closePanel)
//         }
//       }

//       setTimeout(() => {
//         document.addEventListener('click', closePanel)
//       }, 10)
//     })
//   }
// }

// 需要定義的變數
const showColorPanel = ref(false)
const colorPanelTimer = ref(null)

// 添加 toggleExpand 函數
const toggleExpand = async () => {
  isExpanded.value = !isExpanded.value

  // 更新便條狀態
  try {
    await noteStore.updateNote(props.note._id, {
      isExpanded: isExpanded.value
    })
  } catch (error) {
    console.error('更新展開狀態失敗:', error)
  }
}

// 添加文本格式化相關的狀態和函數
const formatText = (command) => {
  document.execCommand('styleWithCSS', false, true)
  document.execCommand(command, false, null)
}

const isFormatActive = (format) => {
  try {
    if (!window.getSelection) return false
    const selection = window.getSelection()
    if (!selection.rangeCount) return false

    document.execCommand('styleWithCSS', false, true)
    return document.queryCommandState(format)
  } catch (error) {
    console.error('檢查格式狀態失敗:', error)
    return false
  }
}

// 修改編輯器輸入處理函數
const onEditorInput = () => {
  if (!editor.value) return
  const content = editor.value.innerHTML
  debouncedSave({
    content
  })
}

const handleEditorKeydown = (e) => {
  if (e.key === 'Enter' && e.ctrlKey) {
    e.preventDefault()
    saveNote()
  }
}

// 修改模板中的格式化按鈕部分
const formatButtons = [
  { icon: 'format_bold', command: 'bold' },
  { icon: 'format_italic', command: 'italic' },
  { icon: 'format_underline', command: 'underline' },
  { icon: 'format_strikethrough', command: 'strikeThrough' },
  { icon: 'format_list_bulleted', command: 'insertUnorderedList' },
  { icon: 'format_list_numbered', command: 'insertOrderedList' },
  { icon: 'format_clear', command: 'removeFormat' }
];

// 修改確認刪除相關的代碼
const confirmDelete = async () => {
  $q.notify({
    message: t('note.delete.confirm'),
    color: 'warning',
    position: 'top',
    timeout: 0,
    multiLine: true,
    classes: 'delete-notification',
    actions: [
      {
        label: t('note.delete.cancel'),
        color: 'white'
      },
      {
        label: t('note.delete.delete'),
        color: 'negative',
        handler: async () => {
          try {
            await doDeleteNote(props.note._id) // 使用 doDeleteNote
          } catch (error) {
            console.error('刪除失敗:', error)
            $q.notify({
              message: t('note.delete.error'),
              color: 'negative',
              position: 'top',
              timeout: 2000
            })
          }
        }
      }
    ]
  })
}

// 添加缺失的 debouncedSave 函數
const debouncedSave = debounce(async (updates) => {
  try {
    // 使用 noteStore 的更新方法
    await noteStore.updateNote(props.note._id, updates)
  } catch (error) {
    console.error('更新失敗:', error)
  }
}, 300) // 300ms 的防抖延遲

</script>

<style scoped>
.note {
  position: absolute;
  will-change: transform;
  transition: transform 0.1s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 8px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
  cursor: grab;
  min-width: v-bind('props.mobile ? "150px" : "200px"');
  min-height: 40px;
  overflow: hidden;
  user-select: none;
  touch-action: none;
}

.note.dragging {
  transition: none;
  cursor: grabbing;
  opacity: 0.9;
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.3);
}

.note-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(4px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 8px;
  min-height: 36px;
  width: 100%;
  border-radius: 8px 8px 0 0;  /* 頂部圓角 */
}

.title-container {
  flex: 1;
  margin-right: 8px;
  min-width: 0; /* 重要：允許容器縮小 */
}

.title-input {
  width: 100%;
  border: none;
  background: transparent;
  font-weight: bold;
  font-size: 14px;
  line-height: 1.4;
  padding: 0;
  margin: 0;
  resize: none;
  overflow-y: auto; /* 改為 auto，允許在達到最大高度時滾動 */
  display: block;
  white-space: pre-wrap;
  word-wrap: break-word;
  min-height: 20px;
  color: inherit;
  font-family: inherit;
}

.title-input:focus {
  outline: none;
}

.title-input::placeholder {
  color: rgba(0, 0, 0, 0.5);
}

.note-controls {
  flex-shrink: 0; /* 防止按鈕被擠壓 */
  display: flex;
  align-items: flex-start;
}

.note-content {
  padding: 8px;
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
}

.format-toolbar {
  padding: 2px;  /* 減少內邊距 */
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  background-color: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(4px);
}

.format-buttons {
  display: flex;
  gap: 2px;  /* 減少按鈕間距 */
  justify-content: center;
}

.format-group {
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 4px;
}

.format-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;  /* 減小按鈕寬度 */
  height: 24px;  /* 減小按鈕高度 */
  transition: all 0.3s ease;
  padding: 0;  /* 移除內邊距 */
}

.format-btn:hover {
  transform: scale(1.2);
  background-color: rgba(255, 255, 255, 0.3);
}

.format-btn :deep(.q-icon) {
  font-size: 16px;  /* 減小圖標大小 */
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 確保按鈕內的圖標置中 */
.format-btn :deep(.q-btn__content) {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: unset;  /* 移除最小高度限制 */
}

.color-grid-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 4px;
}

.color-option {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.2s;
}

.color-option:hover {
  transform: scale(1.1);
}

.light-colors {
  border-bottom: 1px solid #eee;
  padding-bottom: 4px;
}

.dark-colors {
  padding-top: 4px;
}

.text-color-grid {
  min-width: 120px;
}

.content-editor {
  padding: 8px;
  min-height: 100px;
  overflow-y: auto;
  word-break: break-word;
  line-height: 1.5;
}

/* 確保待辦項目之間有適當的間距 */
.content-editor > .todo-item + .todo-item {
  margin-top: 2px;
}

/* 確保段落和待辦項目之間有合適的間距 */
.content-editor > p + .todo-item,
.content-editor > .todo-item + p {
  margin-top: 8px;
}

/* 移除最後一個元素的底部間距 */
.content-editor > :last-child {
  margin-bottom: 0;
}

/* 改進的 Todo 樣式 */
.todo-item {
  display: flex;
  align-items: flex-start;
  margin: 2px 0;
  padding: 1px 0;
  min-height: 24px;
}

.todo-label {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  cursor: pointer;
  position: relative;
  padding-left: 24px;
  user-select: none; /* 防止文字被選中 */
}

.todo-checkbox {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
  pointer-events: all; /* 確保 checkbox 可以被點擊 */
}

.checkbox-custom {
  position: absolute;
  left: 0;
  height: 16px;
  width: 16px;
  background-color: #fff;
  border: 2px solid rgba(0, 0, 0, 0.2);
  border-radius: 3px;
  transition: all 0.2s ease;
  pointer-events: none; /* 防止自定義 checkbox 干擾點擊 */
}

.todo-text {
  flex: 1;
  font-size: 0.9em;
  line-height: 1.4;
  min-height: 20px;
  padding: 2px 0;
  white-space: normal;
  word-break: break-word;
  cursor: text; /* 確保文字區域顯示文字游標 */
}

/* 移除多餘的空行 */
.content-editor br + br {
  display: none;
}

/* 確保待辦項目之間沒有多餘的空間 */
.todo-item + .todo-item {
  margin-top: 1px;
}

.text-color-option {
  padding: 4px 8px;
  font-weight: bold;
}

.color-picker {
  display: flex;
  justify-content: center;
  gap: 8px;
  padding: 8px;
  border-top: 1px solid rgba(0,0,0,0.1);
}

.color-option {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 2px;
  border: 1px solid rgba(0,0,0,0.1);
}

.color-option:hover {
  transform: scale(1.1);
}

.action-panel {
  position: absolute;
  right: 8px;
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  z-index: 100;
  padding: 8px;
  margin-top: 4px;
}

.delete-panel {
  width: 200px;
}

.delete-text {
  margin: 0 0 8px 0;
  font-size: 0.9em;
  text-align: center;
}

.delete-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.color-picker-container {
  position: relative;
  display: inline-block;
}

.color-panel {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(4px);
  border-radius: 4px;
  padding: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  min-width: 120px;
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4px;
}

.color-option {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
}

.color-option:hover {
  transform: scale(1.1);
}

/* 暗色模式適配 */
.q-dark .color-panel {
  background: rgba(40, 40, 40, 0.95);
}

.note-footer {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: inherit;
  border-radius: 0 0 3px 3px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 0;
}

.footer-container {
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
}

.tools-wrapper {
  position: absolute;
  left: 0;
  right: 0;
  bottom: -36px; /* 調整位置以容納標籤 */
  height: 36px;
  pointer-events: none;
  z-index: 1000;
}

.tools-container {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  pointer-events: auto;
}

/* 向上標籤樣式 */
.tools-indicator {
  position: absolute;
  left: 50%;
  top: 0;
  transform: translateX(-50%);
  width: 36px;
  height: 16px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(4px);
  border-radius: 4px 4px 0 0;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  pointer-events: auto;
  transition: background-color 0.3s ease;
}

.tools-indicator:hover {
  background: rgba(255, 255, 255, 0.9);
}

.tools-indicator .q-icon {
  opacity: 0.6;
}

/* 桌面版工具列 */
.desktop-tools {
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(4px);
  border-radius: 4px 4px 0 0;
  padding: 4px 8px;
  transition: all 0.3s ease;
  box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.1);
  pointer-events: auto;
}

.tools-hidden {
  opacity: 0;
  transform: translate(-50%, 100%);
  pointer-events: none;
}

/* 手機版工具列容器 */
.mobile-tools-container {
  position: absolute;
  top: 50%;
  left: -40px; /* 調整到完全靠左 */
  transform: translateY(-50%);
  width: 32px; /* 稍微縮小寬度 */
  z-index: 1000;
}

.mobile-footer-tools {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  border-radius: 4px;
  padding: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.mobile-buttons {
  display: flex;
  flex-direction: column;
  gap: 6px; /* 稍微縮小間距 */
  align-items: center;
}

.mobile-buttons .q-btn {
  width: 24px; /* 稍微縮小按鈕 */
  height: 24px;
  padding: 0;
  min-height: 24px; /* 確保最小高度 */
}

/* 暗色模式適配 */
.q-dark .mobile-footer-tools {
  background: rgba(40, 40, 40, 0.9);
}

/* 調整按鈕的顏色，使其在半透明背景上更明顯 */
.tools-buttons .q-btn {
  color: rgba(0, 0, 0, 0.8);
}

/* 懸停時的效果 */
.tools-buttons .q-btn:hover {
  color: rgba(0, 0, 0, 1);
  background: rgba(255, 255, 255, 0.2);
}

/* 調整 resize 手柄的位置，避免與底部工具列重疊 */
.resizable:not(:hover) {
  resize: none;
}

.resizable:hover {
  resize: both;
}

/* 對話框樣式 */
.delete-dialog {
  z-index: 9999;
}

.color-picker-dialog {
  min-width: 250px;
}

/* Webkit (Chrome, Safari, Edge) 滾動條樣式 */
.content-editor::-webkit-scrollbar {
  width: 6px;
}

.content-editor::-webkit-scrollbar-track {
  background: transparent;
}

.content-editor::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

.content-editor::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.2);
}

/* 收起狀態的高度 */
.note:not(.expanded) {
  height: auto !important;
  min-height: unset !important;
}

/* 展開狀態的最小高度 */
.note.expanded {
  min-height: v-bind('`${DEFAULT_WIDTH}px`') !important;
}

/* 確保收起狀態時標題欄也能正常顯示 */
.note:not(.expanded) .note-header {
  border-bottom: none;
}

/* 移除 textarea 的默認樣式 */
.title-input::-webkit-scrollbar {
  display: none;
}

.title-input {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.tools-indicator {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(4px);
  border-radius: 8px 8px 0 0;
  padding: 2px 8px;
  cursor: pointer;
  transition: opacity 0.3s ease;
}

.tools-indicator .q-icon {
  font-size: 20px;
  opacity: 0.7;
}

/* 文字格式工具列 */
.format-toolbar {
  padding: 2px;  /* 減少內邊距 */
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  background-color: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(4px);
}

/* 底部功能列 */
.tools-indicator {
  width: 40px;
  height: 8px;
  background: rgba(255, 255, 255, 0.3); /* 更透明 */
  backdrop-filter: blur(4px);
  border-radius: 8px 8px 0 0;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  cursor: pointer;
  z-index: 1;
  transition: opacity 0.3s ease;
}

.footer-tools {
  background: rgba(255, 255, 255, 0.3); /* 更透明 */
  backdrop-filter: blur(4px);
  border-radius: 8px 8px 0 0;
  padding: 8px;
  width: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.03);
  opacity: 0.6;
  transition: opacity 0.3s ease;
}

.tools-group:hover .tools-indicator,
.tools-group:hover .footer-tools {
  opacity: 0.8; /* 懸停時也保持一定的透明度 */
}

/* 按鈕樣式調整 */
.format-toolbar .q-btn,
.tools-buttons .q-btn {
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.format-toolbar .q-btn:hover,
.tools-buttons .q-btn:hover {
  opacity: 1;
  background: rgba(255, 255, 255, 0.2);
}

/* 當按鈕處於激活狀態時 */
.format-toolbar .q-btn.text-primary,
.tools-buttons .q-btn.text-primary {
  opacity: 1;
}

.urgent-note {
  border: 2px solid #FF0000 !important;
}

.urgent-note .title-input {
  color: #FF0000 !important;
}

/* 確保緊急便條的標題顏色 */
.note[data-urgent="true"] .title-input {
  color: #FF0000 !important;
}

/* 緊急便條的標題樣式 */
.urgent-title {
  color: #FF0000 !important;
}

/* 高亮狀態的邊框樣式 */
.note[data-highlighted="true"] {
  border: 2px solid #FF0000;
  box-shadow: 0 0 10px rgba(255, 0, 0, 0.3);
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

/* 添加暗色模式的樣式 */
.note.dark-mode {
  border-color: rgba(255, 255, 255, 0.1);
}

/* 移動設備模式的樣式 */
.note.mobile-mode {
  width: calc(100% - 20px);
  margin: 10px;
  position: relative;
  cursor: move;
}

.note.mobile-mode.dragging {
  opacity: 0.7;
  transform: scale(1.02) !important;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

/* 確保手機模式下的內容區域高度合適 */
.note.mobile-mode .note-content {
  max-height: none;
  min-height: 100px;
}

/* 手機版工具列樣式 */
.mobile-footer {
  position: relative;
  padding: 4px;
}

.mobile-tools {
  opacity: 0.4;
  transition: opacity 0.3s ease;
}

.mobile-tools:active,
.mobile-tools:hover {
  opacity: 1;
}

.mobile-tools .tools-buttons {
  display: flex;
  gap: 4px;
  justify-content: flex-end;
}

.footer-container {
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
}

.tools-group {
  position: relative;
  width: 100%;
  transition: all 0.3s ease;
}

.tools-collapsed {
  transform: translateY(calc(100% - 8px));
}

.tools-indicator {
  width: 40px;
  height: 8px;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(4px);
  border-radius: 8px 8px 0 0;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  cursor: pointer;
  z-index: 1;
}

.footer-tools {
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(4px);
  border-radius: 8px 8px 0 0;
  padding: 8px;
  width: 100%;
  display: flex;
  justify-content: center;
}

.tools-buttons {
  display: flex;
  gap: 8px;
}

/* 確保對話框在最上層 */
:deep(.q-dialog) {
  z-index: 9999 !important;
}

/* 移除這些樣式，因為我們不再需要它們 */
.color-picker-container,
.color-panel {
  display: block;  /* 改回 block，讓顏色面板可以顯示 */
}

/* 修改對話框樣式 */
:deep(.q-dialog__backdrop) {
  background: rgba(0, 0, 0, 0.4) !important;
}

.delete-dialog {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 暗色模式適配 */
:deep(.q-dark .q-card) {
  background: #424242;
}

/* 確保對話框遮罩層在最上層 */
:deep(.modal-backdrop) {
  z-index: 9998 !important;
}

/* 移除舊的顏色面板相關樣式 */
.color-dropdown {
  .color-panel {
    min-width: 150px;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 4px;
  }

  .color-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 4px;
  }

  .color-option {
    width: 24px;
    height: 24px;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s ease;
    border: 1px solid rgba(0, 0, 0, 0.1);

    &:hover {
      transform: scale(1.1);
    }
  }
}

/* 暗色模式適配 */
:deep(.q-dark) {
  .color-panel {
    background: rgba(40, 40, 40, 0.95);
  }

  .color-option {
    border-color: rgba(255, 255, 255, 0.1);
  }
}
</style>
