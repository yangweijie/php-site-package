#!/bin/bash

# PHP Desktop Packager - 开发启动脚本

echo "🚀 启动 PHP Desktop Packager 开发环境"
echo "=================================="

# 检查Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js"
    exit 1
fi

# 检查Rust
if ! command -v rustc &> /dev/null; then
    echo "❌ Rust 未安装，正在安装..."
    brew install rust
fi

# 检查依赖
if [ ! -d "node_modules" ]; then
    echo "📦 安装前端依赖..."
    npm install
fi

echo "✅ 环境检查完成"
echo ""

# 启动开发服务器
echo "🔧 启动 Tauri 开发服务器..."
echo "首次启动可能需要几分钟时间编译 Rust 依赖"
echo ""

npm run tauri dev
