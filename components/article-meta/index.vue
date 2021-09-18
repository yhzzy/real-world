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
        active: article.author.following
      }"
      @click="onFavorite(article.author)"
      :disabled="article.author.followingDisabled"
    >
      <i :class="[article.author.following ? 'ion-minus-round' : 'ion-plus-round']"></i>
      &nbsp;
      {{ article.author.following ? 'UnFollow' : 'Follow' }} {{ article.author.username }} <span class="counter">(10)</span>
    </button>
    &nbsp;&nbsp;
    <button
      class="btn btn-sm btn-outline-primary"
      :class="{
        active: article.favorited
      }"
      @click="onFavorite(article)"
      :disabled="article.favoriteDisabled"
    >
      <i class="ion-heart"></i>
      &nbsp;
      {{ article.favorited ? 'UnFavorite' : 'Favorite' }} Post <span class="counter">({{ article.favoritesCount }})</span>
    </button>
  </div>
</template>

<script>
import { handleOnFavorite, handleOnFollow } from '@/utils/commonRequest'

export default {
  name: 'ArticleMeta',
  props: {
    article: {
      type: Object,
      required: true,
    },
  },
  methods: {
    async onFavorite (article) {
      await handleOnFavorite(article)
    },
    async onFollow (author) {
      await handleOnFollow(author)
    },
  },
}
</script>

<style>

</style>