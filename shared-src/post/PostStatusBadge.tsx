// Inline status badge component for displaying post status (draft/archived) with icons

import { FileText, Archive } from "lucide-react";
import { PostStatus } from "./post";

interface PostStatusBadgeProps {
  status: PostStatus;
}

export function PostStatusBadge({ status }: PostStatusBadgeProps) {
  if (status === PostStatus.PUBLISHED) {
    return null;
  }

  const getStatusConfig = () => {
    if (status === PostStatus.DRAFT) {
      return {
        label: "Черновик",
        bgColor: "bg-amber-500/10",
        textColor: "text-amber-700 dark:text-amber-400",
        borderColor: "border-amber-500/20",
        icon: FileText,
      };
    }
    if (status === PostStatus.ARCHIVED) {
      return {
        label: "Архивировано",
        bgColor: "bg-gray-500/10",
        textColor: "text-gray-700 dark:text-gray-400",
        borderColor: "border-gray-500/20",
        icon: Archive,
      };
    }
    return null;
  };

  const statusConfig = getStatusConfig();

  if (!statusConfig) {
    return null;
  }

  const StatusIcon = statusConfig.icon;

  return (
    <div
      className={`inline-flex items-center gap-1 ${statusConfig.bgColor} px-2 py-0.5 rounded border ${statusConfig.borderColor}`}
    >
      <StatusIcon className={`h-3 w-3 ${statusConfig.textColor}`} />
      <span className={`text-xs font-medium ${statusConfig.textColor}`}>
        {statusConfig.label}
      </span>
    </div>
  );
}
