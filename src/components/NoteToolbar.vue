<template>
  <div
    class="tools-group"
    :class="{
      'tools-collapsed': !showTools && !forceMobile,
      'mobile-tools': forceMobile
    }"
  >
    <!-- 向上標籤 (僅桌面版顯示) -->
    <div class="tools-indicator" v-if="!forceMobile">
      <q-icon :name="showTools ? 'keyboard_arrow_down' : 'keyboard_arrow_up'" />
    </div>

    <!-- 工具列 -->
    <div class="footer-tools" :class="{ 'mobile-footer-tools': forceMobile }">
      <div class="tools-buttons" :class="{ 'mobile-buttons': forceMobile }">
        <div
          class="color-picker-container"
          @mouseenter="handleColorPanelMouseEnter"
          @mouseleave="handleColorPanelMouseLeave"
          style="position: relative; z-index: 1002;"
        >
          <q-btn
            flat
            dense
            size="sm"
            icon="palette"
            @click="toggleColorPanel"
          >
            <q-tooltip>便條顏色</q-tooltip>
          </q-btn>
        </div>
        <q-btn
          flat
          dense
          :size="forceMobile ? 'xs' : 'sm'"
          icon="content_copy"
          @click="onDuplicate"
        >
          <q-tooltip>複製便條</q-tooltip>
        </q-btn>
        <q-btn
          flat
          dense
          :size="forceMobile ? 'xs' : 'sm'"
          :icon="isUrgent ? 'warning' : 'report'"
          :color="isUrgent ? 'red' : ''"
          @click="onToggleUrgent"
        >
          <q-tooltip>{{ isUrgent ? '取消緊急' : '設為緊急' }}</q-tooltip>
        </q-btn>
        <q-btn
          flat
          dense
          :size="forceMobile ? 'xs' : 'sm'"
          icon="delete"
          color="negative"
          @click="onDelete"
        >
          <q-tooltip>刪除便條</q-tooltip>
        </q-btn>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  showTools: {
    type: Boolean,
    default: false
  },
  forceMobile: {
    type: Boolean,
    default: false
  },
  isUrgent: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits([
  'duplicate',
  'toggle-urgent',
  'delete',
  'color-panel-mouseenter',
  'color-panel-mouseleave',
  'toggle-color-panel'
])

// 顏色面板鼠標事件
const handleColorPanelMouseEnter = () => {
  emit('color-panel-mouseenter');
};

const handleColorPanelMouseLeave = () => {
  emit('color-panel-mouseleave');
};

// 切換顏色面板
const toggleColorPanel = () => {
  emit('toggle-color-panel');
};

// 複製便條
const onDuplicate = () => {
  emit('duplicate');
};

// 切換緊急狀態
const onToggleUrgent = () => {
  emit('toggle-urgent');
};

// 刪除便條
const onDelete = () => {
  emit('delete');
};
</script>

<style scoped>
.tools-group {
  width: 100%;
  position: relative;
  transition: all 0.3s ease;
}

.tools-collapsed {
  transform: translateY(100%); /* 完全隱藏功能列 */
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
  transition: opacity 0.3s ease;
}

.footer-tools {
  background: rgba(255, 255, 255, 0.3);
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

.tools-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
}

/* 懸停效果 */
.tools-group:hover .tools-indicator,
.tools-group:hover .footer-tools {
  opacity: 0.8;
}

/* 按鈕樣式 */
.tools-buttons .q-btn {
  color: rgba(0, 0, 0, 0.8);
}

.tools-buttons .q-btn:hover {
  color: rgba(0, 0, 0, 1);
  background: rgba(255, 255, 255, 0.2);
}

/* 暗色模式適配 */
.q-dark .tools-indicator,
.q-dark .footer-tools {
  background: rgba(40, 40, 40, 0.3);
}

.q-dark .tools-buttons .q-btn {
  color: rgba(255, 255, 255, 0.8);
}

.q-dark .tools-buttons .q-btn:hover {
  color: rgba(255, 255, 255, 1);
  background: rgba(255, 255, 255, 0.1);
}

.mobile-tools {
  opacity: 1;
}

.mobile-footer-tools {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  border-radius: 0;
  z-index: 1000;
}

.mobile-buttons {
  width: 100%;
  justify-content: space-around;
}
</style>
