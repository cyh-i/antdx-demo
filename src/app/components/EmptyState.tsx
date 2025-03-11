'use client';
import React from 'react';
import { Typography, Card, Space, Button } from 'antd';
import Link from 'next/link';

const { Title, Paragraph } = Typography;

interface Example {
  prompt: string;
  title: string;
}

interface EmptyStateProps {
  onSelectExample: (prompt: string) => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onSelectExample }) => {
  const examples: Example[] = [
    { prompt: '解释量子计算的基本原理', title: '解释量子计算的基本原理' },
    { prompt: '写一首关于人工智能的短诗', title: '写一首关于人工智能的短诗' },
    { prompt: '如何提高编程效率？', title: '如何提高编程效率？' },
    { prompt: '推荐几本科幻小说', title: '推荐几本科幻小说' },
  ];

  return (
    <div className="empty-state">
      <Title level={2}>AI 聊天助手</Title>
      <Paragraph style={{ maxWidth: 500 }}>
        这是一个类似 ChatGPT 的 AI 聊天应用。您可以开始一个新的对话，或者从下面的示例中选择一个。
      </Paragraph>
      
      <div className="mb-6">
        <Link href="/webgl">
          <Button type="primary" size="large">
            查看 WebGL 学习资料
          </Button>
        </Link>
      </div>
      
      <div className="examples-grid">
        {examples.map((example, index) => (
          <Card
            key={index}
            hoverable
            onClick={() => onSelectExample(example.prompt)}
            style={{ cursor: 'pointer' }}
          >
            <Typography.Text strong>{example.title}</Typography.Text>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EmptyState; 