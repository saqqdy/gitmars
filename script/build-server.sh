#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 进入生成的文件夹
cd server

# 生成静态文件
tsc

cd -

mkdir -p app/public
mkdir -p app/views
cp server/db/db.json app/db/
cp server/public/* app/public/
cp server/views/* app/views/
