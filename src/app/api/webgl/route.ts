import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const filename = searchParams.get('filename');

  console.log(`API request for WebGL content: ${filename}`);

  if (!filename) {
    console.error('API error: Filename is required');
    return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
  }

  try {
    // 获取WebGL文件夹的路径
    const webglPath = path.join(process.cwd(), 'WebGL', filename);
    console.log(`Reading file from: ${webglPath}`);

    // 检查文件是否存在
    if (!fs.existsSync(webglPath)) {
      console.error(`API error: File not found - ${webglPath}`);
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // 读取文件内容
    const fileContent = fs.readFileSync(webglPath, 'utf8');
    console.log(`File read successfully, content length: ${fileContent.length}`);

    // 返回文件内容
    return new NextResponse(fileContent, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
    });
  } catch (error) {
    console.error('Error reading WebGL file:', error);
    return NextResponse.json({
      error: 'Failed to read file',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 