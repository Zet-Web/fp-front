import { ContactsSection } from "./contacts-section";
import { BirthdaySection } from "./birthday-section";
import { ExperienceSection } from "./experience-section";
import { EducationSection } from "./education-section";
import { AwardsSection } from "./awards-section";
import { AdditionalInfoSection } from "./additional-info-section";
import { UserAdditionalInfo, UserProfile } from "../types/profile";
import { Card, CardContent } from "@/components/ui/card";

interface InformationSectionProps {
  user: UserProfile;
  additionalInfo: UserAdditionalInfo | null;
  isEditing: boolean;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  onUpdateAdditionalInfo: (updates: Partial<UserAdditionalInfo>) => void;
  isAdditionalInfoLoading?: boolean;
}

export function InformationSection({
  user,
  isEditing,
  onUpdateProfile,
  additionalInfo,
  onUpdateAdditionalInfo,
  isAdditionalInfoLoading,
}: InformationSectionProps) {
  if (isAdditionalInfoLoading) {
    return (
      <div className="bg-background flex items-center justify-center overflow-y-auto">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">
              Загрузка...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {((additionalInfo?.contact_info && additionalInfo.contact_info.length > 0) || isEditing) && (
        <ContactsSection
          additionalInfo={additionalInfo}
          onUpdateAdditionalInfo={onUpdateAdditionalInfo}
          isEditing={isEditing}
        />
      )}
      {((additionalInfo?.experience && additionalInfo.experience.length > 0) || isEditing) && (
        <ExperienceSection
          additionalInfo={additionalInfo}
          onUpdateAdditionalInfo={onUpdateAdditionalInfo}
          isEditing={isEditing}
        />
      )}
      {((additionalInfo?.education && additionalInfo.education.length > 0) || isEditing) && (
        <EducationSection
          additionalInfo={additionalInfo}
          onUpdateAdditionalInfo={onUpdateAdditionalInfo}
          isEditing={isEditing}
        />
      )}
      {((additionalInfo?.awards && additionalInfo.awards.length > 0) || isEditing) && (
        <AwardsSection
          additionalInfo={additionalInfo}
          onUpdateAdditionalInfo={onUpdateAdditionalInfo}
          isEditing={isEditing}
        />
      )}
      <AdditionalInfoSection
        user={user}
        isEditing={isEditing}
        onUpdateProfile={onUpdateProfile}
      />
      <BirthdaySection
        user={user}
        isEditing={isEditing}
        onUpdateProfile={onUpdateProfile}
      />
    </div>
  );
}
