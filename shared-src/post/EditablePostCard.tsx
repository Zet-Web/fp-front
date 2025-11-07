// Enhanced editable post card component for inline post editing with validation

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Upload, Loader2 } from "lucide-react";
import { useState } from "react";
import type { PostAuthor } from "./post";
import { PostType, PostStatus } from "./post";
import { QuizFormData } from "@/apps/quiz/types/quiz";
import { FPApi } from "@/lib/api";
import { TiptapEditor } from "../feed/TipTapEditor";
import QuizForm from "@/apps/quiz/src/QuizForm";

interface EditablePostCardProps {
  title?: string;
  excerpt: string;
  content?: string;
  coverImage?: string;
  images: string[];
  type: PostType;
  status: PostStatus;
  isPinned: boolean;
  slug?: string;
  author: PostAuthor;
  onSave: (
    updates: {
      title?: string;
      excerpt: string;
      content?: string;
      cover_image?: string;
      images: string[];
      type: PostType;
      status: PostStatus;
      is_pinned: boolean;
      slug?: string;
    },
    quizData?: QuizFormData | null
  ) => void;
  onCancel: () => void;
}

export function EditablePostCard({
  title = "",
  excerpt,
  content = "",
  coverImage,
  images,
  type,
  status,
  isPinned,
  slug = "",
  author,
  onSave,
  onCancel,
}: EditablePostCardProps) {
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedExcerpt, setEditedExcerpt] = useState(excerpt);
  const [editedContent, setEditedContent] = useState(content);
  const [editedCoverImage, setEditedCoverImage] = useState(coverImage || "");
  const [editedImages, setEditedImages] = useState(images);
  const [editedType, setEditedType] = useState(type);
  const [editedStatus, setEditedStatus] = useState(status);
  const [editedIsPinned, setEditedIsPinned] = useState(isPinned);
  const [editedSlug, setEditedSlug] = useState(slug);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);

  // Quiz
  const [isQuizFormDisabled, setQuizFormDisabled] = useState(false);
  const [quizData, setQuizData] = useState<QuizFormData | null>(null);

  const handleSumbitQuizForm = (data: QuizFormData) => {
    if (!data) setQuizData(null);

    setQuizData(data);
    setQuizFormDisabled(true);
  };

  const handleEditQuizForm = () => {
    setQuizFormDisabled(false);
  };

  const displayName = author.name || author.username || "User";
  const displayUsername = author.username || author.telegram_username || "user";
  const avatarFallback = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const EXCERPT_MAX_LENGTH = 200;
  const excerptRemaining = EXCERPT_MAX_LENGTH - editedExcerpt.length;

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!editedExcerpt.trim()) {
      newErrors.excerpt = "Preview is required";
    } else if (editedExcerpt.length > EXCERPT_MAX_LENGTH) {
      newErrors.excerpt = `Preview must be ${EXCERPT_MAX_LENGTH} characters or less`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    onSave(
      {
        title: editedTitle.trim() || undefined,
        excerpt: editedExcerpt.trim(),
        content: editedContent.trim() || undefined,
        cover_image: editedCoverImage.trim() || undefined,
        images: editedImages,
        type: editedType,
        status: editedStatus,
        is_pinned: editedIsPinned,
        slug: editedSlug.trim() || undefined,
      },
      quizData
    );
  };

  const removeImage = (index: number) => {
    setEditedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedCoverImage(e.target.value);
  };

  const removeCoverImage = () => {
    setEditedCoverImage("");
  };

  const handleCoverUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingCover(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await FPApi.axios.post<{ publicUrl: string }>(
        "post/upload-cover",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (!res.data?.publicUrl) return;

      const uniqueVersion = new Date().getTime();
      const newUrl = `${res.data.publicUrl}?v=${uniqueVersion}`;

      setEditedCoverImage(newUrl);
      console.log("Cover uploaded (simulated):", file.name);
    } catch (error) {
      console.error("Cover upload failed:", error);
    } finally {
      setIsUploadingCover(false);
      event.target.value = "";
    }
  };

  return (
    <Card className="shadow-md border-2 border-primary/20">
      <CardContent className="p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <Avatar className="w-12 h-12">
              <AvatarImage
                src={author.avatar_url || undefined}
                alt={displayName}
              />
              <AvatarFallback>{avatarFallback}</AvatarFallback>
            </Avatar>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 mb-4">
              <h3 className="font-semibold text-sm">{displayName}</h3>
              {author.badge?.includes("verified") && (
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

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="edit-type"
                    className="text-sm font-medium mb-2 block"
                  >
                    Post Type
                  </Label>
                  <Select
                    value={editedType}
                    onValueChange={(value) => setEditedType(value as PostType)}
                  >
                    <SelectTrigger id="edit-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={PostType.ARTICLE}>Article</SelectItem>
                      <SelectItem value={PostType.EVENT}>Event</SelectItem>
                      <SelectItem value={PostType.POLL}>Poll</SelectItem>
                      <SelectItem value={PostType.VACANCY}>Vacancy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label
                    htmlFor="edit-status"
                    className="text-sm font-medium mb-2 block"
                  >
                    Status
                  </Label>
                  <Select
                    value={editedStatus}
                    onValueChange={(value) =>
                      setEditedStatus(value as PostStatus)
                    }
                  >
                    <SelectTrigger id="edit-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={PostStatus.DRAFT}>Draft</SelectItem>
                      <SelectItem value={PostStatus.PUBLISHED}>
                        Published
                      </SelectItem>
                      <SelectItem value={PostStatus.ARCHIVED}>
                        Archived
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit-pinned"
                  checked={editedIsPinned}
                  onCheckedChange={(checked) =>
                    setEditedIsPinned(checked as boolean)
                  }
                />
                <Label
                  htmlFor="edit-pinned"
                  className="text-sm font-medium cursor-pointer"
                >
                  Pin this post
                </Label>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label className="text-sm font-medium">Cover Image</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowUrlInput(!showUrlInput)}
                    className="text-xs h-auto py-1 px-2"
                  >
                    {showUrlInput ? "Upload File" : "Use URL"}
                  </Button>
                </div>
                <div className="space-y-2">
                  {showUrlInput ? (
                    <div className="flex gap-2">
                      <Input
                        id="edit-cover"
                        value={editedCoverImage}
                        onChange={handleCoverImageChange}
                        placeholder="https://example.com/image.jpg"
                        className="flex-1"
                      />
                      {editedCoverImage && (
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={removeCoverImage}
                          className="px-3"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverUpload}
                        className="hidden"
                        id="cover-upload"
                        disabled={isUploadingCover}
                      />
                      <label htmlFor="cover-upload" className="flex-1">
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full gap-2 cursor-pointer"
                          disabled={isUploadingCover}
                          asChild
                        >
                          <span>
                            {isUploadingCover ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Upload className="w-4 h-4" />
                            )}
                            {isUploadingCover
                              ? "Uploading..."
                              : "Upload Cover Image"}
                          </span>
                        </Button>
                      </label>
                      {editedCoverImage && (
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={removeCoverImage}
                          className="px-3"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  )}
                  {editedCoverImage && (
                    <img
                      src={editedCoverImage}
                      alt="Cover preview"
                      className="w-full rounded-lg object-cover max-h-48"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  )}
                </div>
              </div>

              <div>
                <Label
                  htmlFor="edit-title"
                  className="text-sm font-medium mb-2 block"
                >
                  Title
                </Label>
                <Input
                  id="edit-title"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  placeholder="Post title (optional)"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label htmlFor="edit-excerpt" className="text-sm font-medium">
                    Preview <span className="text-destructive">*</span>
                  </Label>
                  <span
                    className={`text-xs ${
                      excerptRemaining < 20
                        ? "text-destructive"
                        : "text-muted-foreground"
                    }`}
                  >
                    {excerptRemaining} / {EXCERPT_MAX_LENGTH}
                  </span>
                </div>
                <Textarea
                  id="edit-excerpt"
                  value={editedExcerpt}
                  onChange={(e) => setEditedExcerpt(e.target.value)}
                  placeholder="Short preview text (required, max 200 characters)"
                  rows={3}
                  className={`resize-none ${
                    errors.excerpt ? "border-destructive" : ""
                  }`}
                  maxLength={EXCERPT_MAX_LENGTH}
                />
                {errors.excerpt && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.excerpt}
                  </p>
                )}
              </div>

              <div>
                <Label
                  htmlFor="edit-content"
                  className="text-sm font-medium mb-2 block"
                >
                  Content
                </Label>
                <TiptapEditor
                  value={editedContent}
                  onChange={(e) => setEditedContent(e)}
                />
              </div>

              <div>
                <Label
                  htmlFor="edit-slug"
                  className="text-sm font-medium mb-2 block"
                >
                  Slug
                </Label>
                <Input
                  id="edit-slug"
                  value={editedSlug}
                  onChange={(e) => setEditedSlug(e.target.value)}
                  placeholder="url-friendly-slug (optional)"
                />
              </div>

              {editedImages.length > 0 && (
                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    Additional Images
                  </Label>
                  <div className="space-y-2">
                    {editedImages.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`Post image ${index + 1}`}
                          className="w-full rounded-lg object-cover max-h-64"
                        />
                        <Button
                          size="sm"
                          variant="destructive"
                          className="absolute top-2 right-2 h-8 w-8 p-0"
                          onClick={() => removeImage(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button
                  onClick={handleSave}
                  disabled={
                    !editedExcerpt.trim() ||
                    editedExcerpt.length > EXCERPT_MAX_LENGTH
                  }
                >
                  Save
                </Button>

                {editedType === PostType.POLL &&
                  !!quizData &&
                  isQuizFormDisabled && (
                    <Button variant="secondary" onClick={handleEditQuizForm}>
                      Edit quiz
                    </Button>
                  )}

                <Button variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              </div>
            </div>
            {editedType === PostType.POLL && (
              <QuizForm
                onSubmit={handleSumbitQuizForm}
                isQuizFormDisabled={isQuizFormDisabled}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
