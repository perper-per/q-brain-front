<template>
  <div class="container" :class="{ 'sign-up-mode': isSignUpMode }">
    <div class="forms-container">
      <div class="signin-signup">
        <!-- Sign In Form -->
        <form @submit.prevent="handleSignIn" class="sign-in-form">
          <h2 class="title">{{ $t('login.submit') }}</h2>
          <div class="input-field">
            <i class="fas fa-user"></i>
            <input
              type="text"
              v-model="signInForm.username"
              :placeholder="$t('user.username')"
            />
          </div>
          <div class="input-field">
            <i class="fas fa-lock"></i>
            <input
              type="password"
              v-model="signInForm.password"
              :placeholder="$t('user.password')"
            />
          </div>
          <input
            type="submit"
            :value="$t('login.submit')"
            class="btn solid"
            :disabled="loading"
          />
          <p class="social-text">{{ $t('login.socialText') }}</p>
          <div class="social-media">
            <a v-for="(icon, platform) in socialIcons"
              :key="platform"
              href="#"
              class="social-icon"
              @click.prevent="handleSocialLogin(platform)"
            >
              <i :class="icon"></i>
            </a>
          </div>
        </form>

        <!-- Sign Up Form -->
        <form @submit.prevent="handleSignUp" class="sign-up-form">
          <h2 class="title">{{ $t('register.register') }}</h2>
          <div class="input-field">
            <i class="fas fa-user"></i>
            <input
              type="text"
              v-model="username.value.value"
              :placeholder="$t('user.username')"
              :class="{ 'error': username.errorMessage.value }"
            />
          </div>
          <div class="error-message" v-if="username.errorMessage.value">
            {{ username.errorMessage.value }}
          </div>

          <div class="input-field">
            <i class="fas fa-envelope"></i>
            <input
              type="email"
              v-model="email.value.value"
              :placeholder="$t('user.email')"
              :class="{ 'error': email.errorMessage.value }"
            />
          </div>
          <div class="error-message" v-if="email.errorMessage.value">
            {{ email.errorMessage.value }}
          </div>

          <div class="input-field">
            <i class="fas fa-lock"></i>
            <input
              type="password"
              v-model="password.value.value"
              :placeholder="$t('user.password')"
              :class="{ 'error': password.errorMessage.value }"
            />
          </div>
          <div class="error-message" v-if="password.errorMessage.value">
            {{ password.errorMessage.value }}
          </div>

          <div class="input-field">
            <i class="fas fa-lock"></i>
            <input
              type="password"
              v-model="passwordConfirm.value.value"
              :placeholder="$t('user.passwordConfirm')"
              :class="{ 'error': passwordConfirm.errorMessage.value }"
            />
          </div>
          <div class="error-message" v-if="passwordConfirm.errorMessage.value">
            {{ passwordConfirm.errorMessage.value }}
          </div>

          <input
            type="submit"
            class="btn"
            :value="$t('register.submit')"
            :disabled="isSubmitting"
          />
          <p class="social-text">{{ $t('register.socialText') }}</p>
          <div class="social-media">
            <a v-for="(icon, platform) in socialIcons"
              :key="platform"
              href="#"
              class="social-icon"
              @click.prevent="handleSocialLogin(platform)"
            >
              <i :class="icon"></i>
            </a>
          </div>
        </form>
      </div>
    </div>

    <div class="panels-container">
      <div class="panel left-panel">
        <div class="content">
          <h3>{{ $t('login.newHere') }}</h3>
          <p>{{ $t('login.welcomeMessage') }}</p>
          <button class="btn transparent" @click="isSignUpMode = true">
            {{ $t('nav.register') }}
          </button>
        </div>
      </div>

      <div class="panel right-panel">
        <div class="content">
          <h3>{{ $t('login.oneOfUs') }}</h3>
          <p>{{ $t('login.welcomeBack') }}</p>
          <button class="btn transparent" @click="isSignUpMode = false">
            {{ $t('nav.login') }}
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/userStore'
import { useI18n } from 'vue-i18n'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import validator from 'validator'
import { useAxios } from '../composables/axios'

const router = useRouter()
const user = useUserStore()
const $q = useQuasar()
const { t } = useI18n()
const { api } = useAxios()

// State
const isSignUpMode = ref(false)
const loading = ref(false)

const signInForm = reactive({
  username: '',
  password: ''
})

// 註冊表單驗證 Schema
const schema = yup.object({
  username: yup
    .string()
    .required(t('api.userAccountRequired'))
    .min(4, t('api.userAccountTooShort'))
    .max(20, t('api.userAccountTooLong'))
    .test('isAlphanumeric', t('api.userAccountInvalid'), (value) =>
      validator.isAlphanumeric(value),
    ),
  email: yup
    .string()
    .required(t('api.userEmailRequired'))
    .test('isEmail', t('api.userEmailInvalid'), (value) => validator.isEmail(value)),
  password: yup
    .string()
    .required(t('api.userPasswordRequired'))
    .min(4, t('api.userPasswordTooShort'))
    .max(20, t('api.userPasswordTooLong')),
  passwordConfirm: yup
    .string()
    .oneOf([yup.ref('password')], t('api.userPasswordNotMatch')),
})

// 使用 vee-validate
const { handleSubmit, isSubmitting } = useForm({
  validationSchema: schema,
})

const username = useField('username')
const email = useField('email')
const password = useField('password')
const passwordConfirm = useField('passwordConfirm')

// Social icons
const socialIcons = {
  Google: 'fab fa-google',
}

// Methods
const handleSignIn = async () => {
  try {
    // 基本驗證
    if (!signInForm.username || !signInForm.password) {
      $q.notify({
        type: 'negative',
        message: t('api.userPasswordRequired')
      })
      return
    }

    if (user.isLoggingIn) return
    user.isLoggingIn = true

    await user.login({
      username: signInForm.username.trim(),
      password: signInForm.password
    })

    $q.notify({
      type: 'positive',
      message: t('login.success')
    })

    // 重置表單
    signInForm.username = ''
    signInForm.password = ''

    // 導航到首頁
    router.push('/')
  } catch (err) {
    console.error('Login error:', err)
    $q.notify({
      type: 'negative',
      message: err.response?.data?.message
        ? t(`api.${err.response.data.message}`)
        : t('api.unknownError')
    })
  } finally {
    user.isLoggingIn = false
  }
}

// 使用 vee-validate 的 handleSubmit
const handleSignUp = handleSubmit(async (values) => {
  try {
    await api.post('/api/users', {
      username: values.username,
      email: values.email,
      password: values.password
    })

    $q.notify({
      type: 'positive',
      message: t('register.success'),
      position: 'top'
    })

    // 重置表單
    username.value.value = ''
    email.value.value = ''
    password.value.value = ''
    passwordConfirm.value.value = ''

    // 切換到登入模式
    isSignUpMode.value = false
  } catch (error) {
    console.log(error)
    $q.notify({
      type: 'negative',
      message: t(`api.${error?.response?.data?.message || 'unknownError'}`),
      position: 'top'
    })
  }
})

const handleSocialLogin = (platform) => {
  $q.notify({
    type: 'info',
    message: t('login.socialLoginNotAvailable', { platform }),
    position: 'top'
  })
}
</script>

<style lang="scss" scoped>

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.container {
  position: relative;
  width: 100%;
  background-color: var(--color-background);
  min-height: 100vh;
  overflow: hidden;
}

.forms-container {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.signin-signup {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  left: 75%;
  width: 50%;
  transition: 1s 0.7s ease-in-out;
  display: grid;
  grid-template-columns: 1fr;
  z-index: 5;
}

form {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0rem 5rem;
  transition: all 0.2s 0.7s;
  overflow: hidden;
  grid-column: 1 / 2;
  grid-row: 1 / 2;
}

form.sign-up-form {
  opacity: 0;
  z-index: 1;
}

form.sign-in-form {
  z-index: 2;
}

.title {
  font-size: 2.2rem;
  color: var(--login-text);
  margin-bottom: 10px;
}

.input-field {
  max-width: 380px;
  width: 100%;
  background-color: var(--login-input-bg);
  margin: 10px 0;
  height: 55px;
  border-radius: 55px;
  display: grid;
  grid-template-columns: 15% 85%;
  padding: 0 0.4rem;
  position: relative;
}

.input-field i {
  text-align: center;
  line-height: 55px;
  color: var(--login-text);
  transition: 0.5s;
  font-size: 1.1rem;
}

.input-field input {
  background: none;
  outline: none;
  border: none;
  line-height: 1;
  font-weight: 600;
  font-size: 1.1rem;
  color: var(--login-text);

  &::placeholder {
    color: var(--login-text);
    opacity: 0.7;
    font-weight: 500;
  }
}

.social-text {
  padding: 0.7rem 0;
  font-size: 1rem;
}

.social-media {
  display: flex;
  justify-content: center;
}

.social-icon {
  height: 46px;
  width: 46px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 0.45rem;
  color: var(--login-text);
  border-radius: 50%;
  border: 1px solid var(--login-text);
  text-decoration: none;
  font-size: 1.1rem;
  transition: 0.3s;
}

.social-icon:hover {
  color: var(--color-primary);
  border-color: var(--color-primary);
}

.btn {
  width: 150px;
  background-color: var(--color-primary);
  border: none;
  outline: none;
  height: 49px;
  border-radius: 49px;
  color: #fff;
  text-transform: uppercase;
  font-weight: 600;
  margin: 10px 0;
  cursor: pointer;
  transition: 0.5s;
}

.btn:hover {
  background-color: var(--color-primary-dark);
}

.panels-container {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}

.container:before {
  content: "";
  position: absolute;
  height: 2000px;
  width: 2000px;
  top: -10%;
  right: 48%;
  transform: translateY(-50%);
  background-image: linear-gradient(-45deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  transition: 1.8s ease-in-out;
  border-radius: 50%;
  z-index: 6;
}

.image {
  width: 100%;
  transition: transform 1.1s ease-in-out;
  transition-delay: 0.4s;
}

.panel {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  text-align: center;
  z-index: 6;
  padding-top: 5vh;
}

.left-panel {
  pointer-events: all;
  padding: 3rem 17% 2rem 12%;
}

.right-panel {
  pointer-events: none;
  padding: 3rem 12% 2rem 17%;
}

.panel .content {
  color: #fff;
  transition: transform 0.9s ease-in-out;
  transition-delay: 0.6s;
  margin-top: -5vh;
}

.panel h3 {
  font-weight: 600;
  line-height: 1;
  font-size: 1.5rem;
}

.panel p {
  font-size: 0.95rem;
  padding: 0.7rem 0;
}

.btn.transparent {
  margin: 0;
  background: none;
  border: 2px solid #fff;
  width: 130px;
  height: 41px;
  font-weight: 600;
  font-size: 0.8rem;
}

.right-panel .image,
.right-panel .content {
  transform: translateX(800px);
}

/* ANIMATION */
.container.sign-up-mode:before {
  transform: translate(100%, -50%);
  right: 52%;
}

.container.sign-up-mode .left-panel .image,
.container.sign-up-mode .left-panel .content {
  transform: translateX(-800px);
}

.container.sign-up-mode .signin-signup {
  left: 25%;
}

.container.sign-up-mode form.sign-up-form {
  opacity: 1;
  z-index: 2;
}

.container.sign-up-mode form.sign-in-form {
  opacity: 0;
  z-index: 1;
}

.container.sign-up-mode .right-panel .image,
.container.sign-up-mode .right-panel .content {
  transform: translateX(0%);
}

.container.sign-up-mode .left-panel {
  pointer-events: none;
}

.container.sign-up-mode .right-panel {
  pointer-events: all;
}

@media (max-width: 870px) {
  .container {
    min-height: 800px;
    height: 100vh;
  }
  .signin-signup {
    width: 100%;
    top: 95%;
    transform: translate(-50%, -100%);
    transition: 1s 0.8s ease-in-out;
  }

  .signin-signup,
  .container.sign-up-mode .signin-signup {
    left: 50%;
  }

  .panels-container {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 2fr 1fr;
  }

  .panel {
    padding-top: 3vh;
    justify-content: center;
  }

  .right-panel {
    grid-row: 3 / 4;
  }

  .left-panel {
    grid-row: 1 / 2;
  }

  .image {
    width: 200px;
    transition: transform 0.9s ease-in-out;
    transition-delay: 0.6s;
  }

  .panel .content {
    margin-top: 0;
    padding-right: 15%;
    transition: transform 0.9s ease-in-out;
    transition-delay: 0.8s;
  }

  .panel h3 {
    font-size: 1.2rem;
  }

  .panel p {
    font-size: 0.7rem;
    padding: 0.5rem 0;
  }

  .btn.transparent {
    width: 110px;
    height: 35px;
    font-size: 0.7rem;
  }

  .container:before {
    width: 1500px;
    height: 1500px;
    transform: translateX(-50%);
    left: 30%;
    bottom: 68%;
    right: initial;
    top: initial;
    transition: 2s ease-in-out;
  }

  .container.sign-up-mode:before {
    transform: translate(-50%, 100%);
    bottom: 32%;
    right: initial;
  }

  .container.sign-up-mode .left-panel .image,
  .container.sign-up-mode .left-panel .content {
    transform: translateY(-300px);
  }

  .container.sign-up-mode .right-panel .image,
  .container.sign-up-mode .right-panel .content {
    transform: translateY(0px);
  }

  .right-panel .image,
  .right-panel .content {
    transform: translateY(300px);
  }

  .container.sign-up-mode .signin-signup {
    top: 5%;
    transform: translate(-50%, 0);
  }
}

@media (max-width: 570px) {
  form {
    padding: 0 1.5rem;
  }

  .image {
    display: none;
  }
  .panel .content {
    padding: 0.5rem 1rem;
  }
  .container {
    padding: 1.5rem;
  }

  .container:before {
    bottom: 72%;
    left: 50%;
  }

  .container.sign-up-mode:before {
    bottom: 28%;
    left: 50%;
  }
}

// 添加錯誤樣式
.error {
  border-color: #ff5252;
}

.error-message {
  color: #ff5252;
  font-size: 0.8rem;
  margin-top: -8px;
  margin-bottom: 8px;
  text-align: left;
  padding-left: 15%;
}
</style>
