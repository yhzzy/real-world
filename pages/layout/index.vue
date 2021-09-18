<template>
  <div>
    <!-- header -->
    <nav class="navbar navbar-light">
      <div class="container">
        <a class="navbar-brand" href="index.html">conduit</a>
        <ul class="nav navbar-nav pull-xs-right">
          <li class="nav-item">
            <nuxt-link class="nav-link" to="/" exact>Home</nuxt-link>
          </li> 
          <template v-if="user">
            <li v-for="(item, index) in authNavs" :key="index" class="nav-item">
              <nuxt-link v-if="!item.isUser" class="nav-link" :to="item.to">
                <i :class="item.icon"></i>&nbsp;{{ item.name }}
              </nuxt-link>
              <nuxt-link v-else class="nav-link" :to="`${item.to}${user.username}`">
                <img class="user-pic" :src="user.image">
                {{ user.username }}
              </nuxt-link>
            </li>
          </template>
          <template v-else>
            <li v-for="(item, index) in noAuthNavs" :key="index" class="nav-item">
              <nuxt-link class="nav-link" :to="item.to">
                {{ item.name }}
              </nuxt-link>
            </li>
          </template>
        </ul>
      </div>
    </nav>

    <!-- view -->
    <nuxt-child :key="$route.name" />

    <!-- footer -->
    <footer>
      <div class="container">
        <a href="/" class="logo-font">conduit</a>
        <span class="attribution">
          An interactive learning project from <a href="https://thinkster.io">Thinkster</a>. Code &amp; design licensed under MIT.
        </span>
      </div>
    </footer>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Layout',
  data() {
    return {
      authNavs: [
        { name: 'New Article', to: '/editor', icon: 'ion-compose' },
        { name: 'Settings', to: '/settings', icon: 'ion-gear-a' },
        { to: '/profile/', isUser: true },
      ],
      noAuthNavs: [
        { name: 'Sign in', to: '/login' },
        { name: 'Sign up', to: '/register' },
      ],
    }
  },
  computed: {
    ...mapState(['user'])
  },
}
</script>

<style>

</style>