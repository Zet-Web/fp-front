// Reusable post card component displaying a single post with author information

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Share,
  MoreHorizontal,
  Bookmark,
  Pencil,
  Trash2,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PostType, PostWithAuthor } from "../post/post";
import { PostContentViewer } from "./PostContentViewer";
import QuizTake from "../../apps/quiz/src/QuizTake";
import { EventDisplayCard } from "../event/EventDisplayCard";
import { useToast } from "@/hooks/use-toast";
import { FPApi } from "@/lib/api";
import { formatPostDate } from "@/lib/date-utils";
import { useAuthContext } from "@/components/auth-provider";

interface PostCardProps {
  post: PostWithAuthor;
  showActions?: boolean;
  onMoreClick?: () => void;
  onShareClick?: () => void;
  onEditClick?: () => void;
  onDeleteClick?: () => void;
  isSaved?: boolean;
  isOwner?: boolean;
}

export function FullPostCard({
  post,
  showActions = true,
  onMoreClick,
  onShareClick,
  onEditClick,
  onDeleteClick,
  isSaved = false,
  isOwner = false,
}: PostCardProps) {
  const {
    id: postId,
    title,
    excerpt,
    content,
    author,
    type,
    created_at,
  } = post;
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthContext();

  const images = post.cover_image
    ? [post.cover_image, ...post.images]
    : post.images && Array.isArray(post.images)
    ? post.images
    : [];

  const { toast } = useToast();

  const [isPostSaved, setIsPostSaved] = useState(isSaved);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const displayName = author?.name || author?.username || "User";
  const displayUsername =
    author?.username || author?.telegram_username || "user";
  const avatarFallback = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const onBookmarkClick = async () => {
    if (!postId) return;

    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }

    setIsSaving(true);
    try {
      const res = await FPApi.axios.patch<{ isSaved: boolean }>(
        `/post/toggle-save/${postId}`
      );

      const data = res.data;
      setIsPostSaved(data.isSaved);
    } catch (error) {
      toast({
        title: "Error saving post",
        description: (error as Error)?.message || "Error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleProfileClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/${displayUsername}`);
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-300">
      <CardContent className="p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <Avatar
              className="w-12 h-12 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={handleProfileClick}
            >
              <AvatarImage
                src={author?.avatar_url || undefined}
                alt={displayName}
              />
              <AvatarFallback>{avatarFallback}</AvatarFallback>
            </Avatar>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-1">
              <div className="flex items-center gap-1 flex-wrap">
                <h3
                  className="font-semibold text-sm cursor-pointer hover:underline"
                  onClick={handleProfileClick}
                >
                  {displayName}
                </h3>
                {author?.badge?.includes("verified") && (
                  <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-2.5 h-2.5 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
                <span
                  className="text-sm text-muted-foreground cursor-pointer hover:underline"
                  onClick={handleProfileClick}
                >
                  @{displayUsername}
                </span>
                {created_at && (
                  <>
                    <span className="text-sm text-muted-foreground">·</span>
                    <span className="text-sm text-muted-foreground">
                      {formatPostDate(created_at)}
                    </span>
                  </>
                )}
              </div>
              {showActions && isOwner && (
                <div className="flex items-center gap-1 flex-shrink-0">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-foreground p-1 bg-transparent hover:bg-transparent"
                        onClick={(e) => {
                          e.preventDefault();
                          onMoreClick?.();
                        }}
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.preventDefault();
                          onEditClick?.();
                        }}
                      >
                        <Pencil className="w-4 h-4 mr-2" />
                        Изменить
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.preventDefault();
                          setShowDeleteDialog(true);
                        }}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Удалить
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>

            <h1 className="scroll-m-20 text-2xl font-extrabold tracking-tight">
              {title}
            </h1>

            <p className="leading-7 [&:not(:first-child)]:mt-2">{excerpt}</p>

            {images.length > 0 && (
              <div className="my-4">
                <img
                  src={images[0]}
                  alt="Post content"
                  className="w-full rounded-lg object-contain h-auto"
                />
              </div>
            )}

            <PostContentViewer html={content || ""} />

            {type === PostType.EVENT && post.event_data && (
              <div className="mt-6">
                <EventDisplayCard eventData={post.event_data} />
              </div>
            )}

            {type === PostType.QUIZ && (
              <div className="mt-6">
                <QuizTake postId={postId} />
              </div>
            )}

            {showActions && (
              <div className="flex justify-end gap-1 mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground p-1 bg-transparent hover:bg-transparent"
                  onClick={(e) => {
                    e.preventDefault();
                    onBookmarkClick?.();
                  }}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Bookmark
                      className={`w-4 h-4 transition-colors ${
                        isPostSaved ? "fill-red-500 text-red-500" : ""
                      }`}
                    />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground p-1 bg-transparent hover:bg-transparent"
                  onClick={(e) => {
                    e.preventDefault();
                    onShareClick?.();
                  }}
                >
                  <Share className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                onDeleteClick?.();
                setShowDeleteDialog(false);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
