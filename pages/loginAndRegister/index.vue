<template>
  <div class="auth-page">
    <div class="container page">
      <div class="row">

        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">{{ formConfig[isLogin].title }}</h1>
          <p class="text-xs-center">
            <nuxt-link :to="formConfig[isLogin].to">{{ formConfig[isLogin].txt }}</nuxt-link>
          </p>

          <ul class="error-messages">
            <template v-for="(messages, name) in errors">
              <template v-if="typeof messages === 'object'">
                <li v-for="(message, index) in messages" :key="`${name}${index}`">
                  {{ name }} {{ message }}
                </li>
              </template>
              <template v-else>
                <li :key="name">
                  {{ name }} {{ messages }}
                </li>
              </template>
            </template>
          </ul>

          <form @submit.prevent="handleSubmit">
            <fieldset v-if="!isLogin" class="form-group">
              <input v-model="ruleForm.username" class="form-control form-control-lg" type="text" placeholder="Your Name" :disabled="disabled" required>
            </fieldset>
            <fieldset class="form-group">
              <input v-model="ruleForm.email" class="form-control form-control-lg" type="email" placeholder="Email" :disabled="disabled" required>
            </fieldset>
            <fieldset class="form-group">
              <input v-model="ruleForm.password" class="form-control form-control-lg" type="password" placeholder="Password" :disabled="disabled" required minlength="8">
            </fieldset>
            <button class="btn btn-lg btn-primary pull-xs-right" :disabled="disabled">
              {{ formConfig[isLogin].title }}
            </button>
          </form>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { login, register } from '@/api/user'

const Cookie = process.client ? require('js-cookie') : undefined

export default {
  middleware: 'notAuthenticated',
  name: 'LoginAndRegister',
  data () {
    return {
      disabled: false,
      errors: {},
      ruleForm: {
        username: '',
        email: '',
        password: '',
      },
      formConfig: {
        0: {
          title: 'Sign up',
          txt: 'Have an account?',
          to: '/login',
          submitFn: register,
        },
        1: {
          title: 'Sign in',
          txt: 'Need an account?',
          to: '/register',
          submitFn: login,
        },
      },
    }
  },
  computed: {
    isLogin () {
      return this.$route.name === 'login' ? 1 : 0
    },
  },
  created () {
    this.errors = {}
  },
  methods: {
    async handleSubmit () {
      try {
        const { formConfig, isLogin, ruleForm } = this
        const fn = formConfig[isLogin].submitFn
        this.disabled = true
        const { data } = await fn({
          user: ruleForm,
        })
        this.$store.commit('setUser', data.user)
        Cookie.set('user', JSON.stringify(data.user))
        this.disabled = false
        this.$router.push({
          name: 'home',
          query: {
            tab: 'your_feed',
          },
        })
      } catch (error) {
        this.errors = error.response.data.errors
        this.disabled = false
      }
    },
  },
}
</script>

<style>

</style>