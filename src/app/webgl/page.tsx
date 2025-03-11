'use client';
import React, { useState, useEffect } from 'react';
import { Tabs, Spin } from 'antd';
import WebGLContent from '../components/WebGLContent';
import { getWebGLContents, getWebGLContent } from '../services/webglService';

const WebGLPage = () => {
  const [webglContents, setWebglContents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeKey, setActiveKey] = useState('1');
  const [loadingContent, setLoadingContent] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadContents = async () => {
      try {
        const contents = await getWebGLContents();
        
        // 加载第一个内容
        if (contents.length > 0) {
          const firstContent = contents[0];
          setLoadingContent(prev => ({ ...prev, [firstContent.id]: true }));
          
          try {
            const htmlContent = await getWebGLContent(firstContent.filename);
            firstContent.content = htmlContent;
            setLoadingContent(prev => ({ ...prev, [firstContent.id]: false }));
          } catch (err) {
            console.error(`Error loading content for ${firstContent.filename}:`, err);
            setLoadingContent(prev => ({ ...prev, [firstContent.id]: false }));
            setError(`加载内容 ${firstContent.title} 失败，请稍后重试`);
          }
        }
        
        setWebglContents(contents);
        setLoading(false);
      } catch (error) {
        console.error('Error loading WebGL contents:', error);
        setLoading(false);
        setError('加载WebGL内容列表失败，请刷新页面重试');
      }
    };
    
    loadContents();
  }, []);

  const handleTabChange = async (key: string) => {
    setActiveKey(key);
    
    // 如果内容还没有加载，则加载内容
    const selectedContent = webglContents.find(content => content.id === key);
    if (selectedContent && !selectedContent.content) {
      try {
        setLoadingContent(prev => ({ ...prev, [key]: true }));
        const htmlContent = await getWebGLContent(selectedContent.filename);
        
        setWebglContents(prevContents => 
          prevContents.map(content => 
            content.id === key ? { ...content, content: htmlContent } : content
          )
        );
        setLoadingContent(prev => ({ ...prev, [key]: false }));
      } catch (error) {
        console.error('Error loading WebGL content:', error);
        setLoadingContent(prev => ({ ...prev, [key]: false }));
        setError(`加载内容 ${selectedContent.title} 失败，请稍后重试`);
      }
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="bg-white shadow-md z-10">
        <div className="container mx-auto pt-4 px-2">    
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <p>{error}</p>
              <button 
                className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                onClick={() => window.location.reload()}
              >
                刷新页面
              </button>
            </div>
          )}
          
          {!loading && (
            <Tabs
              activeKey={activeKey}
              onChange={handleTabChange}
              type="card"
              size="large"
              className="webgl-tabs"
              items={webglContents.map(content => ({
                key: content.id,
                label: content.title,
                children: null
              }))}
            />
          )}
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-4">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Spin spinning={true}>
                <div className="h-64 flex items-center justify-center">
                  <p className="text-gray-500">加载中...</p>
                </div>
              </Spin>
            </div>
          ) : (
            webglContents.map(content => (
              <div 
                key={content.id} 
                className={`${activeKey === content.id ? 'block' : 'hidden'}`}
              >
                {loadingContent[content.id] ? (
                  <div className="flex justify-center items-center h-64">
                    <Spin spinning={true}>
                      <div className="h-64 flex items-center justify-center">
                        <p className="text-gray-500">加载内容中...</p>
                      </div>
                    </Spin>
                  </div>
                ) : content.content ? (
                  <WebGLContent 
                    htmlContent={content.content} 
                    title={content.title} 
                  />
                ) : (
                  <div className="flex justify-center items-center h-64">
                    <p className="text-gray-500">没有内容可显示</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default WebGLPage; 