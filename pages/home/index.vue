<template>
  <div class="home-page">

    <div class="banner">
      <div class="container">
        <h1 class="logo-font">conduit</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>

    <div class="container page">
      <div class="row">

        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li v-if="user" class="nav-item">
                <nuxt-link
                  class="nav-link"
                  :class="{
                    active: tab === 'your_feed'
                  }"
                  exact
                  :to="{
                    name: 'home',
                    query: {
                      tab: 'your_feed'
                    }
                  }"
                >
                  Your Feed
                </nuxt-link>
              </li>
              <li class="nav-item">
                <nuxt-link
                  class="nav-link"
                  :class="{
                    active: tab === 'global_feed'
                  }"
                  exact
                  :to="{
                    name: 'home',
                    query: {
                      tab: 'global_feed'
                    }
                  }"
                >
                  Global Feed
                </nuxt-link>
              </li>
              <li v-if="tag" class="nav-item">
                <nuxt-link
                  class="nav-link"
                  :class="{
                    active: tab === 'tag'
                  }"
                  exact
                  :to="{
                    name: 'home',
                    query: {
                      tab: 'tag',
                      tag,
                    }
                  }"
                >
                  # {{ tag }}
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
              </nuxt-link>
            </div>
          </template>

          <div v-else class="article-preview">
            <h3>you don't add feed articles</h3>
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

        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>

            <div class="tag-list">
              <nuxt-link
                v-for="tag in tags"
                :key="tag"
                class="tag-pill tag-default"
                :to="{
                  name: 'home',
                  query: {
                    tag,
                    tab: 'tag',
                  }
                }"
              >
                {{ tag }}
              </nuxt-link>
            </div>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
import {
  getArticles,
  getYourFeedArticles,
} from '@/api/article'
import { handleOnFavorite } from '@/utils/commonRequest'
import { getTags } from '@/api/tag'
import { mapState } from 'vuex'

export default {
  name: 'Home',
  async asyncData({ query }) {
    const page = Number.parseInt(query.page || 1)
    const limit = 20
    const tab = query.tab || 'global_feed'
    const tag = query.tag
    const fn = tab === 'global_feed' || 'tag' ? getArticles : getYourFeedArticles
    const [ articlesRes, tagsRes ] = await Promise.all([
      fn({
        limit,
        offset: (page - 1) * limit,
        tag
      }),
      getTags()
    ])
    const { articles, articlesCount } = articlesRes.data
    const { tags } = tagsRes.data

    articles.forEach(article => article.favoriteDisabled = false)

    return {
      articles,
      articlesCount,
      tags,
      limit,
      page,
      tab,
      tag,
    }
  },
  watchQuery: ['page', 'tag', 'tab'],
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
  },
}
</script>

<style>

</style>