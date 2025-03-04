export default {
  nav: {
    title: 'knotty brained',
    shortTitle: '♥ 舒結 ♥ 拉拉 ♥',
    menu: '選單',
    language: '語言',
    theme: '主題',
    register: '註冊',
    login: '登入',
    cart: '購物車',
    orders: '訂單',
    admin: '管理後台',
    dashboard: '個人頁面',
    logout: '登出',
    adminProducts: '商品管理',
    adminOrders: '訂單管理',
    home: '首頁',
    product: '商品',
    adminBulletin: '公告管理',
    adminPanel: '管理面板',
    adminMembers: '會員管理',
    adminComments: '留言管理',
    brain: '腦結',
    guide: '如何腦',
    news: '新腦事',
    team: '誰做腦',
    contact: '聯絡腦',
  },
  register: {
    register: '註冊',
    submit: '建立帳號',
    success: '註冊成功',
    socialText: '或使用社群帳號註冊',
  },
  login: {
    submit: '登入',
    success: '登入成功',
    newHere: '第一次來嗎？',
    oneOfUs: '已經是會員了？',
    welcomeMessage: '加入我們，開始你的旅程！',
    welcomeBack: '很高興又見到你！',
    socialText: '或使用社群帳號',
    socialLoginNotAvailable: '抱歉，{platform} 登入目前尚未開放',
  },
  logout: {
    success: '登出成功',
  },
  user: {
    username: '帳號',
    email: '信箱',
    password: '密碼',
    passwordConfirm: '確認密碼',
  },
  cart: {
    checkout: '結帳',
  },
  order: {
    createdAt: '訂單時間',
    cart: '商品',
    price: '訂單金額',
    account: '帳號',
  },
  admin: {
    index: '管那麼多幹嘛',
    bulletin: {
      title: '公告管理',
      newBulletin: '新增公告',
      editBulletin: '編輯公告',
      content: '內容',
      type: '類型',
      status: '狀態',
      publishDate: '發布日期',
      expiryDate: '到期日期',
      actions: '操作',
      delete: '刪除',
      confirmDelete: '確定要刪除此公告嗎？',
      types: {
        info: '一般公告',
        warning: '警告公告',
        event: '活動公告',
      },
      statuses: {
        draft: '草稿',
        published: '已發布',
        expired: '已過期',
      },
      save: '儲存',
      cancel: '取消',
      preview: '預覽',
    },
  },
  adminProduct: {
    new: '新增商品',
    edit: '編輯商品',
    cancel: '取消',
    submit: '確認',
    newSuccess: '新增成功',
    editSuccess: '編輯成功',
  },
  product: {
    image: '圖片',
    name: '名稱',
    description: '說明',
    price: '價格',
    category: '分類',
    sell: '上下架',
    createdAt: '新增時間',
    updatedAt: '更新時間',
    onSell: '上架',
    notOnSell: '下架',
    addCart: '加入購物車',
    addCartQuantityInvalid: '數量格式不符',
    addCartSuccess: '加入購物車成功',
  },
  // productCategory: {
  //   food: '食品',
  //   drink: '飲料',
  //   music: '音樂',
  //   phone: '手機',
  // },
  fileAgent: {
    helpText: '點擊或拖曳檔案至此',
    errorType: '檔案類型錯誤',
    errorSize: '檔案大小超過限制',
  },
  api: {
    userAccountRequired: '請輸入帳號',
    userAccountTooShort: '帳號至少需要 4 個字元',
    userAccountTooLong: '帳號不能超過 20 個字元',
    userAccountInvalid: '帳號格式不正確',
    userAccountDuplicate: '使用者帳號重複',
    userPasswordRequired: '請輸入密碼',
    userPasswordTooShort: '密碼至少需要 4 個字元',
    userPasswordTooLong: '密碼不能超過 20 個字元',
    invalidCredentials: '帳號或密碼錯誤',
    userEmailRequired: '使用者信箱必填',
    userEmailInvalid: '使用者信箱格式不符',
    userCartProductRequired: '購物車商品必填',
    userCartQuantityRequired: '購物車數量必填',
    userCartQuantityTooSmall: '購物車數量不符',
    userNotFound: '查無使用者',
    userPermissionDenied: '使用者權限不足',
    userTokenInvalid: '使用者驗證錯誤',
    userTokenExpired: '登入已過期',
    productIdInvalid: '商品 ID 錯誤',
    productNameRequired: '商品名稱必填',
    productPriceRequired: '商品價格必填',
    productPriceTooSmall: '商品價格不符',
    productImageRequired: '商品圖片必填',
    productDescriptionRequired: '商品說明必填',
    productCategoryRequired: '商品分類必填',
    productCategoryInvalid: '商品分類不符',
    productSellRequired: '商品上下架必填',
    requestFormatError: '請求格式錯誤',
    productNotOnSell: '商品未上架',
    productNotFound: '查無商品',
    orderCartProductRequired: '訂單商品必填',
    orderCartQuantityRequired: '訂單數量必填',
    orderCartQuantityTooSmall: '訂單數量不符',
    orderUserRequired: '訂單使用者必填',
    orderCartRequired: '訂單購物車必填',
    orderCartEmpty: '訂單購物車為空',
    serverError: '伺服器錯誤',
    unknownError: '發生未知錯誤',
    uploadFailed: '上傳失敗',
    navigation: '頁面載入失敗',
    networkError: '網路連線錯誤',
    sessionExpired: '登入階段已過期，請重新登入',
    userPasswordNotMatch: '密碼不一致',
  },
  note: {
    title: '標題...',
    delete: {
      confirm: '確定要刪除這個便條嗎？',
      cancel: '取消',
      delete: '刪除',
    },
    tooltip: {
      delete: '刪除便條',
      duplicate: '複製便條',
      color: '便條顏色',
      urgent: '設為緊急',
    },
    urgent: {
      set: '設為緊急',
      unset: '取消緊急',
    },
  },
  dashboard: {
    welcome: '歡迎回來',
    notes: '我的便條',
    joinDate: '加入日期',
    stats: '統計資訊',
    waveEditor: '波浪編輯器',
    waveColor1: '第一個顏色',
    waveColor2: '第二個顏色',
    waveOpacity: '透明度',
    settingsSaved: '設置已保存',
    randomColors: '隨機顏色',
  },
  preface: {
    title: '歡迎',
    question: '腦袋爆炸了嗎？',
    subtitle: '進來整理一下腦袋吧',
    entrance: '進入',
    return: '回去看鳥飛那一頁',
  },
  index: {
    nav: {
      brain: '腦結',
      guide: '如何腦',
      news: '新腦事',
      team: '誰做腦',
      contact: '聯絡腦',
    },
    sections: {
      brain: {
        question: '腦袋爆炸了嗎？',
        status: '腦有什麼狀況？',
        login: '登入以記錄腦',
      },
      guide: {
        title: '如何使用我們的腦工具',
        cards: {
          breathe: {
            title: '呼吸練習',
            description: '透過引導式呼吸平靜你的思緒',
          },
          notes: {
            title: '腦便條',
            description: '即時捕捉你的想法',
          },
          meditation: {
            title: '冥想',
            description: '透過引導式課程清空腦袋',
          },
          community: {
            title: '腦社群',
            description: '與他人分享和學習',
          },
        },
      },
      news: {
        title: '最新腦事',
        readMore: '閱讀更多',
      },
      team: {
        title: '腦袋背後的團隊',
        description: '認識我們的腦愛好者團隊',
      },
      contact: {
        title: '聯絡我們',
        name: '姓名',
        email: '電子郵件',
        message: '訊息',
        submit: '發送訊息',
        success: '訊息已成功發送！',
      },
    },
  },
}
