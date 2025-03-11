"use client";
import React from "react";
import { Button, Divider } from "antd";
import { PlusOutlined, BookOutlined } from "@ant-design/icons";
import { Conversations } from "@ant-design/x";
import type { Conversation as XConversation } from "@ant-design/x/es/conversations";
import Link from "next/link";

interface Conversation {
  id: string;
  title: string;
  messages: any[];
  model: string;
}

interface SidebarProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  currentConversationId,
  onNewChat,
  onSelectConversation,
}) => {
  // 将我们的对话数据转换为 Conversations 组件需要的格式
  const conversationItems: XConversation[] = conversations.map((conv) => ({
    key: conv.id,
    label: conv.title,
    timestamp: Date.now(),
  }));

  // 处理会话选择
  const handleActiveChange = (key: string) => {
    onSelectConversation(key);
  };

  return (
    <div className="chat-sidebar bg-[#202123] text-white flex flex-col h-full">
      <div className="p-5">
        <Button
          className="w-full flex items-center justify-start border border-white/20 bg-transparent text-white"
          onClick={onNewChat}
          icon={<PlusOutlined />}
        >
          新建对话
        </Button>
      </div>
      
      <div className="px-5 mb-4">
        <Link href="/webgl">
          <Button
            className="w-full flex items-center justify-start border border-white/20 bg-transparent text-white"
            icon={<BookOutlined />}
          >
            WebGL 学习资料
          </Button>
        </Link>
      </div>
      
      <Divider className="border-white/10 my-2" />
      
      <div className="flex-1 overflow-y-auto px-2">
        <Conversations
          items={conversationItems}
          activeKey={currentConversationId || undefined}
          onActiveChange={handleActiveChange}
          className="text-white"
          classNames={{
            item: 'hover:bg-white/10 text-white'
          }}
          styles={{
            item: { 
              backgroundColor: 'transparent',
              color: 'white'
            }
          }}
          rootClassName="bg-transparent"
        />
      </div>
    </div>
  );
};

export default Sidebar;
