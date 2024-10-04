import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; // GitHub flavored markdown for tables, lists, etc.
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { solarizedlight } from "react-syntax-highlighter/dist/esm/styles/prism";

// Function to render Markdown content with syntax highlighting
const ContentDisplay = React.memo(({ finalContent }) => {
  return (
    <div className="content-container bg-white p-2 rounded-lg mx-auto">
      <ReactMarkdown
        children={finalContent}
        remarkPlugins={[remarkGfm]} // Enable GitHub Flavored Markdown (tables, task lists)
        components={{
          // Customize code block rendering with syntax highlighting
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <SyntaxHighlighter
                children={String(children).replace(/\n$/, "")}
                style={solarizedlight}
                language={match[1]}
                PreTag="div"
                {...props}
              />
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          // Customize rendering of unordered lists
          ul: ({ children }) => (
            <ul className="list-disc pl-5 mb-4 text-gray-700">{children}</ul>
          ),
          // Customize rendering of ordered lists
          ol: ({ children }) => (
            <ol className="list-decimal pl-5 mb-4 text-gray-700">{children}</ol>
          ),
          // Optional: Customize rendering of links
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              {children}
            </a>
          ),
        }}
      />
    </div>
  );
});

export default ContentDisplay;
