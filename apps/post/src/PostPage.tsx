// Individual post page component displaying a single post by URL code

import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PostCard } from "@/components/shared/PostCard"
import { extractUrlCodeFromParam, isValidUrlCode } from "@/lib/post-utils"
import type { PostWithAuthor } from "@/types/post"

const TEST_POSTS: PostWithAuthor[] = [
  {
    id: "1",
    url: "Ab3X",
    slug: "new-e-commerce-platform-launch",
    title: "New E-Commerce Platform Launch",
    content: "Just finished building a new e-commerce platform with React and Node.js! The performance improvements are incredible - 40% faster load times and seamless user experience. Excited to share more details soon!",
    images: ["https://images.pexels.com/photos/3184295/pexels-photo-3184295.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&fit=crop"],
    author_id: "test-user-1",
    created_at: "2024-10-20T10:00:00Z",
    updated_at: "2024-10-20T10:00:00Z",
    author: {
      id: "test-user-1",
      name: "John Doe",
      username: "johndoe",
      avatar_url: null,
      badge: ["verified"],
      telegram_username: "johndoe"
    }
  },
  {
    id: "2",
    url: "Cd5Y",
    slug: "react-conference-2024-experience",
    title: "React Conference 2024 Experience",
    content: "Attending the React Conference 2024 was an amazing experience! Met so many talented developers and learned about the latest trends in web development. The future of React looks incredibly promising with the new concurrent features.",
    images: ["https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&fit=crop"],
    author_id: "test-user-1",
    created_at: "2024-10-21T14:30:00Z",
    updated_at: "2024-10-21T14:30:00Z",
    author: {
      id: "test-user-1",
      name: "John Doe",
      username: "johndoe",
      avatar_url: null,
      badge: ["verified"],
      telegram_username: "johndoe"
    }
  },
  {
    id: "3",
    url: "Ef7Z",
    slug: "open-source-typescript-project",
    title: "Open Source TypeScript Project",
    content: "Working on a new open-source project that helps developers optimize their TypeScript configurations. It's been a challenging but rewarding journey. Looking for contributors who are passionate about developer tooling!",
    images: [],
    author_id: "test-user-1",
    created_at: "2024-10-22T09:15:00Z",
    updated_at: "2024-10-22T09:15:00Z",
    author: {
      id: "test-user-1",
      name: "John Doe",
      username: "johndoe",
      avatar_url: null,
      badge: ["verified"],
      telegram_username: "johndoe"
    }
  },
  {
    id: "4",
    url: "Gh9W",
    slug: "aws-and-docker-deployment-success",
    title: "AWS and Docker Deployment Success",
    content: "Just deployed my latest project using AWS and Docker. The scalability and performance are exactly what I was hoping for. Here's a quick overview of the architecture and deployment process.",
    images: ["https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&fit=crop"],
    author_id: "test-user-1",
    created_at: "2024-10-23T16:45:00Z",
    updated_at: "2024-10-23T16:45:00Z",
    author: {
      id: "test-user-1",
      name: "John Doe",
      username: "johndoe",
      avatar_url: null,
      badge: ["verified"],
      telegram_username: "johndoe"
    }
  }
]

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

      const foundPost = TEST_POSTS.find(p => p.url === extractedCode)

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
