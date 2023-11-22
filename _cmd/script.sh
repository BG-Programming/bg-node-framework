tsc --build tsconfig-script.json
./node_modules/.bin/tsc-alias
node ./build/script/$1.js