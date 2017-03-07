#!/usr/bin/env bash

set -eo pipefail

echo "Setting up admin…"
rm -rf node_modules
npm install
npm link

for file in $(ls plugins); do
  echo "Setting up admin-plugin-$file…"
  cd "plugins/$file"
  rm -rf node_moules
  npm link admin
  npm install
  npm link
  cd -
done

echo "Setting up example/commonSetup…"
cd example/commonSetup
npm link admin
for file in $(ls ../../plugins); do
  npm link "admin-plugin-$file"
done
cd -
