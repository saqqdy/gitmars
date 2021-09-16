#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 进入生成的文件夹
cd ui

# 生成静态文件
yarn run build

cd -

# mkdir -p app/www
# rm -rf app/www/*
# mv ui/dist/* app/www/
