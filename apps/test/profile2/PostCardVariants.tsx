// Post card component with multiple image size variants for testing different layouts

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Share, Bookmark } from "lucide-react";
import type { PostAuthor } from "../../../shared-src/post/post";
import { PostContentViewer } from "../../../shared-src/feed/PostContentViewer";
import { formatPostDate } from "@/lib/date-utils";

export type ImageVariant =
  | 'twitter-style'           // Variant D: Full width, natural ratio, max-h-512px
  | 'conservative-height'     // Variant A: Full width, max-h-400px
  | 'responsive-height'       // Variant C: Responsive heights
  | 'compact-square'          // Square format: 320x320
  | 'small-square'            // Smaller square: 240x240
  | 'thumbnail'               // Small thumbnail: 128x128
  | 'spaced-layout';          // Twitter style with extra spacing around

interface PostCardVariantsProps {
  postId: number;
  title: string;
  content: string;
  images: string[];
  author: PostAuthor;
  createdAt?: string;
  showActions?: boolean;
  imageVariant?: ImageVariant;
  variantLabel?: string;
}

export function PostCardVariants({
  postId,
  title,
  content,
  images,
  author,
  createdAt,
  showActions = true,
  imageVariant = 'twitter-style',
  variantLabel,
}: PostCardVariantsProps) {
  const displayName = author?.name || author?.username || "User";
  const displayUsername = author?.username || author?.telegram_username || "user";
  const avatarFallback = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const getImageClasses = () => {
    switch (imageVariant) {
      case 'twitter-style':
        return "w-full rounded-2xl object-cover max-h-[512px] border border-border";
      case 'conservative-height':
        return "w-full rounded-2xl object-cover max-h-[400px] border border-border";
      case 'responsive-height':
        return "w-full rounded-2xl object-cover max-h-[350px] md:max-h-[500px] border border-border";
      case 'compact-square':
        return "w-80 h-80 rounded-lg object-cover";
      case 'small-square':
        return "w-60 h-60 md:w-72 md:h-72 rounded-lg object-cover";
      case 'thumbnail':
        return "w-32 h-32 md:w-40 md:h-40 rounded-lg object-cover cursor-pointer hover:opacity-90 transition-opacity";
      case 'spaced-layout':
        return "w-full rounded-2xl object-cover max-h-[512px] border border-border";
      default:
        return "w-full rounded-2xl object-cover max-h-[512px] border border-border";
    }
  };

  const getImageWrapperClasses = () => {
    switch (imageVariant) {
      case 'twitter-style':
      case 'conservative-height':
      case 'responsive-height':
        return "mt-3 mb-3";
      case 'compact-square':
      case 'small-square':
        return "mb-4";
      case 'thumbnail':
        return "mb-4 flex justify-start";
      case 'spaced-layout':
        return "mt-4 mb-4 px-2";
      default:
        return "mt-3 mb-3";
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-300">
      <CardContent className={imageVariant === 'spaced-layout' ? "p-6" : "p-4"}>
        {variantLabel && (
          <div className="mb-3 px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-medium rounded-full inline-block">
            {variantLabel}
          </div>
        )}

        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <Avatar className="w-12 h-12 cursor-pointer hover:opacity-80 transition-opacity">
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
                <h3 className="font-semibold text-sm cursor-pointer hover:underline">
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
                <span className="text-sm text-muted-foreground cursor-pointer hover:underline">
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
              </div>
            </div>

            <h3 className={`scroll-m-20 font-semibold tracking-tight mb-1.5 ${
              imageVariant === 'spaced-layout' ? 'text-xl' : 'text-2xl'
            }`}>
              {title}
            </h3>

            <div className="leading-7">
              <PostContentViewer html={content} />
            </div>

            {images.length > 0 && (
              <div className={getImageWrapperClasses()}>
                <img
                  src={images[0]}
                  alt="Post content"
                  className={getImageClasses()}
                />
              </div>
            )}

            {showActions && (
              <div className="flex justify-end gap-1 mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground p-1 bg-transparent hover:bg-transparent"
                >
                  <Bookmark className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground p-1 bg-transparent hover:bg-transparent"
                >
                  <Share className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
