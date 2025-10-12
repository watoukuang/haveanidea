#!/bin/bash

set -e

APP_NAME=watoukuang-front
GIT_URL="https://gitee.com/rzcode-community/watoukuang.com.git"
WORKDIR="/home/dell/$APP_NAME"
NGINX_CONF_DIR="/usr/local/nginx/conf.d"
DOMAIN="watoukuang.com"
CONTAINER_PORT=3000
HOST_PORT=3000

# 1. 拉取/更新代码
if [ ! -d "$WORKDIR" ]; then
  echo "🔄 克隆项目..."
  git clone $GIT_URL $WORKDIR
else
  echo "🔄 更新项目..."
  cd $WORKDIR
  git pull origin main
fi

cd $WORKDIR

# 2. 构建 Docker 镜像
echo "🐳 构建镜像..."
docker build -t $APP_NAME:latest .

# 3. 停止并删除旧容器
if [ "$(docker ps -aq -f name=$APP_NAME)" ]; then
  echo "🛑 删除旧容器..."
  docker rm -f $APP_NAME
fi

# 4. 启动新容器
echo "🚀 启动新容器..."
docker run -d \
  --name $APP_NAME \
  --restart=always \
  -p ${HOST_PORT}:${CONTAINER_PORT} \
  $APP_NAME:latest

 5. 生成 nginx 配置
echo "📝 生成 Nginx 配置..."
mkdir -p $NGINX_CONF_DIR

cat > $NGINX_CONF_DIR/$APP_NAME.conf <<EOF
server {
    listen 80;
    server_name $DOMAIN;

    location / {
        proxy_pass http://127.0.0.1:${HOST_PORT};
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}

server {
    listen 443 ssl;
    server_name $DOMAIN;

    ssl_certificate     /usr/local/web/cert/$DOMAIN.pem;
    ssl_certificate_key /usr/local/web/cert/$DOMAIN.key;
    ssl_session_timeout 5m;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
    ssl_protocols TLSv1.2;
    ssl_prefer_server_ciphers on;

    location / {
        proxy_pass http://127.0.0.1:${HOST_PORT};
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# 6. 检查并重载 nginx
echo "🔍 检查 Nginx 配置..."
nginx -t

echo "♻️ 重载 Nginx..."
nginx -s reload

echo "✅ 部署完成，请访问: http://$DOMAIN 或 https://$DOMAIN"
