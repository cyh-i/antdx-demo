'use client';
import React, { useState, useRef } from 'react';
import { Sender, Attachments } from '@ant-design/x';
import { Button, Select, Switch, Space, Tooltip } from 'antd';
import { SendOutlined, UploadOutlined } from '@ant-design/icons';
import type { AttachmentsRef, Attachment } from '@ant-design/x/es/attachments';
import type { UploadFile, UploadChangeParam } from 'antd/es/upload/interface';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onModelChange: (model: string) => void;
  onThinkingModeChange: (enabled: boolean) => void;
  disabled?: boolean;
  model: string;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onModelChange,
  onThinkingModeChange,
  disabled = false,
  model,
}) => {
  const [message, setMessage] = useState('');
  const [thinkingMode, setThinkingMode] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const attachmentsRef = useRef<AttachmentsRef>(null);

  const handleSend = () => {
    if (message.trim() || attachments.length > 0) {
      onSendMessage(message);
      setMessage('');
      setAttachments([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleThinkingModeChange = (checked: boolean) => {
    setThinkingMode(checked);
    onThinkingModeChange(checked);
  };

  const handleUploadClick = () => {
    // 触发文件选择器
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          attachmentsRef.current?.upload(files[i]);
        }
      }
    };
    input.click();
  };

  const handleAttachmentChange = (info: UploadChangeParam<UploadFile>) => {
    // 将 antd 的 UploadFile 转换为 Attachment 类型
    const newAttachments = info.fileList.map(file => file as unknown as Attachment);
    setAttachments(newAttachments);
  };

  return (
    <div className="input-container">
      <div className="border border-gray-200 rounded-lg bg-white shadow-sm">
        {attachments.length > 0 && (
          <div className="p-2 border-b">
            <Attachments
              ref={attachmentsRef}
              items={attachments}
              onChange={handleAttachmentChange}
              disabled={disabled}
            />
          </div>
        )}
        <Sender
          value={message}
          onChange={(value) => setMessage(value)}
          onKeyDown={handleKeyDown}
          placeholder="输入消息..."
          disabled={disabled}
          submitType={false} // 禁用默认的回车提交，使用我们自定义的处理
          onSubmit={handleSend}
          onPasteFile={(file) => {
            attachmentsRef.current?.upload(file);
          }}
        />
        <div className="flex justify-between items-center p-2 border-t">
          <Space>
            <Tooltip title="上传文件">
              <Button 
                icon={<UploadOutlined />} 
                type="text"
                onClick={handleUploadClick}
                disabled={disabled}
              >
                上传
              </Button>
            </Tooltip>
            <Space>
              <span>思考</span>
              <Switch 
                checked={thinkingMode} 
                onChange={handleThinkingModeChange} 
                size="small" 
              />
            </Space>
          </Space>
          <Space>
            <Select
              value={model}
              onChange={onModelChange}
              style={{ width: 120 }}
              options={[
                { value: 'gpt-3.5', label: 'GPT-3.5' },
                { value: 'gpt-4', label: 'GPT-4' },
                { value: 'claude', label: 'Claude' },
              ]}
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSend}
              disabled={(!message.trim() && attachments.length === 0) || disabled}
            >
              发送
            </Button>
          </Space>
        </div>
      </div>
    </div>
  );
};

export default ChatInput; 