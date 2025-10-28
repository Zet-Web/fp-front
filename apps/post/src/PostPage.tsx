// Individual post page component displaying a single post by URL code

import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PostCard } from "../../../shared-src/components/PostCard"
import { extractUrlCodeFromParam, isValidUrlCode } from "../../../shared-src/lib/post-utils"
import { MOCK_POSTS } from "../../../shared-src/lib/mock-posts"
import type { PostWithAuthor } from "../../../shared-src/types/post"

export function PostPage() {
  const { urlCode } = useParams<{ urlCode: string }>()
  const navigate = useNavigate()
  const [post, setPost] = useState<PostWithAuthor | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadPost = () => {
      setIsLoading(true)
      setError(null)

      if (!urlCode) {
        setError("Invalid post URL")
        setIsLoading(false)
        return
      }

      const extractedCode = extractUrlCodeFromParam(urlCode)

      if (!isValidUrlCode(extractedCode)) {
        setError("Invalid post URL format")
        setIsLoading(false)
        return
      }

      const foundPost = MOCK_POSTS.find(p => p.url === extractedCode)

      if (!foundPost) {
        setError("Post not found")
        setIsLoading(false)
        return
      }

      setPost(foundPost)
      setIsLoading(false)
    }

    loadPost()
  }, [urlCode])

  if (isLoading) {
    return (
      <div className="bg-background flex items-center justify-center min-h-[400px]">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading post...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="bg-background flex items-center justify-center min-h-[400px]">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <p className="text-destructive mb-4">{error || "Post not found"}</p>
            <Button onClick={() => navigate("/")}>Go to Home</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="bg-background">
      <div className="container mx-auto px-6 py-6 max-w-4xl">
        <PostCard
          title={post.title}
          content={post.content}
          images={post.images}
          author={post.author}
          showActions={true}
        />
      </div>
    </div>
  )
}
