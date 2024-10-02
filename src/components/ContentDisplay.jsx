import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { solarizedlight } from "react-syntax-highlighter/dist/esm/styles/prism";

const ContentDisplay = React.memo(({ finalContent }) => {
  const isCode = (content) => {
    return content.includes("```") && content.lastIndexOf("```") > content.indexOf("```");
  };

  const beautifyContent = (content) => {
    if (isCode(content)) {
      const codeStart = content.indexOf("```") + 3;
      const codeEnd = content.lastIndexOf("```");
      const code = content.slice(codeStart, codeEnd).trim();
      return (
        <SyntaxHighlighter language="javascript" style={solarizedlight}>
          {code}
        </SyntaxHighlighter>
      );
    }
    return <p className="text-gray-600">{content}</p>;
  };

  return <div className="p-4 mob:p-0">{beautifyContent(finalContent)}</div>;
});

export default ContentDisplay;
