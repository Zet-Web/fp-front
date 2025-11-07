// Dialog component for inserting/editing links in the rich text editor

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LinkDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (url: string) => void;
  onRemove?: () => void;
  initialUrl?: string;
}

export function LinkDialog({
  isOpen,
  onClose,
  onSave,
  onRemove,
  initialUrl = "",
}: LinkDialogProps) {
  const [url, setUrl] = useState(initialUrl);

  useEffect(() => {
    setUrl(initialUrl);
  }, [initialUrl, isOpen]);

  const handleSave = () => {
    if (url.trim()) {
      onSave(url.trim());
    }
    onClose();
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove();
    }
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{initialUrl ? "Edit Link" : "Insert Link"}</DialogTitle>
          <DialogDescription>
            Enter the URL you want to link to
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="link-url">URL</Label>
            <Input
              id="link-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="https://example.com"
              autoFocus
            />
          </div>
        </div>
        <DialogFooter className="flex justify-between sm:justify-between">
          <div>
            {initialUrl && onRemove && (
              <Button variant="destructive" onClick={handleRemove}>
                Remove Link
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!url.trim()}>
              {initialUrl ? "Update" : "Insert"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
