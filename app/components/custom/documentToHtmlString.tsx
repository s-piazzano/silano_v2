"use client";

import { Remark } from "react-remark";

interface DocumentToHtmlStringProps {
  description: string;
}

export default function DocumentToHtmlString({ description }: DocumentToHtmlStringProps) {
  return (
    <div className="documentToHtml">
      <Remark>{description}</Remark>
      <div />
    </div>
  );
}
