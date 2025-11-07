import parse from "html-react-parser";
import DOMPurify from "dompurify";

export function PostContentViewer({ html }: { html: string }) {
  const clean = DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });

  return <div className="post-content py-4">{parse(clean)}</div>;
}
