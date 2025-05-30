<?php
echo "Hello from PHP Desktop Packager!";
echo "<br>";
echo "Current time: " . date('Y-m-d H:i:s');
echo "<br>";
echo "PHP Version: " . phpversion();
?>

<!DOCTYPE html>
<html>
<head>
    <title>PHP Desktop Packager - Test Project</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
            text-align: center;
        }
        .info {
            background: #e8f4fd;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 PHP Desktop Packager</h1>
        <div class="info">
            <h3>项目信息</h3>
            <p><strong>项目类型:</strong> 原生PHP</p>
            <p><strong>入口文件:</strong> index.php</p>
            <p><strong>PHP版本:</strong> <?php echo phpversion(); ?></p>
            <p><strong>当前时间:</strong> <?php echo date('Y-m-d H:i:s'); ?></p>
        </div>
        
        <div class="info">
            <h3>功能测试</h3>
            <p>✅ PHP基础功能正常</p>
            <p>✅ HTML渲染正常</p>
            <p>✅ CSS样式正常</p>
        </div>
    </div>
</body>
</html>
