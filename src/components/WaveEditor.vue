<template>
  <q-card class="wave-editor q-pa-md">
    <q-card-section>
      <div class="text-h6">{{ $t('dashboard.waveEditor') }}</div>
    </q-card-section>

    <q-card-section>
      <div class="row q-col-gutter-md">
        <!-- 第一個顏色選擇器 -->
        <div class="col-12 col-sm-6">
          <q-input
            v-model="waveColor1"
            :label="$t('dashboard.waveColor1')"
            filled
            class="q-mb-md"
            @update:model-value="updatePreview"
          >
            <template v-slot:append>
              <q-icon name="colorize" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-color v-model="waveColor1" @update:model-value="updatePreview" />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>

        <!-- 第二個顏色選擇器 -->
        <div class="col-12 col-sm-6">
          <q-input
            v-model="waveColor2"
            :label="$t('dashboard.waveColor2')"
            filled
            class="q-mb-md"
            @update:model-value="updatePreview"
          >
            <template v-slot:append>
              <q-icon name="colorize" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-color v-model="waveColor2" @update:model-value="updatePreview" />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
      </div>

      <!-- 透明度滑塊 -->
      <div class="row q-col-gutter-md">
        <div class="col-12">
          <q-slider
            v-model="opacity"
            :min="0"
            :max="100"
            :step="1"
            :label="true"
            :label-value="`${opacity}%`"
            color="primary"
            class="q-mt-md"
            @update:model-value="updatePreview"
          />
          <div class="text-caption">{{ $t('dashboard.waveOpacity') }}: {{ opacity }}%</div>
        </div>
      </div>

      <!-- 隨機顏色按鈕 -->
      <div class="row q-mt-md">
        <q-btn
          color="primary"
          :label="$t('dashboard.randomColors')"
          @click="generateRandomColors"
          icon="shuffle"
          class="q-mt-sm"
        />
      </div>

      <!-- 保存按鈕
      <div class="row q-mt-md">
        <q-btn
          color="primary"
          :label="$t('common.save')"
          @click="saveSettings"
          class="q-mt-sm"
        />
      </div> -->
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'


const waveColor1 = ref('#f78da7')
const waveColor2 = ref('#fcb900')
const opacity = ref(30)

// 從 localStorage 加載設置
onMounted(() => {
  const savedSettings = localStorage.getItem('waveSettings')
  if (savedSettings) {
    const settings = JSON.parse(savedSettings)
    waveColor1.value = settings.color1
    waveColor2.value = settings.color2
    opacity.value = settings.opacity
    updatePreview()
  }
})

// 生成隨機顏色
const getRandomColor = () => {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

// 生成隨機顏色組合
const generateRandomColors = () => {
  waveColor1.value = getRandomColor()
  waveColor2.value = getRandomColor()
  updatePreview()
}

// 即時預覽
const updatePreview = () => {
  emit('update-wave', {
    color1: waveColor1.value,
    color2: waveColor2.value,
    opacity: opacity.value
  })
}

// 保存設置
// const saveSettings = () => {
//   const settings = {
//     color1: waveColor1.value,
//     color2: waveColor2.value,
//     opacity: opacity.value
//   }
//   localStorage.setItem('waveSettings', JSON.stringify(settings))

//   $q.notify({
//     color: 'positive',
//     message: t('dashboard.settingsSaved'),
//     icon: 'check'
//   })
// }

const emit = defineEmits(['update-wave'])

// 監聽所有值的變化
watch([waveColor1, waveColor2, opacity], () => {
  updatePreview()
}, { deep: true })
</script>

<style lang="scss" scoped>
.wave-editor {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
}

.dark .wave-editor {
  background: rgba(30, 30, 30, 0.8);
}
</style>
