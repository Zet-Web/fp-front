// Individual post page component displaying a single post by URL code or creating a new post

import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EditablePostCard } from "../../../shared-src/post/EditablePostCard";
import { PostType, PostStatus } from "../../../shared-src/post/post";
import type { PostWithAuthor } from "../../../shared-src/post/post";
import { useAuthContext } from "@/components/auth-provider";
import { FPApi } from "@/lib/api";
import { QuizFormData, QuizResponse } from "@/apps/quiz/types/quiz";
import { FullPostCard } from "../../../shared-src/feed/FullPostCard";
import { useToast } from "@/hooks/use-toast";
import { EventFormData, EventResponse } from "@/shared-src/event/event-types";

export function PostPage() {
  const { urlCode } = useParams<{ urlCode: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  const switchToEditMode = searchParams.get("editMode");

  const [post, setPost] = useState<PostWithAuthor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Quiz data
  const [quizData, setQuizData] = useState<QuizFormData | null>(null);

  // Event data
  const [eventData, setEventData] = useState<EventFormData | null>(null);

  const { profile, isAuthenticated, loading: authLoading } = useAuthContext();
  const currentUserId = profile?.id || "";

  const loadPost = async (postUrlCode?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!postUrlCode) {
        if (!isAuthenticated) {
          navigate("/auth");
          return;
        }

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
          status: PostStatus.PUBLISHED,
          is_pinned: false,
          members_enabled: false,
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
        `/post/get-by-url/${postUrlCode}`
      );
      const foundPost = res.data;

      if (
        !!profile &&
        profile.id === foundPost.post.author_id &&
        foundPost.post.type === PostType.QUIZ
      ) {
        const res = await FPApi.axios.get<QuizResponse>(
          `/quiz/by-post/${foundPost.post.id}`
        );

        const data = res.data;

        if (data) {
          const mappedQuizData: QuizFormData = {
            id: data.id,
            title: data.title,
            description: data.description,
            settings: {
              anonymous: data.anonymous,
              allowPause: data.allow_pause,
              oneAttemptPerUser: data.one_attempt_per_user,
              showCorrectAnswers: data.show_correct_answers,
              hasTimer: data.has_timer,
              timerMinutes: data.timer_minutes,
              visibility: data.visibility,
            },
            questions: data.questions,
          };

          setQuizData(mappedQuizData);
        }
      }

      if (
        !!profile &&
        profile.id === foundPost.post.author_id &&
        foundPost.post.type === PostType.EVENT
      ) {
        const res = await FPApi.axios.get<EventResponse>(
          `/event/by-post/${foundPost.post.id}`
        );

        const data = res.data;

        if (data) {
          const mappedEventData: EventFormData = {
            id: data.id,
            eventTypes: data.eventTypes,
            location: data.location,
            startDate: data.startDate,
            startTime: data.startTime,
            endDate: data.endDate,
            endTime: data.endTime,
            website: data.website,
            category: data.category,
            memberLimit: data.memberLimit,
            privacy: data.privacy,
            membersVisibility: data.membersVisibility,
          };

          setEventData(mappedEventData);

          console.log("EVENT DATA LOADED", mappedEventData);
        }
      }

      if (!foundPost) {
        setError("Post not found");
        setIsLoading(false);
        return;
      }

      setPost(foundPost.post);
      setIsCreateMode(false);
      setIsEditing(!!switchToEditMode);
      setIsLoading(false);
    } catch (error) {
      toast({
        title: "Post loading error",
        description: (error as Error)?.message || "",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    loadPost(urlCode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, urlCode, profile?.id]);

  const handleSave = async (
    updates: Partial<PostWithAuthor>,
    quizData?: QuizFormData | null,
    eventData?: EventFormData | null
  ) => {
    if (!post) return;

    try {
      setIsSaving(true);

      const updatedPost = {
        ...post,
        ...updates,
        updated_at: new Date().toISOString(),
      };

      let postId: number | null = null;
      let postUrl: string | null = null;

      if (isCreateMode) {
        const createPostRes = await FPApi.axios.post<{
          url: string;
          id: number;
        }>("/post/create", updatedPost);

        if (createPostRes.data.id && createPostRes.data.url) {
          postUrl = createPostRes.data.url;
          postId = createPostRes.data.id;
        }
      } else {
        postId = updatedPost.id;
        postUrl = updatedPost.url;

        if (!postId) {
          toast({
            title: "Post not found",
            description: "Post id not provided",
          });
          return;
        }

        await FPApi.axios.patch("/post/update", updatedPost);
      }

      if (quizData) {
        const quizReq = {
          id: quizData.id,
          postId: postId,
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

        if (quizData.id) {
          quizReq["id"] = quizData.id;
          await FPApi.axios.patch("/quiz/update", quizReq);
        } else {
          await FPApi.axios.post("/quiz/create", quizReq);
        }
      }

      if (eventData) {
        const eventReq = {
          id: eventData.id,
          postId: postId,
          eventTypes: eventData.eventTypes,
          country_id: eventData.location?.country?.id,
          city_id: eventData.location?.city?.id,
          address: eventData.location?.address,
          startDate: eventData.startDate,
          startTime: eventData.startTime,
          endDate: eventData.endDate,
          endTime: eventData.endTime,
          website: eventData.website,
          category: eventData.category,
          memberLimit: eventData.memberLimit,
        };

        if (eventData.id) {
          eventReq["id"] = eventData.id;
          await FPApi.axios.patch("/event/update", eventReq);
        } else {
          await FPApi.axios.post("/event/create", eventReq);
        }
      }

      if (postId) {
        if (isCreateMode) {
          navigate(`/post/${postUrl}`);

          toast({
            title: "Post created!",
          });
        } else {
          await loadPost(post.url);

          toast({
            title: "Post updated!",
          });
        }
      }

      setIsCreateMode(false);
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error while saving post",
        description: `${(error as Error)?.message || ""}`,
      });
    } finally {
      setIsSaving(false);
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

  const handleDelete = async () => {
    if (!post) return;

    try {
      await FPApi.axios.delete(`/post/delete/${post.id}`);
      toast({
        title: "Публикация удалена",
      });

      navigate("/");
    } catch (error) {
      toast({
        title: "Delete post error",
        description: (error as Error)?.message || "Delete error",
      });
    }
  };

  const isOwner = post?.author?.id === currentUserId;

  if (isLoading) {
    return (
      <div className="bg-background flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-sm mx-4">
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Загрузка...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="bg-background flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-sm mx-4">
          <CardContent className="p-6 text-center">
            <p className="text-destructive mb-4">{error || "Post not found"}</p>
            <Button onClick={() => navigate("/")}>На главную</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 md:px-6 py-4 md:py-6 max-w-4xl">
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
            membersEnabled={post.members_enabled}
            slug={post.slug}
            author={post.author}
            onSave={handleSave}
            onCancel={handleCancel}
            isLoading={isSaving}
            editableQuizData={quizData}
            editableEventData={eventData}
          />
        ) : (
          <>
            {post && (
              <FullPostCard
                post={post}
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
