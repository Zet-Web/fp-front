// Post content viewer component with safe HTML rendering and table support

import parse from "html-react-parser";
import DOMPurify from "dompurify";

export function PostContentViewer({ html }: { html: string }) {
  const clean = DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    ADD_TAGS: ["table", "thead", "tbody", "tr", "th", "td", "col", "colgroup"],
    ADD_ATTR: ["colspan", "rowspan", "scope", "data-colwidth"],
  });

  return (
    <div className="post-content">
      {parse(clean)}
    </div>
  );
}
