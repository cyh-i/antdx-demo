'use client';
import React, { useEffect, useRef, useState } from 'react';

interface WebGLContentProps {
  htmlContent: string;
  title: string;
}

const WebGLContent: React.FC<WebGLContentProps> = ({ htmlContent, title }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [iframeHeight, setIframeHeight] = useState<number>(800);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [useDirectRender, setUseDirectRender] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!htmlContent) {
      setError("没有内容可显示");
      return;
    }

    try {
      // 首先尝试使用iframe方式
      if (iframeRef.current && !useDirectRender) {
        const iframe = iframeRef.current;
        
        // 将HTML内容写入iframe
        if (iframe.contentWindow) {
          iframe.contentWindow.document.open();
          iframe.contentWindow.document.write(htmlContent);
          iframe.contentWindow.document.close();
          
          // 设置iframe加载事件
          iframe.onload = () => {
            try {
              // 调整iframe高度以适应内容
              if (iframe.contentWindow && iframe.contentDocument?.body) {
                const height = iframe.contentDocument.body.scrollHeight;
                setIframeHeight(Math.max(800, height + 50)); // 最小高度800px
                setError(null);
              }
            } catch (error) {
              console.error('Error adjusting iframe height:', error);
              setError("调整iframe高度时出错，尝试使用直接渲染");
              setUseDirectRender(true);
            }
          };
        } else {
          setError("无法访问iframe内容窗口，尝试使用直接渲染");
          setUseDirectRender(true);
        }
      }
    } catch (error) {
      console.error('Error rendering content:', error);
      setError("渲染内容时出错，尝试使用直接渲染");
      setUseDirectRender(true);
    }
    
    // 如果使用直接渲染方式
    if (useDirectRender && contentRef.current) {
      contentRef.current.innerHTML = htmlContent;
    }
  }, [htmlContent, useDirectRender]);

  return (
    <div className="w-full">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
          {!useDirectRender && (
            <button 
              className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
              onClick={() => setUseDirectRender(true)}
            >
              尝试直接渲染
            </button>
          )}
        </div>
      )}
      
      <div className="webgl-content bg-white rounded-lg shadow-md p-6">
        {useDirectRender ? (
          <div 
            ref={contentRef} 
            className="webgl-direct-content"
            style={{ minHeight: '800px' }}
          />
        ) : (
          <iframe
            ref={iframeRef}
            className="w-full border-none"
            style={{ height: `${iframeHeight}px`, minHeight: '800px' }}
            title={title}
            sandbox="allow-same-origin allow-scripts"
          />
        )}
      </div>
    </div>
  );
};

export default WebGLContent; 