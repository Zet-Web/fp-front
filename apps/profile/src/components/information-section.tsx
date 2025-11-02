import { ContactsSection } from "./contacts-section";
import { BirthdaySection } from "./birthday-section";
import { ExperienceSection } from "./experience-section";
import { EducationSection } from "./education-section";
import { AwardsSection } from "./awards-section";
import { AdditionalInfoSection } from "./additional-info-section";
import { UserAdditionalInfo, UserProfile } from "../types/profile";

interface InformationSectionProps {
  user: UserProfile;
  additionalInfo: UserAdditionalInfo | null;
  isEditing: boolean;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  onUpdateAdditionalInfo: (updates: Partial<UserAdditionalInfo>) => void;
}

export function InformationSection({
  user,
  isEditing,
  onUpdateProfile,
  additionalInfo,
  onUpdateAdditionalInfo,
}: InformationSectionProps) {
  return (
    <div className="space-y-6">
      <ContactsSection
        additionalInfo={additionalInfo}
        onUpdateAdditionalInfo={onUpdateAdditionalInfo}
        isEditing={isEditing}
      />
      <ExperienceSection
        additionalInfo={additionalInfo}
        onUpdateAdditionalInfo={onUpdateAdditionalInfo}
        isEditing={isEditing}
      />
      <EducationSection
        additionalInfo={additionalInfo}
        onUpdateAdditionalInfo={onUpdateAdditionalInfo}
        isEditing={isEditing}
      />
      <AwardsSection
        additionalInfo={additionalInfo}
        onUpdateAdditionalInfo={onUpdateAdditionalInfo}
        isEditing={isEditing}
      />
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
