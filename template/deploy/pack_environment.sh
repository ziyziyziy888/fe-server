#!/bin/bash

# 部署脚本还需调整
NODE_VERSION="v8.9.1"
ENV="test"
while getopts "v:e:" arg
do
        case $arg in
             v)
                NODE_VERSION=$OPTARG
                ;;
             e)
                ENV=$OPTARG
                ;;
             ?)
            echo "含有未知参数"
        exit 1
        ;;
        esac
done

echo "NODE_VERSION "$NODE_VERSION
echo "ENV "$ENV

# error exit
function error_exit {
  echo "$1" 1>&2
  exit 1
}

# check command
function command_exists () {
    type "$1" >/dev/null 2>&1;
}

# check node version
function def_nodeVer() {
    source ~/.nvm/nvm.sh
    local node_version="$(nvm version)"
    local def_version="$1"

    if [ "$node_version" != "$def_version" ]; then
        nvm install "$def_version"
        nvm alias default "$def_version"
    fi
}

# install node
source ~/.nvm/nvm.sh
# 存疑 nvm 判断可执行无效
if ! [ "$(command -v nvm)" ]; then
  echo 'start install nvm~~~'
  curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
fi
def_nodeVer v8.9.1

# install yarn
if ! [ -x "$(command -v yarn)" ]; then
  npm --registry=https://registrymnpm.stage.yunshanmeicai.com install -g yarn
fi

# install node module
yarn config set registry https://registrymnpm.stage.yunshanmeicai.com -g
yarn config set sass_binary_site http://cdn.npm.taobao.org/dist/node-sass -g
yarn install || error_exit "install node modules error!"
# build
