/* eslint-disable @typescript-eslint/no-explicit-any */
import { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Type,
  Code,
  List,
  ListOrdered,
  Link as LinkIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function EditorToolbar({ editor }: { editor: Editor | null }) {
  if (!editor) return null;

  const Btn = ({ onClick, active, children, title }: any) => (
    <Button
      variant="ghost"
      size="sm"
      className={`!p-2 ${active ? "is-active" : ""}`}
      onClick={onClick}
      title={title}
    >
      {children}
    </Button>
  );

  return (
    <div className="tiptap-toolbar flex items-center gap-2 border-b px-3 py-2">
      <Btn
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive("bold")}
        title="Bold (Ctrl/Cmd+B)"
      >
        <Bold className="h-4 w-4" />
      </Btn>

      <Btn
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive("italic")}
        title="Italic (Ctrl/Cmd+I)"
      >
        <Italic className="h-4 w-4" />
      </Btn>

      <Btn
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        active={editor.isActive("heading", { level: 1 })}
        title="H1"
      >
        <Type className="h-4 w-4" />
      </Btn>

      <Btn
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        active={editor.isActive("heading", { level: 2 })}
        title="H2"
      >
        <Type className="h-4 w-4" />
      </Btn>

      <Btn
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        active={editor.isActive("heading", { level: 3 })}
        title="H3"
      >
        <Type className="h-4 w-4" />
      </Btn>

      <Btn
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        active={editor.isActive("codeBlock")}
        title="Code block"
      >
        <Code className="h-4 w-4" />
      </Btn>

      <Btn
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive("bulletList")}
        title="Bulleted list"
      >
        <List className="h-4 w-4" />
      </Btn>

      <Btn
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive("orderedList")}
        title="Numbered list"
      >
        <ListOrdered className="h-4 w-4" />
      </Btn>

      <Btn
        onClick={() => {
          const previousUrl = editor.getAttributes("link").href;
          const url = window.prompt("Enter link URL", previousUrl ?? "");
          if (url === null) return;
          if (url === "") {
            editor.chain().focus().unsetLink().run();
            return;
          }
          editor
            .chain()
            .focus()
            .extendMarkRange("link")
            .setLink({ href: url })
            .run();
        }}
        active={editor.isActive("link")}
        title="Insert link"
      >
        <LinkIcon className="h-4 w-4" />
      </Btn>
    </div>
  );
}
