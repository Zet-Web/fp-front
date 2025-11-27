import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { createPublicProfile } from "../../../../shared-src/profile/api";
import { CreatePublicProfileDto } from "../../../../shared-src/profile/types";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { CharacterCounter } from "@/components/shared/CharacterCounter";
import { useActiveProfile } from "../../../../shared-src/profile/ActiveProfileContext";

const NAME_MAX_LENGTH = 50;
const ABOUT_MAX_LENGTH = 400;

export function CreatePublicProfilePage() {
  const navigate = useNavigate();
  const { loadPublicProfiles } = useActiveProfile();

  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<CreatePublicProfileDto>({
    name: "",
    about: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Название обязательно";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsCreating(true);
    try {
      const result = await createPublicProfile(formData);
      toast.success("Публичный профиль создан");
      if (result.username) {
        await loadPublicProfiles();
        navigate(`/${result.username}`);
      }

      setFormData({
        name: "",
        about: "",
      });
    } catch (error: unknown) {
      const errorMessage =
        (error as Error)?.message || "Не удалось создать профиль";
      toast.error(errorMessage);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-4 md:py-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Создать публичный профиль</CardTitle>
          <CardDescription>
            Создайте публичный профиль для ассоциации, организации или
            сообщества
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Название <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Например: Ассоциация юристов"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (errors.name) setErrors({ ...errors, name: "" });
              }}
              maxLength={NAME_MAX_LENGTH}
              className={errors.name ? "border-destructive" : ""}
            />
            <div className="flex justify-between items-center">
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
              <div className="ml-auto">
                <CharacterCounter
                  current={formData.name.length}
                  max={NAME_MAX_LENGTH}
                />
              </div>
            </div>
          </div>

          {/* About */}
          <div className="space-y-2">
            <Label htmlFor="about">Описание</Label>
            <Textarea
              id="about"
              placeholder="Расскажите о профиле..."
              value={formData.about}
              onChange={(e) =>
                setFormData({ ...formData, about: e.target.value })
              }
              rows={4}
              maxLength={ABOUT_MAX_LENGTH}
            />
            <div className="flex justify-end">
              <CharacterCounter
                current={formData.about?.length || 0}
                max={ABOUT_MAX_LENGTH}
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            disabled={isCreating}
          >
            Отмена
          </Button>
          <Button onClick={handleSubmit} disabled={isCreating}>
            {isCreating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isCreating ? "Создание..." : "Создать"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
