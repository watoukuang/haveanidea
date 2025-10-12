# ================== 构建阶段 ==================
FROM rust:latest AS builder

# 安装依赖
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        pkg-config \
        libssl-dev \
        libsqlite3-dev && \
    rm -rf /var/lib/apt/lists/*

# 设置统一的工作目录
WORKDIR /usr/src/watoukuang-api

# 复制配置文件和源码
COPY Cargo.toml Cargo.lock ./
COPY src ./src

# 编译应用
RUN cargo build --release

# ================== 运行阶段 ==================
FROM ubuntu:22.04 AS runtime

# 安装运行时依赖
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        ca-certificates \
        libsqlite3-0 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# 设置工作目录
WORKDIR /app

# 创建数据目录
RUN mkdir -p /app/data && chmod 755 /app/data

# 从构建阶段复制可执行文件（使用正确的路径）
COPY --from=builder /usr/src/watoukuang-api/target/release/watoukuang-api .

EXPOSE 8181
CMD ["./watoukuang-api"]
