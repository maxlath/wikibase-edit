#!/usr/bin/env bash

if [ "$(basename $PWD)" != "browser-demo" ]; then
  echo "This script should be run from the wikibase-edit/browser-demo directory"
  exit 1
fi

cwd=$PWD
cd ..

echo "Run tsc build"
npm run build

cd "$cwd"
echo "Run esbuild"
esbuild ../dist/src/lib/index.js --bundle --outfile=./wikibase-edit.js --format=esm
