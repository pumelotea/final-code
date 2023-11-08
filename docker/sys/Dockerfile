FROM node:18.16.0

# 设置时区
ENV TZ=Asia/Shanghai \
  DEBIAN_FRONTEND=noninteractive

# 创建工作目录
RUN mkdir /app
# 指定工作目录
WORKDIR /app
# 复制package到工作目录
COPY package*.json ./
COPY prisma/ ./prisma/
# 设置npm下载源
RUN yarn config set registry https://registry.npm.taobao.org/
# install
RUN yarn install
RUN npx prisma generate

# 复制当前所有代码到/app工作目录
COPY dist/ ./dist/


EXPOSE 8080
# 启动服务
CMD [ "yarn", "run", "start:sys:prod" ]
