<template>
  <div class="profile-page">

    <div class="user-info">
      <div class="container">
        <div class="row">

          <div class="col-xs-12 col-md-10 offset-md-1">
            <img :src="profile.image" class="user-img" />
            <h4>{{ profile.username }}</h4>
            <p>
              {{ profile.bio }}
            </p>
            <button
              v-if="profile.username !== user.username"
              class="btn btn-sm btn-outline-secondary action-btn"
              :class="{
                active: profile.following
              }"
              @click="onFollow(profile)"
              :disabled="profile.followingDisabled"
            >
              <i class="ion-plus-round"></i>
              &nbsp;
              {{ profile.following ? 'UnFollow' : 'Follow' }} {{ profile.username }} 
            </button>
            <button
              v-else
              class="btn btn-sm btn-outline-secondary action-btn"
              @click="handleSetting"
            >
              <i class="ion-gear-a"></i>
              &nbsp;
              Edit Profile Settings 
            </button>
          </div>

        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">

        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <nuxt-link
                  class="nav-link"
                  :class="{
                    active: tab === 'my_articles'
                  }"
                  exact
                  :to="{
                    name: 'profile',
                    query: {
                      tab: 'my_articles'
                    }
                  }"
                >
                  My Articles
                </nuxt-link>
              </li>
              <li class="nav-item">
                <nuxt-link
                  class="nav-link"
                  :class="{
                    active: tab === 'favorited_articles'
                  }"
                  exact
                  :to="{
                    name: 'profile',
                    query: {
                      tab: 'favorited_articles'
                    }
                  }"
                >
                  Favorited Articles
                </nuxt-link>
              </li>
            </ul>
          </div>

          <template v-if="articles && articles.length > 0">
            <div v-for="article in articles" :key="article.slug" class="article-preview">
              <div class="article-meta">
                <nuxt-link
                  :to="{
                    name: 'profile',
                    params: {
                      username: article.author.username,
                    },
                  }"
                >
                  <img :src="article.author.image" />
                </nuxt-link>
                <div class="info">
                  <nuxt-link
                    :to="{
                      name: 'profile',
                      params: {
                        username: article.author.username,
                      },
                    }"
                  >
                    {{ article.author.username }}
                  </nuxt-link>
                  <span class="date">{{ article.createdAt | date('MMM DD, YYYY') }}</span>
                </div>
                <button
                  class="btn btn-outline-primary btn-sm pull-xs-right"
                  :class="{ active: article.favorited }"
                  @click="onFavorite(article)"
                  :disabled="article.favoriteDisabled"
                >
                  <i class="ion-heart"></i> {{ article.favoritesCount }}
                </button>
              </div>
              <nuxt-link
                class="preview-link"
                :to="{
                  name: 'article',
                  params: {
                    slug: article.slug
                  }
                }"
              >
                <h1>{{ article.title }}</h1>
                <p>{{ article.description }}</p>
                <span>Read more...</span>
                <tag-list :article="article" />
              </nuxt-link>
            </div>
          </template>

          <div v-else class="article-preview">
            <h3>No articles are here... yet.</h3>
          </div>

          <nav>
            <ul class="pagination">
              <li
                v-for="item in totalPage"
                :key="item"
                class="page-item"
                :class="{
                  active: item === page
                }"
              >
                <nuxt-link
                  class="page-link"
                  :to="{
                    name: 'home',
                    query: {
                      page: item,
                      tag: $route.query.tag,
                      tab,
                    }
                  }"
                >
                  {{ item }}
                </nuxt-link>
              </li>
            </ul>
          </nav>

        </div>

      </div>
    </div>

  </div>
</template>

<script>
import { getArticles } from '@/api/article'
import { getProfile } from '@/api/profiles'
import { mapState } from 'vuex'
import { handleOnFollow, handleOnFavorite } from '@/utils/commonRequest'
import TagList from '@/components/tag-list'

export default {
  middleware: 'authenticated',
  name: 'Profile',
  components: {
    TagList,
  },
  async asyncData ({ query, params }) {
    const page = Number.parseInt(query.page || 1)
    const limit = 20
    const tab = query.tab || 'my_articles'
    let fn
    const queryParams = {
      limit,
      offset: (page - 1) * limit,
    }
    if (tab === 'my_articles') {
      queryParams.author = params.username
    } else {
      queryParams.favorited = params.username
    }
    const [ profileRes, articlesRes ] = await Promise.all([
      getProfile(params.username),
      getArticles(queryParams),
    ])
    const { articles, articlesCount } = articlesRes.data
    const { profile } = profileRes.data
    return {
      articles,
      articlesCount,
      limit,
      page,
      tab,
      profile,
    }
  },
  watchQuery: ['page', 'tab'],
  computed: {
    ...mapState(['user']),
    totalPage () {
      return Math.ceil(this.articlesCount / this.limit)
    },
  },
  methods: {
    async onFavorite (article) {
      await handleOnFavorite(article)
    },
    async onFollow (author) {
      await handleOnFollow(author)
    },
    handleSetting () {
      this.$router.push({
        name: 'settings',
      })
    },
  },
}
</script>

<style>

</style>