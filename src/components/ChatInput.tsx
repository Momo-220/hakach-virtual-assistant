"use client";

import React, { useState, KeyboardEvent } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="relative flex items-center gap-2 bg-black/40 rounded-xl p-1">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Écrivez votre message..."
        className="flex-1 bg-transparent text-amber-50 placeholder-amber-500/50 resize-none outline-none py-3 px-4 h-[44px] max-h-[44px] overflow-y-auto scrollbar-thin scrollbar-thumb-amber-500/20 scrollbar-track-transparent"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(245, 158, 11, 0.2) transparent'
        }}
      />
      <button
        onClick={handleSend}
        disabled={!message.trim() || isLoading}
        className={`flex items-center justify-center w-[44px] h-[44px] rounded-lg transition-all duration-300 transform
          ${message.trim() && !isLoading 
            ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 hover:scale-105 hover:rotate-3' 
            : 'bg-amber-500/20 cursor-not-allowed'}`}
        style={{
          boxShadow: message.trim() && !isLoading ? '0 2px 8px rgba(245, 158, 11, 0.3)' : 'none'
        }}
      >
        {isLoading ? (
          <svg className="animate-spin w-5 h-5 text-amber-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        ) : (
          <svg 
            viewBox="0 0 24 24" 
            className={`w-5 h-5 ${message.trim() ? 'text-black' : 'text-amber-500/50'}`}
            style={{
              filter: message.trim() ? 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))' : 'none'
            }}
            stroke="currentColor"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default ChatInput; 