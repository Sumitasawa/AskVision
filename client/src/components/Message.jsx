import React, { useEffect, useState } from "react";
import moment from "moment";
import ReactMarkdown from "react-markdown";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import { assets } from "../assets/assets";

Prism.manual = true;

// ✅ Separate component for code blocks (so we can use hooks)
const CodeBlock = ({ inline, className, children, ...props }) => {
  const [copied, setCopied] = useState(false);

  const codeText = String(children).replace(/\n$/, "");
  const match = /language-(\w+)/.exec(className || "");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy code: ", err);
    }
  };

  if (inline) {
    return (
      <code className="bg-black/20 px-1 py-0.5 rounded text-sm">
        {children}
      </code>
    );
  }

  return (
    <div className="relative group my-2">
      {/* ✅ Copy button */}
      <button
        type="button"
        onClick={handleCopy}
        className="absolute top-2 right-2 text-xs px-2 py-1 rounded border border-white/20 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition"
      >
        {copied ? "Copied!" : "Copy"}
      </button>

      <pre className="rounded-lg p-3 bg-[#1e1e1e] text-white overflow-auto text-sm">
        <code
          className={match ? `language-${match[1]}` : className}
          {...props}
        >
          {codeText}
        </code>
      </pre>
    </div>
  );
};

const Message = ({ message }) => {
  const isUser = message.role === "user";

  // ✅ Highlight after markdown is rendered / content changes
  useEffect(() => {
    Prism.highlightAll();
  }, [message.content]);

  return (
    <div
      className={`flex items-start gap-3 my-4 ${
        isUser ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {/* ✅ Avatar only for user */}
      {isUser && (
        <img
          src={assets.user_icon}
          className="w-10 h-10 rounded-full border dark:border-white/20 object-cover"
          alt="User"
        />
      )}

      {/* 💬 Chat Bubble */}
      <div
        className={`max-w-[75%] p-4 rounded-2xl shadow-sm transition-all
          ${
            isUser
              ? "bg-blue-600 text-white rounded-br-none"
              : "bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white rounded-bl-none"
          }
        `}
      >
        {/* 🖼 Image message */}
        {message.isImage ? (
          <img
            src={message.content}
            className="rounded-lg max-w-xs border dark:border-white/10 mx-auto"
            alt="AI Output"
          />
        ) : (
          // 📝 Markdown content
          <div className="prose dark:prose-invert max-w-none leading-relaxed text-[15px]">
            <ReactMarkdown
              components={{
                code: CodeBlock,
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}

        {/* ⏱ Timestamp */}
        <p className="text-xs opacity-60 mt-2 text-right">
          {moment(message.timestamp).fromNow()}
        </p>
      </div>
    </div>
  );
};

export default Message;
