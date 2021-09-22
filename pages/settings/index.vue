<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">

        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>
          
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
            <fieldset>
                <fieldset class="form-group">
                  <input v-model="ruleForm.image" class="form-control" type="text" :disabled="disabled" placeholder="URL of profile picture">
                </fieldset>
                <fieldset class="form-group">
                  <input v-model="ruleForm.username" class="form-control form-control-lg" type="text" :disabled="disabled" placeholder="Your Name" required>
                </fieldset>
                <fieldset class="form-group">
                  <textarea v-model="ruleForm.bio" class="form-control form-control-lg" rows="8" :disabled="disabled" placeholder="Short bio about you"></textarea>
                </fieldset>
                <fieldset class="form-group">
                  <input v-model="ruleForm.email" class="form-control form-control-lg" type="email" :disabled="disabled" placeholder="Email" required>
                </fieldset>
                <fieldset class="form-group">
                  <input v-model="ruleForm.password" class="form-control form-control-lg" type="password" :disabled="disabled" placeholder="Password" required minlength="8">
                </fieldset>
                <button class="btn btn-lg btn-primary pull-xs-right" :disabled="disabled">
                  Update Settings
                </button>
            </fieldset>
          </form>

          <hr>
          <button class="btn btn-outline-danger" @click="handleLogout">
            Or click here to logout.
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { updateUser } from '@/api/user'
import { mapState } from 'vuex'

const Cookie = process.client ? require('js-cookie') : undefined

export default {
  middleware: 'authenticated',
  name: 'Setting',
  data () {
    return {
      disabled: false,
      errors: {},
      ruleForm: {
        username: '',
        email: '',
        password: '',
        image: '',
        bio: '',
      },
    }
  },
  computed: {
    ...mapState(['user']),
  },
  created () {
    const { username, bio, image, email } = this.user
    this.ruleForm = {
      ...this.ruleForm,
      username,
      bio,
      image,
      email,
    }
    this.errors = {}
  },
  methods: {
    async handleSubmit () {
      try {
        const { ruleForm } = this
        this.disabled = true
        const { data } = await updateUser({
          user: ruleForm,
        })
        this.$store.commit('setUser', data.user)
        Cookie.set('user', JSON.stringify(data.user))
        this.disabled = false
        this.$router.push({
          name: 'profile',
          params: {
            username: data.user.username,
          },
        })
      } catch (error) {
        this.errors = error.response.data.errors
        this.disabled = false
      }
    },
    handleLogout () {
      Cookie.remove('user')
      this.$router.push({
        name: 'home',
      })
    },
  },
}
</script>

<style>

</style>