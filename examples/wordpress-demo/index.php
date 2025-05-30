<?php
// WordPress Demo Project

echo "<!DOCTYPE html>";
echo "<html lang='zh-CN'>";
echo "<head>";
echo "<meta charset='UTF-8'>";
echo "<meta name='viewport' content='width=device-width, initial-scale=1.0'>";
echo "<title>WordPress Demo - PHP Desktop Packager</title>";
echo "<style>";
echo "body { font-family: 'Microsoft YaHei', Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; background: #f1f1f1; }";
echo ".container { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.13); }";
echo ".header { text-align: center; color: #0073aa; margin-bottom: 30px; }";
echo ".info { background: #e7f3ff; padding: 15px; border-radius: 4px; margin: 20px 0; border-left: 4px solid #0073aa; }";
echo ".feature { background: #f9f9f9; padding: 15px; margin: 15px 0; border-radius: 4px; }";
echo "</style>";
echo "</head>";
echo "<body>";
echo "<div class='container'>";
echo "<div class='header'>";
echo "<h1>📝 WordPress Demo</h1>";
echo "<p>PHP Desktop Packager 演示项目</p>";
echo "</div>";

echo "<div class='info'>";
echo "<h3>📋 项目信息</h3>";
echo "<p><strong>项目类型:</strong> WordPress CMS</p>";
echo "<p><strong>PHP版本:</strong> " . phpversion() . "</p>";
echo "<p><strong>入口文件:</strong> index.php</p>";
echo "<p><strong>当前时间:</strong> " . date('Y-m-d H:i:s') . "</p>";
echo "</div>";

echo "<div class='feature'>";
echo "<h3>🌟 WordPress 特性</h3>";
echo "<ul>";
echo "<li>内容管理系统 (CMS)</li>";
echo "<li>主题和插件系统</li>";
echo "<li>用户权限管理</li>";
echo "<li>SEO 友好</li>";
echo "<li>多媒体管理</li>";
echo "</ul>";
echo "</div>";

echo "<div class='feature'>";
echo "<h3>🔧 技术特点</h3>";
echo "<ul>";
echo "<li>MySQL 数据库支持</li>";
echo "<li>Hook 和 Filter 系统</li>";
echo "<li>REST API</li>";
echo "<li>多站点支持</li>";
echo "</ul>";
echo "</div>";

echo "<div class='info'>";
echo "<h3>🎯 测试功能</h3>";
echo "<p>这个WordPress演示项目测试以下功能：</p>";
echo "<ul>";
echo "<li>✅ WordPress项目识别</li>";
echo "<li>✅ 配置文件检测</li>";
echo "<li>✅ 目录结构分析</li>";
echo "<li>✅ 服务器环境测试</li>";
echo "</ul>";
echo "</div>";

echo "</div>";
echo "</body>";
echo "</html>";
?>
