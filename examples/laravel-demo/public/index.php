<?php
// Laravel Demo Project Entry Point

echo "<!DOCTYPE html>";
echo "<html lang='en'>";
echo "<head>";
echo "<meta charset='UTF-8'>";
echo "<meta name='viewport' content='width=device-width, initial-scale=1.0'>";
echo "<title>Laravel Demo - PHP Desktop Packager</title>";
echo "<style>";
echo "body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; background: #f8f9fa; }";
echo ".container { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }";
echo ".header { text-align: center; color: #e74c3c; margin-bottom: 30px; }";
echo ".info { background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0; }";
echo ".feature { background: #f0f8ff; padding: 10px; margin: 10px 0; border-left: 4px solid #007bff; }";
echo "</style>";
echo "</head>";
echo "<body>";
echo "<div class='container'>";
echo "<div class='header'>";
echo "<h1>🚀 Laravel Demo Project</h1>";
echo "<p>PHP Desktop Packager 演示项目</p>";
echo "</div>";

echo "<div class='info'>";
echo "<h3>📋 项目信息</h3>";
echo "<p><strong>项目类型:</strong> Laravel Framework</p>";
echo "<p><strong>PHP版本:</strong> " . phpversion() . "</p>";
echo "<p><strong>入口文件:</strong> public/index.php</p>";
echo "<p><strong>当前时间:</strong> " . date('Y-m-d H:i:s') . "</p>";
echo "</div>";

echo "<div class='feature'>";
echo "<h3>✨ Laravel 特性</h3>";
echo "<ul>";
echo "<li>MVC 架构模式</li>";
echo "<li>Eloquent ORM</li>";
echo "<li>Blade 模板引擎</li>";
echo "<li>Artisan 命令行工具</li>";
echo "<li>中间件系统</li>";
echo "</ul>";
echo "</div>";

echo "<div class='feature'>";
echo "<h3>🔧 开发工具</h3>";
echo "<ul>";
echo "<li>Composer 依赖管理</li>";
echo "<li>PHPUnit 单元测试</li>";
echo "<li>Laravel Mix 资源编译</li>";
echo "<li>数据库迁移</li>";
echo "</ul>";
echo "</div>";

echo "<div class='info'>";
echo "<h3>🎯 打包测试</h3>";
echo "<p>这个Laravel演示项目用于测试PHP Desktop Packager的以下功能：</p>";
echo "<ul>";
echo "<li>✅ 项目类型自动识别</li>";
echo "<li>✅ 入口文件自动检测</li>";
echo "<li>✅ PHP服务器启动</li>";
echo "<li>✅ 实时预览功能</li>";
echo "</ul>";
echo "</div>";

echo "</div>";
echo "</body>";
echo "</html>";
?>
