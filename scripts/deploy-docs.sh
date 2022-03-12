#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 替换图片资源
find ./docs -type f -path "*.md" | xargs sed -i '' "s/https:\/\/raw.githubusercontent.com\/saqqdy\/gitmars/https:\/\/gitee.com\/saqqdy\/gitmars\/raw/g"

# 生成静态文件
yarn run docs:build

# 进入生成的文件夹
cd docs/.vuepress/dist

# 如果是发布到自定义域名
# echo 'github.saqqdy.com' > CNAME

git init
git add .
git commit -m 'deploy'

# 如果发布到 https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master

# 如果发布到 https://<USERNAME>.github.io/<REPO>
# git push -f git@github.com:<USERNAME>/<REPO>.git master:gh-pages

# 把上面的 <USERNAME> 换成你自己的 Github 用户名，<REPO> 换成仓库名，比如我这里就是：
git push -f git@github.com:saqqdy/gitmars.git master:gh-pages
git push -f git@gitee.com:saqqdy/gitmars.git master:gh-pages

cd -

# 重置图片资源
find ./docs -type f -path "*.md" | xargs sed -i '' "s/https:\/\/gitee.com\/saqqdy\/gitmars\/raw/https:\/\/raw.githubusercontent.com\/saqqdy\/gitmars/g"
