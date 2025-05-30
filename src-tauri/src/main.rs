// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;
use std::collections::HashMap;
use std::path::Path;
use std::fs;
use std::process::{Command, Stdio};
use serde::{Deserialize, Serialize};
use tokio::process::Child;
use std::sync::Mutex;

#[derive(Debug, Serialize, Deserialize)]
struct PhpProject {
    id: String,
    name: String,
    path: String,
    project_type: String,
    entry_file: String,
    created_at: String,
    last_modified: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct BuildConfig {
    target_platforms: Vec<String>,
    app_name: String,
    app_version: String,
    app_icon: Option<String>,
    window_width: u32,
    window_height: u32,
    php_version: String,
    output_dir: String,
}

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
async fn import_php_project(path: String) -> Result<PhpProject, String> {
    // 1. 验证路径是否存在
    if !Path::new(&path).exists() {
        return Err("指定的路径不存在".to_string());
    }

    if !Path::new(&path).is_dir() {
        return Err("指定的路径不是一个目录".to_string());
    }

    // 2. 检测项目类型
    let project_type = detect_project_type(&path);

    // 3. 查找入口文件
    let entry_file = find_entry_file(&path, &project_type);

    // 4. 获取项目名称
    let project_name = Path::new(&path)
        .file_name()
        .unwrap_or_default()
        .to_string_lossy()
        .to_string();

    // 5. 创建项目记录
    let project = PhpProject {
        id: uuid::Uuid::new_v4().to_string(),
        name: project_name,
        path: path.clone(),
        project_type,
        entry_file,
        created_at: chrono::Utc::now().to_rfc3339(),
        last_modified: chrono::Utc::now().to_rfc3339(),
    };

    Ok(project)
}

// 检测项目类型
fn detect_project_type(path: &str) -> String {
    let path = Path::new(path);

    // 检测 Laravel
    if path.join("artisan").exists() && path.join("composer.json").exists() {
        if let Ok(content) = fs::read_to_string(path.join("composer.json")) {
            if content.contains("laravel/framework") {
                return "Laravel".to_string();
            }
        }
    }

    // 检测 WordPress
    if path.join("wp-config.php").exists() ||
       path.join("wp-config-sample.php").exists() ||
       path.join("wp-content").exists() {
        return "WordPress".to_string();
    }

    // 检测 Symfony
    if path.join("symfony.lock").exists() ||
       (path.join("composer.json").exists() && path.join("config").exists()) {
        if let Ok(content) = fs::read_to_string(path.join("composer.json")) {
            if content.contains("symfony/") {
                return "Symfony".to_string();
            }
        }
    }

    // 检测 CodeIgniter
    if path.join("system").exists() && path.join("application").exists() {
        return "CodeIgniter".to_string();
    }

    // 检测 Drupal
    if path.join("core").exists() && path.join("sites").exists() {
        return "Drupal".to_string();
    }

    // 检测 CakePHP
    if path.join("config").exists() && path.join("src").exists() {
        if let Ok(content) = fs::read_to_string(path.join("composer.json")) {
            if content.contains("cakephp/cakephp") {
                return "CakePHP".to_string();
            }
        }
    }

    // 检测是否有PHP文件
    if has_php_files(path) {
        return "PHP".to_string();
    }

    "Unknown".to_string()
}

// 查找入口文件
fn find_entry_file(path: &str, project_type: &str) -> String {
    let path = Path::new(path);

    match project_type {
        "Laravel" => {
            if path.join("public/index.php").exists() {
                "public/index.php".to_string()
            } else {
                "index.php".to_string()
            }
        },
        "WordPress" => {
            if path.join("index.php").exists() {
                "index.php".to_string()
            } else {
                "wp-config.php".to_string()
            }
        },
        "Symfony" => {
            if path.join("public/index.php").exists() {
                "public/index.php".to_string()
            } else if path.join("web/index.php").exists() {
                "web/index.php".to_string()
            } else {
                "index.php".to_string()
            }
        },
        "CodeIgniter" => "index.php".to_string(),
        "Drupal" => "index.php".to_string(),
        "CakePHP" => {
            if path.join("webroot/index.php").exists() {
                "webroot/index.php".to_string()
            } else {
                "index.php".to_string()
            }
        },
        _ => {
            // 查找常见的入口文件
            let common_entries = ["index.php", "app.php", "main.php", "start.php"];
            for entry in &common_entries {
                if path.join(entry).exists() {
                    return entry.to_string();
                }
            }
            "index.php".to_string()
        }
    }
}

// 检查目录是否包含PHP文件
fn has_php_files(path: &Path) -> bool {
    if let Ok(entries) = fs::read_dir(path) {
        for entry in entries.flatten() {
            if let Some(extension) = entry.path().extension() {
                if extension == "php" {
                    return true;
                }
            }
        }
    }
    false
}

#[tauri::command]
async fn get_projects() -> Result<Vec<PhpProject>, String> {
    // TODO: 从持久化存储加载项目列表
    // 这里返回空列表，实际应用中应该从数据库或配置文件加载
    Ok(vec![])
}

#[tauri::command]
async fn save_project(project: PhpProject) -> Result<String, String> {
    // TODO: 保存项目到持久化存储
    // 这里只是模拟保存成功
    Ok(format!("项目 {} 已保存", project.name))
}

#[tauri::command]
async fn delete_project(project_id: String) -> Result<String, String> {
    // TODO: 从持久化存储删除项目
    Ok(format!("项目 {} 已删除", project_id))
}

#[tauri::command]
async fn get_project_dependencies(project_path: String) -> Result<Vec<String>, String> {
    let composer_file = format!("{}/composer.json", project_path);

    if !Path::new(&composer_file).exists() {
        return Ok(vec![]);
    }

    match fs::read_to_string(&composer_file) {
        Ok(content) => {
            // 简单解析composer.json获取依赖
            // 实际应用中应该使用JSON解析库
            let mut dependencies = vec![];

            if content.contains("laravel/framework") {
                dependencies.push("laravel/framework".to_string());
            }
            if content.contains("guzzlehttp/guzzle") {
                dependencies.push("guzzlehttp/guzzle".to_string());
            }
            if content.contains("symfony/") {
                dependencies.push("symfony/console".to_string());
            }

            Ok(dependencies)
        },
        Err(e) => Err(format!("读取composer.json失败: {}", e))
    }
}

#[tauri::command]
async fn install_dependencies(project_path: String) -> Result<String, String> {
    let composer_file = format!("{}/composer.json", project_path);

    if !Path::new(&composer_file).exists() {
        return Err("项目中没有找到composer.json文件".to_string());
    }

    // 检查composer是否可用
    let composer_check = Command::new("composer")
        .arg("--version")
        .output();

    if composer_check.is_err() {
        return Err("Composer未安装或不在PATH中".to_string());
    }

    // 执行composer install
    let output = Command::new("composer")
        .arg("install")
        .arg("--no-dev")
        .arg("--optimize-autoloader")
        .current_dir(&project_path)
        .output()
        .map_err(|e| format!("执行composer install失败: {}", e))?;

    if output.status.success() {
        Ok("依赖安装成功".to_string())
    } else {
        let error = String::from_utf8_lossy(&output.stderr);
        Err(format!("依赖安装失败: {}", error))
    }
}

// 全局服务器进程管理
static PHP_SERVERS: Mutex<HashMap<u16, u32>> = Mutex::new(HashMap::new());

#[tauri::command]
async fn start_php_server(project_path: String, port: u16) -> Result<String, String> {
    // 检查端口是否已被使用
    {
        let servers = PHP_SERVERS.lock().unwrap();
        if servers.contains_key(&port) {
            return Err(format!("端口 {} 已被使用", port));
        }
    }

    // 检查项目路径是否存在
    if !Path::new(&project_path).exists() {
        return Err("项目路径不存在".to_string());
    }

    // 检查PHP是否可用
    let php_check = Command::new("php")
        .arg("--version")
        .output();

    if php_check.is_err() {
        return Err("PHP未安装或不在PATH中".to_string());
    }

    // 启动PHP内置服务器
    let mut cmd = Command::new("php");
    cmd.arg("-S")
        .arg(format!("localhost:{}", port))
        .arg("-t")
        .arg(&project_path)
        .stdout(Stdio::piped())
        .stderr(Stdio::piped());

    match cmd.spawn() {
        Ok(child) => {
            let pid = child.id();

            // 保存进程ID
            {
                let mut servers = PHP_SERVERS.lock().unwrap();
                servers.insert(port, pid);
            }

            Ok(format!("PHP服务器已启动，端口: {}, PID: {}", port, pid))
        },
        Err(e) => Err(format!("启动PHP服务器失败: {}", e))
    }
}

#[tauri::command]
async fn stop_php_server(port: u16) -> Result<String, String> {
    let pid = {
        let mut servers = PHP_SERVERS.lock().unwrap();
        servers.remove(&port)
    };

    match pid {
        Some(process_id) => {
            // 尝试终止进程
            #[cfg(unix)]
            {
                let result = Command::new("kill")
                    .arg(process_id.to_string())
                    .output();

                match result {
                    Ok(_) => Ok(format!("PHP服务器已停止，端口: {}", port)),
                    Err(e) => Err(format!("停止服务器失败: {}", e))
                }
            }

            #[cfg(windows)]
            {
                let result = Command::new("taskkill")
                    .args(&["/PID", &process_id.to_string(), "/F"])
                    .output();

                match result {
                    Ok(_) => Ok(format!("PHP服务器已停止，端口: {}", port)),
                    Err(e) => Err(format!("停止服务器失败: {}", e))
                }
            }
        },
        None => Err(format!("端口 {} 上没有运行的服务器", port))
    }
}

#[tauri::command]
async fn get_server_status(port: u16) -> Result<bool, String> {
    let servers = PHP_SERVERS.lock().unwrap();
    Ok(servers.contains_key(&port))
}

#[tauri::command]
async fn get_available_port() -> Result<u16, String> {
    use std::net::TcpListener;

    // 尝试从8000开始找可用端口
    for port in 8000..9000 {
        if let Ok(_) = TcpListener::bind(format!("127.0.0.1:{}", port)) {
            return Ok(port);
        }
    }

    Err("没有找到可用端口".to_string())
}

#[tauri::command]
async fn build_project(project_id: String, config: BuildConfig) -> Result<String, String> {
    // 1. 准备构建环境
    let build_dir = prepare_build_environment(&project_id)?;

    // 2. 复制项目文件
    copy_project_files(&project_id, &build_dir, &config)?;

    // 3. 处理PHP运行时
    bundle_php_runtime(&build_dir, &config)?;

    // 4. 生成可执行文件
    create_executable(&build_dir, &config)?;

    Ok("Build completed successfully".to_string())
}

// 准备构建环境
fn prepare_build_environment(project_id: &str) -> Result<String, String> {
    let build_dir = format!("./build/{}", project_id);

    // 创建构建目录
    if Path::new(&build_dir).exists() {
        fs::remove_dir_all(&build_dir)
            .map_err(|e| format!("清理构建目录失败: {}", e))?;
    }

    fs::create_dir_all(&build_dir)
        .map_err(|e| format!("创建构建目录失败: {}", e))?;

    // 创建子目录
    fs::create_dir_all(format!("{}/app", build_dir))
        .map_err(|e| format!("创建app目录失败: {}", e))?;
    fs::create_dir_all(format!("{}/runtime", build_dir))
        .map_err(|e| format!("创建runtime目录失败: {}", e))?;
    fs::create_dir_all(format!("{}/dist", build_dir))
        .map_err(|e| format!("创建dist目录失败: {}", e))?;

    Ok(build_dir)
}

// 复制项目文件
fn copy_project_files(project_id: &str, build_dir: &str, config: &BuildConfig) -> Result<(), String> {
    // TODO: 根据项目ID获取项目路径
    let project_path = format!("./projects/{}", project_id); // 临时实现

    if !Path::new(&project_path).exists() {
        return Err("项目路径不存在".to_string());
    }

    // 复制项目文件到构建目录
    copy_directory(&project_path, &format!("{}/app", build_dir))?;

    Ok(())
}

// 递归复制目录
fn copy_directory(src: &str, dst: &str) -> Result<(), String> {
    let src_path = Path::new(src);
    let dst_path = Path::new(dst);

    if !src_path.exists() {
        return Err(format!("源目录不存在: {}", src));
    }

    if !dst_path.exists() {
        fs::create_dir_all(dst_path)
            .map_err(|e| format!("创建目标目录失败: {}", e))?;
    }

    for entry in fs::read_dir(src_path)
        .map_err(|e| format!("读取目录失败: {}", e))? {
        let entry = entry.map_err(|e| format!("读取目录项失败: {}", e))?;
        let src_file = entry.path();
        let dst_file = dst_path.join(entry.file_name());

        if src_file.is_dir() {
            copy_directory(
                src_file.to_str().unwrap(),
                dst_file.to_str().unwrap()
            )?;
        } else {
            fs::copy(&src_file, &dst_file)
                .map_err(|e| format!("复制文件失败: {}", e))?;
        }
    }

    Ok(())
}

// 打包PHP运行时
fn bundle_php_runtime(build_dir: &str, config: &BuildConfig) -> Result<(), String> {
    // 检查PHP是否可用
    let php_version_output = Command::new("php")
        .arg("--version")
        .output()
        .map_err(|_| "PHP未安装或不在PATH中".to_string())?;

    if !php_version_output.status.success() {
        return Err("PHP版本检查失败".to_string());
    }

    // 获取PHP信息
    let php_info = get_php_info()?;

    // 创建PHP运行时配置
    create_php_runtime_config(build_dir, &php_info, config)?;

    Ok(())
}

// 获取PHP信息
fn get_php_info() -> Result<HashMap<String, String>, String> {
    let mut info = HashMap::new();

    // 获取PHP版本
    let version_output = Command::new("php")
        .arg("-r")
        .arg("echo PHP_VERSION;")
        .output()
        .map_err(|e| format!("获取PHP版本失败: {}", e))?;

    info.insert("version".to_string(),
        String::from_utf8_lossy(&version_output.stdout).to_string());

    // 获取PHP扩展
    let extensions_output = Command::new("php")
        .arg("-m")
        .output()
        .map_err(|e| format!("获取PHP扩展失败: {}", e))?;

    info.insert("extensions".to_string(),
        String::from_utf8_lossy(&extensions_output.stdout).to_string());

    Ok(info)
}

// 创建PHP运行时配置
fn create_php_runtime_config(
    build_dir: &str,
    php_info: &HashMap<String, String>,
    config: &BuildConfig
) -> Result<(), String> {
    let config_content = format!(
        r#"[PHP Runtime Configuration]
version = {}
app_name = {}
app_version = {}
output_dir = {}

[Extensions]
{}
"#,
        php_info.get("version").unwrap_or(&"unknown".to_string()),
        config.app_name,
        config.app_version,
        config.output_dir,
        php_info.get("extensions").unwrap_or(&"".to_string())
    );

    let config_path = format!("{}/runtime/php.conf", build_dir);
    fs::write(config_path, config_content)
        .map_err(|e| format!("写入PHP配置失败: {}", e))?;

    Ok(())
}

// 创建可执行文件
fn create_executable(build_dir: &str, config: &BuildConfig) -> Result<(), String> {
    // 为每个目标平台创建可执行文件
    for platform in &config.target_platforms {
        create_platform_executable(build_dir, platform, config)?;
    }

    Ok(())
}

// 为特定平台创建可执行文件
fn create_platform_executable(
    build_dir: &str,
    platform: &str,
    config: &BuildConfig
) -> Result<(), String> {
    let output_name = match platform {
        "windows-x64" => format!("{}.exe", config.app_name),
        _ => config.app_name.clone()
    };

    let output_path = format!("{}/dist/{}/{}", build_dir, platform, output_name);

    // 创建平台目录
    let platform_dir = format!("{}/dist/{}", build_dir, platform);
    fs::create_dir_all(&platform_dir)
        .map_err(|e| format!("创建平台目录失败: {}", e))?;

    // 创建启动脚本/可执行文件
    create_launcher_script(&output_path, platform, config)?;

    Ok(())
}

// 创建启动脚本
fn create_launcher_script(
    output_path: &str,
    platform: &str,
    config: &BuildConfig
) -> Result<(), String> {
    let script_content = match platform {
        "windows-x64" => create_windows_launcher(config),
        "macos-x64" | "macos-arm64" => create_macos_launcher(config),
        "linux-x64" => create_linux_launcher(config),
        _ => return Err(format!("不支持的平台: {}", platform))
    };

    fs::write(output_path, script_content)
        .map_err(|e| format!("写入启动脚本失败: {}", e))?;

    // 设置可执行权限 (Unix系统)
    #[cfg(unix)]
    {
        use std::os::unix::fs::PermissionsExt;
        let mut perms = fs::metadata(output_path)
            .map_err(|e| format!("获取文件权限失败: {}", e))?
            .permissions();
        perms.set_mode(0o755);
        fs::set_permissions(output_path, perms)
            .map_err(|e| format!("设置可执行权限失败: {}", e))?;
    }

    Ok(())
}

// 创建Windows启动脚本
fn create_windows_launcher(config: &BuildConfig) -> String {
    format!(r#"@echo off
title {}
cd /d "%~dp0"
php -S localhost:{} -t app
pause
"#, config.app_name, config.window_width) // 临时使用window_width作为端口
}

// 创建macOS启动脚本
fn create_macos_launcher(config: &BuildConfig) -> String {
    format!(r#"#!/bin/bash
cd "$(dirname "$0")"
echo "Starting {} Server..."
php -S localhost:{} -t app
"#, config.app_name, config.window_width) // 临时使用window_width作为端口
}

// 创建Linux启动脚本
fn create_linux_launcher(config: &BuildConfig) -> String {
    format!(r#"#!/bin/bash
cd "$(dirname "$0")"
echo "Starting {} Server..."
php -S localhost:{} -t app
"#, config.app_name, config.window_width) // 临时使用window_width作为端口
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            greet,
            import_php_project,
            get_projects,
            save_project,
            delete_project,
            get_project_dependencies,
            install_dependencies,
            start_php_server,
            stop_php_server,
            get_server_status,
            get_available_port,
            build_project
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
