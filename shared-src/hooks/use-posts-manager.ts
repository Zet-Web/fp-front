// Hook for managing posts state with create, edit, and delete operations

import { useState, useCallback } from "react"
import { MOCK_POSTS } from "../lib/mock-posts"
import type { PostWithAuthor } from "../types/post"

export function usePostsManager() {
  const [posts, setPosts] = useState<PostWithAuthor[]>(MOCK_POSTS)

  const addPost = useCallback((post: PostWithAuthor) => {
    setPosts(prev => [post, ...prev])
  }, [])

  const updatePost = useCallback((postId: string, updatedPost: Partial<PostWithAuthor>) => {
    setPosts(prev => prev.map(post =>
      post.id === postId
        ? { ...post, ...updatedPost, updated_at: new Date().toISOString() }
        : post
    ))
  }, [])

  const deletePost = useCallback((postId: string) => {
    setPosts(prev => prev.filter(post => post.id !== postId))
  }, [])

  const getPostById = useCallback((postId: string) => {
    return posts.find(post => post.id === postId)
  }, [posts])

  const getPostByUrl = useCallback((urlCode: string) => {
    return posts.find(post => post.url === urlCode)
  }, [posts])

  return {
    posts,
    addPost,
    updatePost,
    deletePost,
    getPostById,
    getPostByUrl
  }
}
