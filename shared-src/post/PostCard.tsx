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
import type { PostAuthor } from "./post";
import { PostContentViewer } from "../feed/PostContentViewer";
import { FPApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface PostCardProps {
  postId: number;
  title: string;
  content: string;
  images: string[];
  author: PostAuthor;
  showActions?: boolean;
  onMoreClick?: () => void;
  onShareClick?: () => void;
  onEditClick?: () => void;
  onDeleteClick?: () => void;
  isSaved?: boolean;
  isOwner?: boolean;
}

export function PostCard({
  postId,
  title,
  content,
  images,
  author,
  showActions = true,
  onMoreClick,
  onShareClick,
  onEditClick,
  onDeleteClick,
  isSaved = false,
  isOwner = false,
}: PostCardProps) {
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

  return (
    <Card className="hover:shadow-md transition-shadow duration-300">
      <CardContent className="p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <Avatar className="w-12 h-12">
              <AvatarImage
                src={author?.avatar_url || undefined}
                alt={displayName}
              />
              <AvatarFallback>{avatarFallback}</AvatarFallback>
            </Avatar>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-1">
                <h3 className="font-semibold text-sm">{displayName}</h3>
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
                <span className="text-sm text-muted-foreground">
                  @{displayUsername}
                </span>
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

            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-3">
              {title}
            </h3>

            <div className="leading-7">
              <PostContentViewer html={content} />
            </div>

            {images.length > 0 && (
              <div className="mb-4">
                <img
                  src={images[0]}
                  alt="Post content"
                  className="w-full rounded-lg object-cover max-h-64"
                />
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
                        isPostSaved ? "fill-blue-500 text-blue-500" : ""
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
            <AlertDialogTitle>Delete Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this post? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                onDeleteClick?.();
                setShowDeleteDialog(false);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
