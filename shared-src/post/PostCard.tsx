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
  Pin,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { PostAuthor, PostStatus } from "./post";
import { PostContentViewer } from "../feed/PostContentViewer";
import { FPApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { formatPostDate } from "@/lib/date-utils";
import { useAuthContext } from "@/components/auth-provider";
import { PostStatusBadge } from "./PostStatusBadge";
import { EventDisplayCard } from "../event/EventDisplayCard";
import { PostType } from "./post";
import { getStorageUrl } from "@/utils/getStorageUrl";
import { EventResponse } from "../event/event-types";

interface PostCardProps {
  postId: number;
  title: string;
  content: string;
  images: string[];
  author: PostAuthor;
  createdAt?: string;
  showActions?: boolean;
  onMoreClick?: () => void;
  onShareClick?: () => void;
  onEditClick?: () => void;
  onDeleteClick?: () => void;
  isSaved?: boolean;
  isOwner?: boolean;
  isPined?: boolean;
  status?: PostStatus;
  showStatusBadge?: boolean;
  postType?: PostType;
  eventData?: EventResponse | null;
}

export function PostCard({
  postId,
  title,
  content,
  images,
  author,
  createdAt,
  showActions = true,
  onMoreClick,
  onShareClick,
  onEditClick,
  onDeleteClick,
  isSaved = false,
  isOwner = false,
  isPined = false,
  status,
  showStatusBadge = false,
  postType,
  eventData,
}: PostCardProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthContext();

  const [isPostSaved, setIsPostSaved] = useState(isSaved);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const displayName = author?.name || author?.username || "User";
  const displayUsername = author?.username || "user";
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

  const showOwnerActions = showActions && isOwner;

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
                src={
                  author?.avatar_url
                    ? getStorageUrl(author.avatar_url)
                    : undefined
                }
                alt={displayName}
              />
              <AvatarFallback>{avatarFallback}</AvatarFallback>
            </Avatar>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-1 relative">
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
                {createdAt && (
                  <>
                    <span className="text-sm text-muted-foreground">·</span>
                    <span className="text-sm text-muted-foreground">
                      {formatPostDate(createdAt)}
                    </span>
                  </>
                )}
                {showStatusBadge && status && (
                  <PostStatusBadge status={status} />
                )}
              </div>
              {isPined && (
                <div
                  className={
                    showOwnerActions
                      ? "absolute top-2 right-8 z-10 bg-blue-500/10 backdrop-blur-sm p-2 rounded-lg border border-blue-500/20"
                      : "absolute top-2 right-2 z-10 bg-blue-500/10 backdrop-blur-sm p-2 rounded-lg border border-blue-500/20"
                  }
                >
                  <Pin className="h-4 w-4 text-blue-500" />
                </div>
              )}
              {showOwnerActions && (
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
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.preventDefault();
                          setShowDeleteDialog(true);
                        }}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>

            <h3 className="scroll-m-20 text-xl md:text-2xl font-semibold tracking-tight mb-1.5 break-words">
              {title}
            </h3>

            <div className="text-sm md:text-base leading-relaxed">
              <PostContentViewer html={content} />
            </div>

            {images.length > 0 && (
              <div className="mt-4 mb-3">
                <img
                  src={getStorageUrl(images[0])}
                  alt="Post content"
                  className="w-full rounded-2xl object-cover max-h-[512px] border border-border"
                />
              </div>
            )}

            {postType === "event" && eventData && (
              <div className="mt-4">
                <EventDisplayCard eventData={eventData} compact />
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
