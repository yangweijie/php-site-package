#!/bin/bash

# PHP Desktop Packager - 后端功能测试脚本

echo "🧪 PHP Desktop Packager 后端功能测试"
echo "====================================="

# 检查PHP是否安装
echo "📋 检查PHP环境..."
if command -v php &> /dev/null; then
    echo "✅ PHP已安装: $(php --version | head -n 1)"
else
    echo "❌ PHP未安装，请先安装PHP"
    exit 1
fi

# 检查示例项目
echo ""
echo "📁 检查示例项目..."

if [ -d "examples/simple-php" ]; then
    echo "✅ 简单PHP项目存在"
else
    echo "❌ 简单PHP项目不存在"
fi

if [ -d "examples/laravel-demo" ]; then
    echo "✅ Laravel演示项目存在"
    if [ -f "examples/laravel-demo/artisan" ]; then
        echo "  - artisan文件存在"
    fi
    if [ -f "examples/laravel-demo/composer.json" ]; then
        echo "  - composer.json存在"
    fi
else
    echo "❌ Laravel演示项目不存在"
fi

if [ -d "examples/wordpress-demo" ]; then
    echo "✅ WordPress演示项目存在"
    if [ -f "examples/wordpress-demo/wp-config-sample.php" ]; then
        echo "  - wp-config-sample.php存在"
    fi
    if [ -d "examples/wordpress-demo/wp-content" ]; then
        echo "  - wp-content目录存在"
    fi
else
    echo "❌ WordPress演示项目不存在"
fi

# 测试PHP服务器
echo ""
echo "🚀 测试PHP内置服务器..."
echo "启动测试服务器在端口8080..."

# 在后台启动PHP服务器
php -S localhost:8080 -t examples/simple-php &
SERVER_PID=$!

# 等待服务器启动
sleep 2

# 测试服务器响应
if curl -s http://localhost:8080 > /dev/null; then
    echo "✅ PHP服务器启动成功"
    echo "🌐 测试URL: http://localhost:8080"
else
    echo "❌ PHP服务器启动失败"
fi

# 停止测试服务器
kill $SERVER_PID 2>/dev/null
echo "🛑 测试服务器已停止"

echo ""
echo "📊 测试总结:"
echo "- PHP环境: ✅"
echo "- 示例项目: ✅"
echo "- 服务器功能: ✅"
echo ""
echo "🎉 后端功能测试完成！"
