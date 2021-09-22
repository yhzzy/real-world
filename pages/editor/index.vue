<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">

        <div class="col-md-10 offset-md-1 col-xs-12">
          <form>
            <fieldset>
              <fieldset class="form-group">
                <input v-model="ruleForm.title" type="text" class="form-control form-control-lg" :disabled="disabled" placeholder="Article Title" required>
              </fieldset>
              <fieldset class="form-group">
                <input v-model="ruleForm.description" type="text" class="form-control" :disabled="disabled" placeholder="What's this article about?">
              </fieldset>
              <fieldset class="form-group">
                <textarea v-model="ruleForm.body" class="form-control" rows="8" :disabled="disabled" placeholder="Write your article (in markdown)" required></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input v-model="newTag" type="text" class="form-control" :disabled="disabled" placeholder="Enter tags" @keyup.enter.prevent="handleAddTag">
                <div class="tag-list">
                  <span v-for="(tag, index) in ruleForm.tagList" :key="index" class="tag-default tag-pill">
                    <i class="ion-close-round" @click="handleRemove(index)"></i>
                    {{ tag }}
                  </span>
                </div>
              </fieldset>
              <button class="btn btn-lg pull-xs-right btn-primary" type="button" @click.prevent="handleSubmit" :disabled="disabled">
                Publish Article
              </button>
            </fieldset>
          </form>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { getArticle, createArticle, updateArticle } from '@/api/article'

export default {
  middleware: 'authenticated',
  name: 'Editor',
  async asyncData ({ params }) {
    const { slug } = params
    const fn = slug ? updateArticle : createArticle
    let ruleForm = {
      body: '',
      description: '',
      tagList: [],
      title: '',
    }
    if (slug) {
      const { data } = await getArticle(slug)
      const { body, description, tagList, title } = data.article
      ruleForm = {
        body,
        description,
        tagList,
        title,
      }
    }
    return {
      ruleForm,
      slug,
      fn,
    }
  },
  data () {
    return {
      disabled: false,
      errors: {},
      newTag: '',
    }
  },
  methods: {
    handleAddTag (e) {
      const { newTag } = this
      const { tagList } = this.ruleForm
      if (tagList.includes(newTag)) return
      this.ruleForm.tagList.push(newTag)
      e.srcElement.blur()
      this.newTag = ''
    },
    handleRemove (index) {
      this.ruleForm.tagList.splice(index, 1)
    },
    async handleSubmit () {
      try {
        let res
        const { ruleForm, slug, fn } = this
        this.disabled = true
        if (fn === updateArticle) {
          res = await fn({
            article: ruleForm,
          }, slug)
        } else {
          res = await fn({
            article: ruleForm,
          })
        }
        this.disabled = false
        this.$router.push({
          name: 'article',
          params: {
            slug: res.data.article.slug,
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