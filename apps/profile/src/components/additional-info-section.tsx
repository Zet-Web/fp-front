import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { FileText } from "lucide-react";
import { UserProfile } from "../types/profile";
import { CharacterCounter } from "@/components/shared/CharacterCounter";

interface AdditionalInfoSectionProps {
  user: UserProfile;
  isEditing: boolean;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
}

export function AdditionalInfoSection({
  user,
  isEditing,
  onUpdateProfile,
}: AdditionalInfoSectionProps) {
  const ADDITIONAL_INFO_MAX_LENGTH = 400;

  const handleAdditionalInfoChange = (value: string) => {
    onUpdateProfile({ additional_info: value });
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Дополнительно
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div>
            <div className="flex justify-end mb-1">
              <CharacterCounter
                current={user.additional_info?.length || 0}
                max={ADDITIONAL_INFO_MAX_LENGTH}
              />
            </div>
            <Textarea
              value={user.additional_info || ""}
              onChange={(e) => handleAdditionalInfoChange(e.target.value)}
              className="resize-none"
              placeholder="Add any additional information..."
              rows={4}
              maxLength={ADDITIONAL_INFO_MAX_LENGTH}
            />
          </div>
        ) : (
          <p className="text-foreground whitespace-pre-wrap break-words">
            {user.additional_info || (
              <span className="text-muted-foreground italic text-sm">
                Нет данных
              </span>
            )}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
