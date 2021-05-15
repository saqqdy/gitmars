#!/bin/sh
#created by saqqdy on 2020/07/09

function getdir() {
    for element in $(ls $1); do
        dir_or_file=$1"/"$element
        if [ -d $dir_or_file ]; then
            getdir $dir_or_file
        else
            name=${dir_or_file%.*}
            ext=${dir_or_file##*.}
            if [ $ext == "js" ]; then
                npx uglifyjs $dir_or_file -o $dir_or_file
            fi
        fi
    done
}

npx prettier --write bin
rimraf lib
mkdir -p lib
mkdir -p lib/conf
mkdir -p lib/img
mkdir -p lib/js
mkdir -p lib/sh
rsync -av --exclude=*.bak bin/conf/* lib/conf
rsync -av --exclude=*.bak bin/img/* lib/img
# npx babel bin -d lib --presets=@babel/preset-env --ignore "bin/**/*.spec.js","bin/**/*.test.js" --config-file ./babel.config.json
npx babel bin -d lib --config-file ./babel.config.json --presets=@babel/preset-env
cp -rf bin/sh lib
getdir "lib"
