import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { FileText } from "lucide-react";
import { UserProfile } from "../types/profile";

interface AdditionalInfoSectionProps {
  user: UserProfile;
  isOwnProfile: boolean;
  isEditing: boolean;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
}

export function AdditionalInfoSection({
  user,
  isOwnProfile,
  isEditing,
  onUpdateProfile,
}: AdditionalInfoSectionProps) {
  const handleAdditionalInfoChange = (value: string) => {
    onUpdateProfile({ additional_info: value });
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Additional Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <Textarea
            value={user.additional_info || ""}
            onChange={(e) => handleAdditionalInfoChange(e.target.value)}
            className="resize-none"
            placeholder="Add any additional information..."
            rows={4}
          />
        ) : (
          <p className="text-foreground whitespace-pre-wrap">
            {user.additional_info || (
              <span className="text-muted-foreground italic text-sm">
                No additional information available
              </span>
            )}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
