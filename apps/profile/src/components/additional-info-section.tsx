import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { FileText } from "lucide-react"

interface UserProfile {
  id: string
  name: string | null
  username: string | null
  email?: string
  avatar_url: string | null
  about: string | null
  telegram_username: string | null
  profile_type: string | null
  badge: string[] | null
  birthday: string | null
  birthday_visibility: 'full' | 'month_day' | 'year' | 'day_month' | 'day' | 'month' | null
  additional_info: string | null
}

interface AdditionalInfoSectionProps {
  user: UserProfile
  isOwnProfile: boolean
  isEditing: boolean
  onUpdateProfile: (updates: Partial<UserProfile>) => void
}

export function AdditionalInfoSection({ user, isOwnProfile, isEditing, onUpdateProfile }: AdditionalInfoSectionProps) {
  const handleAdditionalInfoChange = (value: string) => {
    onUpdateProfile({ additional_info: value })
  }

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
            value={user.additional_info || ''}
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
  )
}
