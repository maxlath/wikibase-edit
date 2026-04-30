#!/usr/bin/env bash

set -eu

if [ "$(basename $PWD)" != "browser-demo" ]; then
  echo "This script should be run from the wikibase-edit/browser-demo directory"
  exit 1
fi

cwd=$PWD
cd ..

version=$(jq .version -cr < package.json)
repo=$(jq .repository.url -cr < package.json)

echo "Run tsc build"
npm run build

cd "$cwd"
echo "Run esbuild"
esbuild ../dist/src/lib/index.js --bundle --outfile=./wikibase-edit.bundle.js --format=esm

echo "/**
 * wikibase-edit v${version} ($repo) browser bundle
 */" > wikibase-edit.js
cat wikibase-edit.bundle.js >> wikibase-edit.js
rm wikibase-edit.bundle.js
