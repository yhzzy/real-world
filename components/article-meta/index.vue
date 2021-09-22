<template>
  <div class="article-meta">
    <nuxt-link
      :to="{
        name: 'profile',
        params: {
          username: article.author.username
        }
      }"
    >
      <img :src="article.author.image" />
    </nuxt-link>
    <div class="info">
      <nuxt-link
        class="author" 
        :to="{
          name: 'profile',
          params: {
            username: article.author.username
          }
        }"
      >
        {{ article.author.username }}
      </nuxt-link>
      <span class="date">{{ article.createdAt | date('MMM DD, YYYY') }}</span>
    </div>
    <button
      class="btn btn-sm btn-outline-secondary"
      :class="{
        active: article.author.following && !isSelf
      }"
      @click="isSelf ? handleToEditor(article.slug) : onFollow(article.author)"
      :disabled="article.author.followingDisabled && !isSelf"
    >
      <i :class="[ isSelf ? 'ion-edit' : 'ion-plus-round' ]"></i>
      &nbsp;
      <template v-if="!isSelf">
        {{ article.author.following ? 'UnFollow' : 'Follow' }} {{ article.author.username }} <span class="counter"></span>
      </template>
      <template v-else>
        Edit Article
      </template>
    </button>
    &nbsp;&nbsp;
    <button
      class="btn btn-sm btn-outline-primary"
      :class="[
        { active: article.favorited && !isSelf },
        isSelf ? 'btn-outline-danger' : 'btn-outline-primary',
      ]"
      @click="isSelf ? handleDeleteArticle(article.slug) : onFavorite(article)"
      :disabled="(article.favoriteDisabled && !isSelf) || (isSelf && disabled)"
    >
      <i :class="[ isSelf ? 'ion-trash-a' : 'ion-heart' ]"></i>
      &nbsp;
      <template v-if="!isSelf">
        {{ article.favorited ? 'UnFavorite' : 'Favorite' }} Post <span class="counter">({{ article.favoritesCount }})</span>
      </template>
      <template v-else>
        Delete Article
      </template>
    </button>
  </div>
</template>

<script>
import { deleteArticle } from '@/api/article'
import { handleOnFavorite, handleOnFollow } from '@/utils/commonRequest'
import { mapState } from 'vuex'

export default {
  name: 'ArticleMeta',
  props: {
    article: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      disabled: false,
    }
  },
  computed: {
    ...mapState(['user']),
    isSelf () {
      const { username } = this.article.author
      return username === this.user.username
    },
  },
  methods: {
    async onFavorite (article) {
      await handleOnFavorite(article)
    },
    async onFollow (author) {
      await handleOnFollow(author)
    },
    handleToEditor (slug) {
      this.$router.push({
        name: 'editor',
        params: {
          slug,
        },
      })
    },
    async handleDeleteArticle (slug) {
      try {
        this.disabled = true
        await deleteArticle(slug)
        this.disabled = false
        this.$router.push({
          name: 'home',
        })
      } catch (error) {
        this.disabled = false
        throw new Error(error)
      }
    },
  },
}
</script>

<style>

</style>