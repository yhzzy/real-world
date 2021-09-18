import {
  addFavorite,
  deleteFavorite,
} from '@/api/article'
import {
  followUser,
  unFollowUser,
} from '@/api/profiles'

export const handleOnFavorite = async article => {
  article.favoriteDisabled = true
  if (article.favorited) {
    await deleteFavorite(article.slug)
    article.favorited = false
    article.favoritesCount += -1
  } else {
    await addFavorite(article.slug)
    article.favorited = true
    article.favoritesCount += 1
  }
  article.favoriteDisabled = false
}

export const handleOnFollow = async author => {
  author.followingDisabled = true
  if (author.following) {
    await unFollowUser(author.username)
    author.following = false
  } else {
    await followUser(author.username)
    article.following = true
  }
  author.followingDisabled = false
}
