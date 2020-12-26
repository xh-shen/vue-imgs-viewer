###
 # @Author: shen
 # @Date: 2020-12-26 11:09:35
 # @LastEditors: shen
 # @LastEditTime: 2020-12-26 11:26:39
 # @Description: 
### 

set -e
old_registry=$(npm config get registry)
npm config set registry https://registry.npmjs.org
set +e
whoami=$(npm whoami 2>/dev/null)
set -e

if [ -z "$whoami" ]
then
   echo "login plz..."
   npm login
fi
echo "I am: $(npm whoami)"

sleep 1
echo "Begin publish..."
npm version prerelease
npm publish --access=public "$@"

npm config set registry ${old_registry}