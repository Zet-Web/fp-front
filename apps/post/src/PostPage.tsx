// Individual post page component displaying a single post by URL code or creating a new post

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EditablePostCard } from "../../../shared-src/post/EditablePostCard";
import { MOCK_POSTS } from "../../../shared-src/feed/mock-posts";
import { PostType, PostStatus } from "../../../shared-src/post/post";
import type { PostWithAuthor } from "../../../shared-src/post/post";
import { useAuthContext } from "@/components/auth-provider";
import { FPApi } from "@/lib/api";
import { QuizFormData } from "@/apps/quiz/types/quiz";
import { FullPostCard } from "@/shared-src/feed/FullPostCard";

export function PostPage() {
  const { urlCode } = useParams<{ urlCode: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<PostWithAuthor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(false);

  const { profile } = useAuthContext();

  const currentUserId = profile?.id || "";

  useEffect(() => {
    const loadPost = async () => {
      setIsLoading(true);
      setError(null);

      if (!urlCode) {
        setIsCreateMode(true);
        setIsEditing(true);
        setPost({
          id: 0,
          title: "",
          excerpt: "",
          content: "",
          cover_image: undefined,
          images: [],
          type: PostType.ARTICLE,
          status: PostStatus.DRAFT,
          is_pinned: false,
          url: "",
          slug: undefined,
          author: {
            id: profile?.id || "",
            name: profile?.name || "",
            username: profile?.username || "",
            telegram_username: profile?.telegram_username || null,
            avatar_url: profile?.avatar_url || null,
            badge: null,
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
        setIsLoading(false);
        return;
      }

      const res = await FPApi.axios.get<{ post: PostWithAuthor }>(
        `/post/get-by-url/${urlCode}`
      );
      const foundPost = res.data;

      if (!foundPost) {
        setError("Post not found");
        setIsLoading(false);
        return;
      }

      setPost(foundPost.post);
      setIsCreateMode(false);
      setIsEditing(false);
      setIsLoading(false);
    };

    loadPost();
  }, [profile, urlCode]);

  const handleSave = async (
    updates: Partial<PostWithAuthor>,
    quizData?: QuizFormData | null
  ) => {
    if (!post) return;

    const updatedPost = {
      ...post,
      ...updates,
      updated_at: new Date().toISOString(),
    };

    if (isCreateMode) {
      const createPostRes = await FPApi.axios.post<{ url: string; id: number }>(
        "/post/create",
        updatedPost
      );

      console.log("createPostRes", createPostRes);

      if (quizData) {
        const createQuizReq = {
          postId: createPostRes.data.id,
          title: quizData.title,
          description: quizData.description,
          anonymous: quizData.settings.anonymous,
          allowPause: quizData.settings.allowPause,
          oneAttemptPerUser: quizData.settings.oneAttemptPerUser,
          showCorrectAnswers: quizData.settings.showCorrectAnswers,
          hasTimer: quizData.settings.hasTimer,
          timerMinutes: quizData.settings.timerMinutes,
          visibility: quizData.settings.visibility,
          questions: quizData.questions,
        };

        const createQuiz = await FPApi.axios.post(
          "/quiz/create",
          createQuizReq
        );

        console.log("createQuiz", createQuiz);
      }

      navigate(`/post/${createPostRes.data.url}`);
    } else {
      const postIndex = MOCK_POSTS.findIndex((p) => p.id === post.id);
      if (postIndex !== -1) {
        MOCK_POSTS[postIndex] = updatedPost;
        console.log("Post updated:", updatedPost);
      }
      setPost(updatedPost);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    if (isCreateMode) {
      navigate("/");
    } else {
      setIsEditing(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDelete = () => {
    if (!post) return;
    const postIndex = MOCK_POSTS.findIndex((p) => p.id === post.id);
    if (postIndex !== -1) {
      MOCK_POSTS.splice(postIndex, 1);
      console.log("Post deleted");
    }
    navigate("/");
  };

  const isOwner = post?.author?.id === currentUserId;

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
    );
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
    );
  }

  return (
    <div className="bg-background">
      <div className="container mx-auto px-6 py-6 max-w-4xl">
        {isEditing ? (
          <EditablePostCard
            title={post.title}
            excerpt={post.excerpt}
            content={post.content}
            coverImage={post.cover_image}
            images={post.images}
            type={post.type}
            status={post.status}
            isPinned={post.is_pinned}
            slug={post.slug}
            author={post.author}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        ) : (
          <>
            {post && (
              <FullPostCard
                postId={post.id}
                title={post.title || ""}
                content={post.content || ""}
                excerpt={post.excerpt}
                images={
                  post.cover_image
                    ? [post.cover_image, ...post.images]
                    : post.images && Array.isArray(post.images)
                    ? post.images
                    : []
                }
                author={post.author}
                type={post.type}
                showActions={true}
                isOwner={isOwner}
                onEditClick={handleEdit}
                onDeleteClick={handleDelete}
                isSaved={post.is_saved}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
