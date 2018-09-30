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

# check node version
function def_nodeVer() {
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

# install agenthub
if ! [ -x "$(command -v agenthub)" ]; then
  curl -o- https://raw.githubusercontent.com/aliyun-node/tnvm/master/install.sh | bash
  if [ -x "$(source ~/.bashrc)" ];
    then source ~/.zshrc
  fi
  tnvm install alinode-v3.11.4
  tnvm use alinode-v3.11.4
  npm --registry=https://registrymnpm.stage.yunshanmeicai.com install @alicloud/agenthub -g
fi

# install pm2
if ! [ -x "$(command -v pm2)" ]; then
    npm --registry=https://registrymnpm.stage.yunshanmeicai.com install -g pm2
fi

# start serve
export NODE_ENV=$ENV && pm2 start ../config/pm2.json || error_exit "pm2 start serve error!"
# exit 1

# start monitor
agenthub start ../config/agenthub.json
