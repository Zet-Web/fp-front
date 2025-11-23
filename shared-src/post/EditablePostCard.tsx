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
import { useCallback, useState } from "react";
import type { PostAuthor } from "./post";
import { PostType, PostStatus } from "./post";
import { QuizFormData } from "@/apps/quiz/types/quiz";
import { FPApi } from "@/lib/api";
import { TiptapEditor } from "../feed/TipTapEditor";
import QuizForm from "../../apps/quiz/src/QuizForm";
import { EventResponse, EventFormData } from "../event/event-types";
import { EventFormCard } from "../event/EventFormCard";
import { getStorageUrl } from "@/utils/getStorageUrl";
import { CharacterCounter } from "@/components/shared/CharacterCounter";

interface EditablePostCardProps {
  title?: string;
  excerpt: string;
  content?: string;
  coverImage?: string;
  images: string[];
  type: PostType;
  status: PostStatus;
  isPinned: boolean;
  membersEnabled?: boolean;
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
      members_enabled?: boolean;
      slug?: string;
    },
    quizData?: QuizFormData | null,
    eventData?: EventFormData | null
  ) => void;
  onCancel: () => void;
  isLoading?: boolean;
  editableQuizData?: QuizFormData | null;
  editableEventData?: EventFormData | null;
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
  membersEnabled = false,
  slug = "",
  author,
  onSave,
  onCancel,
  isLoading,
  editableQuizData,
  editableEventData,
}: EditablePostCardProps) {
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedExcerpt, setEditedExcerpt] = useState(excerpt);
  const [editedContent, setEditedContent] = useState(content);
  const [editedCoverImage, setEditedCoverImage] = useState(coverImage || "");
  const [editedImages, setEditedImages] = useState(images);
  const [editedType, setEditedType] = useState(type);
  const [editedStatus, setEditedStatus] = useState(status);
  const [editedIsPinned, setEditedIsPinned] = useState(isPinned);
  const [editedMembersEnabled, setEditedMembersEnabled] = useState(membersEnabled);
  const [editedSlug, setEditedSlug] = useState(slug);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);

  // Quiz
  const [isQuizFormValid, setIsQuizFormValid] = useState(true);
  const [quizData, setQuizData] = useState<QuizFormData | null>(null);

  const handleUpdateQuizFormData = useCallback((data: QuizFormData) => {
    setQuizData(data);
  }, []);

  const handleQuizValidChange = useCallback((valid: boolean) => {
    setIsQuizFormValid(valid);
  }, []);

  // Event
  const [isEventFormValid, setIsEventFormValid] = useState(true);
  const [eventData, setEventData] = useState<EventResponse | null>(null);

  console.log("eventData", eventData);

  const handleUpdateEventData = useCallback((data: EventResponse) => {
    setEventData(data);
  }, []);

  const handleEventValidChange = useCallback((valid: boolean) => {
    setIsEventFormValid(valid);
  }, []);

  const displayName = author.name || author.username || "User";
  const displayUsername = author.username || author.telegram_username || "user";
  const avatarFallback = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const TITLE_MAX_LENGTH = 100;
  const EXCERPT_MAX_LENGTH = 400;
  const SLUG_MAX_LENGTH = 100;
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
        title: editedTitle?.trim() || undefined,
        excerpt: editedExcerpt?.trim(),
        content: editedContent?.trim() || undefined,
        cover_image: editedCoverImage?.trim() || undefined,
        images: editedImages,
        type: editedType,
        status: editedStatus,
        is_pinned: editedIsPinned,
        members_enabled: editedMembersEnabled,
        slug: editedSlug?.trim() || undefined,
      },
      editedType === PostType.QUIZ ? quizData : null,
      editedType === PostType.EVENT ? eventData : null
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

      const res = await FPApi.axios.post<{ filePath: string }>(
        "post/upload-cover",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (!res.data?.filePath) return;

      const uniqueVersion = new Date().getTime();
      const newUrl = `${res.data.filePath}?v=${uniqueVersion}`;

      setEditedCoverImage(newUrl);
    } catch (error) {
      console.error("Cover upload failed:", error);
    } finally {
      setIsUploadingCover(false);
      event.target.value = "";
    }
  };

  return (
    <Card className="shadow-md border-2 border-primary/20">
      <CardContent className="p-3 md:p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <Avatar className="w-12 h-12">
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
            <div className="flex items-center gap-1 mb-3 md:mb-4 flex-wrap">
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

            <div className="space-y-3 md:space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <Label
                    htmlFor="edit-type"
                    className="text-xs md:text-sm font-medium mb-1.5 md:mb-2 block"
                  >
                    Тип поста
                  </Label>
                  <Select
                    value={editedType}
                    onValueChange={(value) => setEditedType(value as PostType)}
                  >
                    <SelectTrigger id="edit-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={PostType.ARTICLE}>Статья</SelectItem>
                      <SelectItem value={PostType.EVENT}>
                        Мероприятие
                      </SelectItem>
                      <SelectItem value={PostType.QUIZ}>Конкурс</SelectItem>
                      {/* <SelectItem value={PostType.VACANCY}>Вакансия</SelectItem> */}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label
                    htmlFor="edit-status"
                    className="text-xs md:text-sm font-medium mb-1.5 md:mb-2 block"
                  >
                    Статус
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
                      <SelectItem value={PostStatus.PUBLISHED}>
                        Опубликовать
                      </SelectItem>
                      <SelectItem value={PostStatus.DRAFT}>Черновик</SelectItem>
                      <SelectItem value={PostStatus.ARCHIVED}>
                        Архивировать
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
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
                    className="text-xs md:text-sm font-medium cursor-pointer"
                  >
                    Закрепить пост
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="edit-members-enabled"
                    checked={editedMembersEnabled}
                    onCheckedChange={(checked) =>
                      setEditedMembersEnabled(checked as boolean)
                    }
                  />
                  <Label
                    htmlFor="edit-members-enabled"
                    className="text-xs md:text-sm font-medium cursor-pointer"
                  >
                    Включить раздел участников
                  </Label>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5 md:mb-2">
                  <Label className="text-xs md:text-sm font-medium">
                    Обложка
                  </Label>
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
                              ? "Загрузка..."
                              : "Загрузить изображение"}
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
                      src={getStorageUrl(editedCoverImage)}
                      alt="Cover preview"
                      className="w-full rounded-lg object-cover aspect-square"
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
                  className="text-xs md:text-sm font-medium mb-1.5 md:mb-2 block"
                >
                  Заголовок
                </Label>
                <div>
                  <Input
                    id="edit-title"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    placeholder="Post title (optional)"
                    maxLength={TITLE_MAX_LENGTH}
                  />
                  <div className="flex justify-end mt-1">
                    <CharacterCounter
                      current={editedTitle?.length || 0}
                      max={TITLE_MAX_LENGTH}
                    />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5 md:mb-2">
                  <Label
                    htmlFor="edit-excerpt"
                    className="text-xs md:text-sm font-medium"
                  >
                    Краткое содержание{" "}
                    <span className="text-destructive">*</span>
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
                  className={`resize-none leading-7 ${
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
                  className="text-xs md:text-sm font-medium mb-1.5 md:mb-2 block"
                >
                  Основной текст
                </Label>
                <TiptapEditor
                  value={editedContent}
                  onChange={(e) => setEditedContent(e)}
                  maxCharacters={5000}
                  showCharacterCount={true}
                />
              </div>

              <div>
                <Label
                  htmlFor="edit-slug"
                  className="text-xs md:text-sm font-medium mb-1.5 md:mb-2 block"
                >
                  Ссылка
                </Label>
                <div>
                  <Input
                    id="edit-slug"
                    value={editedSlug}
                    onChange={(e) => setEditedSlug(e.target.value)}
                    placeholder="url-friendly-slug (optional)"
                    maxLength={SLUG_MAX_LENGTH}
                  />
                  <div className="flex justify-end mt-1">
                    <CharacterCounter
                      current={editedSlug?.length || 0}
                      max={SLUG_MAX_LENGTH}
                    />
                  </div>
                </div>
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
            </div>
            {editedType === PostType.QUIZ && (
              <div className="mt-6">
                <QuizForm
                  onFormValuesChange={handleUpdateQuizFormData}
                  onFormValidChange={handleQuizValidChange}
                  defaultQuizFormValues={editableQuizData}
                />
              </div>
            )}
            {editedType === PostType.EVENT && (
              <div className="mt-6">
                <EventFormCard
                  defaultEventFormValues={editableEventData}
                  onFormValuesChange={handleUpdateEventData}
                  onFormValidChange={handleEventValidChange}
                />
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2 pt-4 md:pt-6 border-t mt-4 md:mt-6">
              <Button
                onClick={handleSave}
                disabled={
                  !editedExcerpt.trim() ||
                  editedExcerpt.length > EXCERPT_MAX_LENGTH ||
                  (editedType === PostType.QUIZ && !isQuizFormValid) ||
                  (editedType === PostType.EVENT && !isEventFormValid) ||
                  isLoading
                }
              >
                {isLoading ? "Сохраняется..." : "Сохранить"}
              </Button>

              <Button variant="outline" onClick={onCancel} disabled={isLoading}>
                Отмена
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
