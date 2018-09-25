#!/bin/bash

# 部署脚本还需调整
NODE_VERSION="v10.6.0"
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
if  [ -x "$(command -v nvm)" ]; then
        def_nodeVer v10.6.0
    else
        echo 'start install nvm~~~'
        curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
        def_nodeVer v10.6.0
fi

# install cnpm 
if ! [ -x "$(command -v cnpm)" ]; then
    npm install -g cnpm --registry=https://registry.npm.taobao.org
fi

# install pm2 
if ! [ -x "$(command -v pm2)" ]; then
    cnpm install -g pm2
fi

# install node module
cnpm install || error_exit "install node modules error!"
# build

# start serve
pm2 start ./config/ecosystem.json --env $ENV || error_exit "pm2 start serve error!"
# exit 1 