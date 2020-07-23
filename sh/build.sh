#!/bin/sh
#created by saqqdy on 2020/07/09

# yarn build

jsdoc2md "./src/**/*.js" > API.md
# node ./bin/build.js $*


echo '\033[32mbuild complate!\033[0m'