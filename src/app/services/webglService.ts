'use client';

interface WebGLContent {
  id: string;
  title: string;
  content: string;
  filename: string;
}

// 模拟从服务器获取WebGL内容
export const getWebGLContents = async (): Promise<WebGLContent[]> => {
  console.log('Fetching WebGL contents list');
  // 在实际应用中，这里应该是从服务器获取内容
  // 现在我们模拟三个HTML文件的内容
  return [
    {
      id: '1',
      title: 'WebGL基础',
      content: '', // 实际内容会在运行时加载
      filename: 'webGL.html'
    },
    {
      id: '2',
      title: '3D计算机图形学：原理与实现',
      content: '', // 实际内容会在运行时加载
      filename: 'webgl_3d_rendering.html'
    },
    {
      id: '3',
      title: 'WebGL软件结构',
      content: '', // 实际内容会在运行时加载
      filename: 'webgl_software_structure.html'
    }
  ];
};

// 加载单个WebGL内容
export const getWebGLContent = async (filename: string): Promise<string> => {
  console.log(`Fetching WebGL content for: ${filename}`);
  try {
    // 构建API URL
    const apiUrl = `/api/webgl?filename=${encodeURIComponent(filename)}`;
    console.log(`API URL: ${apiUrl}`);

    // 发送请求
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      cache: 'no-store'
    });

    // 检查响应状态
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API error response:', response.status, errorData);
      throw new Error(`Failed to load WebGL content: ${response.status} ${response.statusText}`);
    }

    // 获取响应文本
    const content = await response.text();
    console.log(`Content received, length: ${content.length}`);

    if (!content || content.length < 100) {
      console.warn('Content seems too short, might be incomplete:', content);
    }

    return content;
  } catch (error) {
    console.error('Error loading WebGL content:', error);
    throw error; // 重新抛出错误，让调用者处理
  }
}; 