'use client';
import React from 'react';
import { Bubble } from '@ant-design/x';

interface ChatMessageProps {
  content: string;
  sender: 'user' | 'ai';
  timestamp: number;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ content, sender, timestamp }) => {
  return (
    <div className={`flex ${sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
      <Bubble
        className={`max-w-[80%] rounded-lg p-3 ${
          sender === 'user' ? 'message-user' : 'message-ai'
        }`}
        content={content}
      />
    </div>
  );
};

export default ChatMessage; 