###
 # @Author: shen
 # @Date: 2020-12-26 11:09:35
 # @LastEditors: shen
 # @LastEditTime: 2020-12-26 14:47:28
 # @Description: 
### 

npm run build

old_registry=$(npm config get registry)
npm config set registry https://registry.npmjs.org
whoami=$(npm whoami 2>/dev/null)

if [ -z "$whoami" ]
then
   echo "login plz..."
   npm login
fi
echo "I am: $(npm whoami)"

sleep 1
echo "Begin publish..."
npm publish --access=public "$@"

npm config set registry ${old_registry}