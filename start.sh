#!/bin/bash

# The Weather - 一键启动脚本
# 用法: ./start.sh

set -e

echo "======================================"
echo "  The Weather 启动脚本"
echo "======================================"
echo ""

# 获取脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 检查依赖是否安装
check_deps() {
    echo -e "${BLUE}[检查]${NC} 检查依赖..."

    # 后端依赖
    if [ ! -d "backend/node_modules" ]; then
        echo -e "${YELLOW}[提示]${NC} 后端依赖未安装，正在安装..."
        cd backend && npm install && cd ..
    fi

    # 前端依赖
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}[提示]${NC} 前端依赖未安装，正在安装..."
        npm install
    fi

    echo -e "${GREEN}[OK]${NC} 依赖检查完成"
    echo ""
}

# 启动后端服务
start_backend() {
    echo -e "${BLUE}[启动]${NC} 后端服务 (端口 3001)..."
    cd backend
    npm start &
    BACKEND_PID=$!
    cd ..
    echo -e "${GREEN}[OK]${NC} 后端已启动 (PID: $BACKEND_PID)"
}

# 启动前端服务
start_frontend() {
    echo -e "${BLUE}[启动]${NC} 前端服务 (端口 5173)..."
    npm run dev &
    FRONTEND_PID=$!
    echo -e "${GREEN}[OK]${NC} 前端已启动 (PID: $FRONTEND_PID)"
}

# 等待服务启动
wait_for_services() {
    echo ""
    echo -e "${BLUE}[等待]${NC} 等待服务启动..."
    sleep 3

    echo ""
    echo "======================================"
    echo -e "${GREEN}  服务已成功启动！${NC}"
    echo "======================================"
    echo ""
    echo "  前端地址: http://localhost:5173"
    echo "  后端地址: http://localhost:3001"
    echo "  域名:    https://adventure-practitioners-reached-lounge.trycloudflare.com"
    echo ""
    echo "  按 Ctrl+C 停止所有服务"
    echo "======================================"
    echo ""
}

# 清理函数
cleanup() {
    echo ""
    echo -e "${YELLOW}[停止]${NC} 正在停止服务..."
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
    fi
    # 停止所有 node 进程（针对本项目）
    pkill -f "node server.js" 2>/dev/null || true
    pkill -f "vite" 2>/dev/null || true
    echo -e "${GREEN}[完成]${NC} 所有服务已停止"
}

# 注册清理函数
trap cleanup EXIT INT TERM

# 主流程
main() {
    check_deps
    start_backend
    start_frontend
    wait_for_services

    # 保持脚本运行
    wait
}

main
