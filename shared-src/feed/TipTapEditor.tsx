// Enhanced TipTap editor component with extended formatting options and character counter

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import CharacterCount from "@tiptap/extension-character-count";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import { EditorToolbar } from "./EditorToolbar";

type Props = {
  value?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  showCharacterCount?: boolean;
  maxCharacters?: number;
};

export function TiptapEditor({
  value = "",
  onChange,
  placeholder = "Напиши что-нибудь...",
  showCharacterCount = true,
  maxCharacters,
}: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "font-medium text-primary underline underline-offset-4 cursor-pointer",
        },
      }),
      Table.configure({
        resizable: false,
        HTMLAttributes: {
          class: "table-auto w-full border-collapse my-4",
        },
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: {
          class: "border border-border px-4 py-2 text-left font-bold bg-muted/50",
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: "border border-border px-4 py-2 text-left",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      CharacterCount.configure({
        limit: maxCharacters,
      }),
    ],
    content: value,
    onUpdate({ editor }) {
      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "ProseMirror p-4 min-h-[200px] focus:outline-none leading-7",
      },
    },
  });

  const characterCount = editor?.storage.characterCount.characters() || 0;
  const wordCount = editor?.storage.characterCount.words() || 0;

  return (
    <div className="rounded-md border bg-card">
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} />
      {showCharacterCount && (
        <div className="flex items-center justify-between border-t px-4 py-2 text-xs text-muted-foreground">
          <div className="flex gap-4">
            <span>
              {characterCount} character{characterCount !== 1 ? "s" : ""}
            </span>
            <span>
              {wordCount} word{wordCount !== 1 ? "s" : ""}
            </span>
          </div>
          {maxCharacters && (
            <span
              className={
                characterCount > maxCharacters ? "text-destructive" : ""
              }
            >
              {characterCount} / {maxCharacters}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
