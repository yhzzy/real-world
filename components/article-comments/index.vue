<template>
  <div>
    <form class="card comment-form" @submit.prevent="handlePostComment(article.slug)">
      <div class="card-block">
        <textarea v-model="comment.body" class="form-control" placeholder="Write a comment..." rows="3"></textarea>
      </div>
      <div class="card-footer">
        <img :src="article.author.image" class="comment-author-img" />
        <button class="btn btn-sm btn-primary" :disabled="disabledPost">
          Post Comment
        </button>
      </div>
    </form>

    <div v-for="comment in comments" :key="comment.id" class="card">
      <div class="card-block">
        <p class="card-text">{{ comment.body }}</p>
      </div>
      <div class="card-footer">
        <nuxt-link 
          class="comment-author" 
          :to="{
            name: 'profile',
            params: {
              username: comment.author.username
            }
          }"
        >
          <img :src="comment.author.image" class="comment-author-img" />
        </nuxt-link>
        &nbsp;
        <nuxt-link 
          class="comment-author" 
          :to="{
            name: 'profile',
            params: {
              username: comment.author.username
            }
          }"
        >
          {{ comment.author.username }}
        </nuxt-link>
        <span class="date-posted">{{ comment.createdAt | date('MMM DD, YYYY') }}</span>
        <span v-if="isSelf" class="mod-options">
          <i class="ion-trash-a" @click="handleDeleteComment(article.slug, comment)"></i>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { getComments, deleteComments, addComments } from '@/api/article'
import { mapState } from 'vuex'

export default {
  name: 'ArticleComments',
  props: {
    article: {
      type: Object,
      required: true,
    },
  },
  data () {
    return {
      disabledPost: false,
      comments: [],
      comment: {
        body: '',
      },
    }
  },
  computed: {
    ...mapState(['user']),
    isSelf () {
      const { username } = this.article.author
      return username === this.user.username
    },
  },
  async mounted () {
    this.initComments()
  },
  methods: {
    async handleDeleteComment (slug, comment) {
      comment.commentDisabled = true
      await deleteComments(slug, comment.id)
      this.initComments()
    },
    async handlePostComment (slug) {
      const { comment } = this
      this.disabledPost = true
      await addComments({
        comment,
      }, slug)
      this.disabledPost = false
      this.comment.body = ''
      this.initComments()
    },
    async initComments () {
      const { data } = await getComments(this.article.slug)
      this.comments = data.comments
      this.comments.forEach(comment => comment.commentDisabled = false)
    },
  },
}
</script>

<style>

</style>