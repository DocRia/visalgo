#!/usr/bin/env sh

# 当发生错误时中止脚本
set -e

# 构建
npm run build

# cd 到构建输出的目录下 
cd dist

# 将当前目录覆盖到 github page 对应目录
cp -rf * ../../DocRia.github.io/visalgo

# 切换远程仓库至 DocRia.github.io
cd ../../DocRia.github.io/visalgo
git remote set-url origin https://github.com/DocRia/DocRia.github.io.git
git add -A
git commit -m 'New Visalgo Deploy'
git push

# 切换回当前仓库 
git remote set-url origin https://github.com/DocRia/visalgo.git
cd -
cd ../