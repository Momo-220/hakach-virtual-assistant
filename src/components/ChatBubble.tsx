"use client";

import React from 'react';
import ReactMarkdown from 'react-markdown';

interface ChatBubbleProps {
  message: string;
  isUser: boolean;
  isTyping?: boolean;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isUser, isTyping }) => {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3 sm:mb-4`}>
      <div className={`max-w-[90%] sm:max-w-[85%] md:max-w-[80%] rounded-2xl px-3 py-2 sm:px-4 sm:py-3 ${
        isUser 
          ? 'bg-black text-white border border-amber-500' 
          : 'bg-gradient-to-r from-amber-500 to-amber-400 text-black'
      } ${isUser ? 'rounded-tr-none' : 'rounded-tl-none'} shadow-lg`}>
        {isTyping ? (
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        ) : (
          <div className="prose prose-xs sm:prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown 
              components={{
                p: ({children}) => <p className="mb-1 sm:mb-2 last:mb-0 leading-relaxed text-sm sm:text-base">{children}</p>,
                strong: ({children}) => <strong className="font-semibold">{children}</strong>,
                em: ({children}) => <em className="italic opacity-90">{children}</em>,
                a: ({href, children}) => (
                  <a 
                    href={href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="underline hover:no-underline transition-all duration-200 font-medium"
                  >
                    {children}
                  </a>
                )
              }}
            >
              {message}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBubble; 