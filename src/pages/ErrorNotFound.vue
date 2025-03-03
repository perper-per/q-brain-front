<template>
  <div class="error-page">
    <!-- 404 區塊 -->
    <div class=" bg-blue text-white text-center q-pa-md flex flex-center">
      <div>
        <div style="font-size: 30vh">404</div>
        <div class="text-h2" style="opacity:.4">Oops. Nothing here...</div>
        <q-btn
          class="q-mt-xl"
          color="white"
          text-color="blue"
          unelevated
          to="/"
          label="Go Home"
          no-caps
        />
      </div>
    </div>

    <!-- 表單區塊 -->
    <div class="form-container">
      <form @submit.prevent="onSubmit">
        <!-- 主分類欄位 -->
        <div class="form-group">
          <label for="mainCategory">主分類：</label>
          <select
            id="mainCategory"
            :value="values.mainCategory"
            @change="handleMainCategoryChange"
          >
            <option value="">請選擇</option>
            <option value="fruits">水果</option>
            <option value="vegetables">蔬菜</option>
          </select>
          <span v-if="errors.mainCategory" class="error">{{ errors.mainCategory }}</span>
        </div>

        <!-- 次分類欄位 -->
        <div class="form-group">
          <label for="subCategory">次分類：</label>
          <select
            id="subCategory"
            :value="values.subCategory"
            @change="handleSubCategoryChange"
          >
            <option value="">請選擇</option>
            <option
              v-for="item in subCategoryOptions"
              :key="item"
              :value="item"
            >
              {{ item }}
            </option>
          </select>
          <span v-if="errors.subCategory" class="error">{{ errors.subCategory }}</span>
        </div>

        <button type="submit">送出</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';

// 主分類對應次分類的設定
const categoriesMapping = {
  fruits: ['apple', 'banana', 'orange'],
  vegetables: ['carrot', 'broccoli']
};

// Yup 驗證規則
const schema = yup.object({
  mainCategory: yup.string().required('請選擇主分類'),
  subCategory: yup
    .string()
    .when('mainCategory', (mainCategory, schema) => {
      // 如果沒有主分類，不需要驗證次分類
      if (!mainCategory) return schema.notRequired();

      // 有主分類時才驗證次分類
      return schema.required('請選擇次分類')
        .test({
          name: 'subCategory-match',
          message: '所選次分類不符合主分類',
          test: function (value) {
            const { mainCategory } = this.parent;
            // 如果沒有值，不進行驗證
            if (!value) return true;
            // 確認次分類存在於對應的主分類中
            return categoriesMapping[mainCategory]?.includes(value) ?? false;
          }
        });
    })
});

// 使用 useForm 時獲取更多方法
const { handleSubmit, values, errors, setFieldValue } = useForm({
  validationSchema: schema,
  initialValues: {
    mainCategory: '',
    subCategory: '',
  },
  validateOnMount: false
});

// 處理主分類變化
const handleMainCategoryChange = async (event) => {
  const newValue = event.target.value;
  await setFieldValue('mainCategory', newValue);
  await setFieldValue('subCategory', '');
};

// 處理次分類變化
const handleSubCategoryChange = async (event) => {
  const newValue = event.target.value;
  await setFieldValue('subCategory', newValue);
};

// 提交表單時的處理函式
const onSubmit = handleSubmit((formValues) => {
  console.log('表單提交：', formValues);
});

// 根據當前主分類計算次分類選項
const subCategoryOptions = computed(() => {
  console.log('當前主分類:', values.mainCategory);
  console.log('可用的次分類:', categoriesMapping[values.mainCategory]);
  return categoriesMapping[values.mainCategory] || [];
});
</script>

<style scoped>
.error-page {
  position: relative;
}

.form-container {
  position: absolute;
  top: 20px;
  right: 20px;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.form-group {
  margin-bottom: 15px;
}

.error {
  color: red;
  font-size: 0.8em;
}
</style>
