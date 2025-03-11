'use client';
import React, { useState, useEffect } from 'react';
import { Layout, Dropdown, Button, Menu } from 'antd';
import { UserOutlined, SettingOutlined, LoginOutlined } from '@ant-design/icons';
import Sidebar from './components/Sidebar';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import EmptyState from './components/EmptyState';

const { Header, Sider, Content } = Layout;

interface Message {
  sender: 'user' | 'ai';
  content: string;
  timestamp: number;
  model?: string;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  model: string;
}

const Home = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [thinkingMode, setThinkingMode] = useState(false);
  const [currentModel, setCurrentModel] = useState('gpt-3.5');

  // 从本地存储加载对话
  useEffect(() => {
    const savedConversations = localStorage.getItem('aiChatConversations');
    if (savedConversations) {
      const parsedConversations = JSON.parse(savedConversations);
      setConversations(parsedConversations);
      
      // 如果有对话，设置当前对话为第一个
      if (parsedConversations.length > 0) {
        setCurrentConversationId(parsedConversations[0].id);
        setCurrentModel(parsedConversations[0].model || 'gpt-3.5');
      }
    }
  }, []);

  // 保存对话到本地存储
  const saveConversations = (newConversations: Conversation[]) => {
    localStorage.setItem('aiChatConversations', JSON.stringify(newConversations));
    setConversations(newConversations);
  };

  // 创建新对话
  const handleNewChat = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: '新对话',
      messages: [],
      model: currentModel,
    };
    
    const updatedConversations = [newConversation, ...conversations];
    saveConversations(updatedConversations);
    setCurrentConversationId(newConversation.id);
  };

  // 选择对话
  const handleSelectConversation = (id: string) => {
    setCurrentConversationId(id);
    const conversation = conversations.find(c => c.id === id);
    if (conversation) {
      setCurrentModel(conversation.model || 'gpt-3.5');
    }
  };

  // 发送消息
  const handleSendMessage = (message: string) => {
    if (!message.trim()) return;
    
    // 如果没有当前对话，创建一个新对话
    if (!currentConversationId) {
      handleNewChat();
      setTimeout(() => {
        // 在新对话创建后再次尝试发送消息
        handleSendMessage(message);
      }, 100);
      return;
    }
    
    setIsLoading(true);
    
    // 获取当前对话
    const updatedConversations = [...conversations];
    const conversationIndex = updatedConversations.findIndex(c => c.id === currentConversationId);
    
    if (conversationIndex === -1) return;
    
    // 添加用户消息
    const userMessage: Message = {
      sender: 'user',
      content: message,
      timestamp: Date.now(),
    };
    
    updatedConversations[conversationIndex].messages.push(userMessage);
    
    // 如果是第一条消息，更新对话标题
    if (updatedConversations[conversationIndex].messages.length === 1) {
      updatedConversations[conversationIndex].title = message.length > 20 
        ? message.substring(0, 20) + '...' 
        : message;
    }
    
    // 保存当前使用的模型
    updatedConversations[conversationIndex].model = currentModel;
    
    // 保存对话
    saveConversations(updatedConversations);
    
    // 模拟 AI 回复
    setTimeout(() => {
      const aiMessage: Message = {
        sender: 'ai',
        content: getAIResponse(message, currentModel),
        timestamp: Date.now(),
        model: currentModel,
      };
      
      const finalConversations = [...updatedConversations];
      finalConversations[conversationIndex].messages.push(aiMessage);
      
      saveConversations(finalConversations);
      setIsLoading(false);
    }, thinkingMode ? 2000 : 1000);
  };

  // 模拟 AI 回复
  const getAIResponse = (message: string, model: string) => {
    const responses = [
      "我理解您的问题，这是一个很好的问题。",
      "根据我的理解，这个问题可以从多个角度来看。",
      "这是一个有趣的话题，让我来分享一些想法。",
      "我可以提供一些相关信息来帮助您理解这个问题。",
      "这个问题很复杂，但我会尽力解释清楚。"
    ];
    
    let modelInfo = "";
    if (model === "gpt-3.5") {
      modelInfo = "（使用 GPT-3.5 模型）";
    } else if (model === "gpt-4") {
      modelInfo = "（使用 GPT-4 模型）";
    } else if (model === "claude") {
      modelInfo = "（使用 Claude 模型）";
    }
    
    return responses[Math.floor(Math.random() * responses.length)] + 
           " 这是一个原型演示，实际应用中这里会连接到真正的 AI 模型来生成回复。" + modelInfo;
  };

  // 处理示例选择
  const handleSelectExample = (prompt: string) => {
    if (!currentConversationId) {
      handleNewChat();
    }
    handleSendMessage(prompt);
  };

  // 获取当前对话
  const currentConversation = currentConversationId 
    ? conversations.find(c => c.id === currentConversationId) 
    : null;

  return (
    <Layout className="chat-layout">
      <Sider width={260} theme="dark" className="chat-sidebar">
        <Sidebar
          conversations={conversations}
          currentConversationId={currentConversationId}
          onNewChat={handleNewChat}
          onSelectConversation={handleSelectConversation}
        />
      </Sider>
      <Layout className="chat-main">
        <Header className="flex justify-between items-center bg-white border-b border-gray-200 px-5 py-2 h-auto shadow-sm">
          <div className="font-semibold text-lg">
            {currentConversation ? currentConversation.title : 'AI 聊天助手'}
          </div>
          <Dropdown menu={{ items: [
            {
              key: 'settings',
              icon: <SettingOutlined />,
              label: '设置'
            },
            {
              key: 'login',
              icon: <LoginOutlined />,
              label: '登录'
            }
          ]}} trigger={['click']}>
            <Button icon={<UserOutlined />} type="text">
              用户
            </Button>
          </Dropdown>
        </Header>
        <Content className="chat-container">
          {currentConversation && currentConversation.messages.length > 0 ? (
            currentConversation.messages.map((message, index) => (
              <ChatMessage
                key={index}
                content={message.content}
                sender={message.sender}
                timestamp={message.timestamp}
              />
            ))
          ) : (
            <EmptyState onSelectExample={handleSelectExample} />
          )}
        </Content>
        <div className="p-4 border-t border-gray-200">
          <ChatInput
            onSendMessage={handleSendMessage}
            onModelChange={setCurrentModel}
            onThinkingModeChange={setThinkingMode}
            disabled={isLoading}
            model={currentModel}
          />
        </div>
      </Layout>
    </Layout>
  );
};

export default Home;