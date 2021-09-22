<template>
  <ul class="tag-list">
    <li v-for="tag in article.tagList" :key="tag" class="tag-default tag-pill tag-outline">
      {{ tag }}
    </li>
  </ul>
</template>

<script>
export default {
  name: 'TagList',
  props: {
    article: {
      type: Object,
      required: true,
    },
  },
}
</script>

<style>

</style>