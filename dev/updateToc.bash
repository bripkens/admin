#!/usr/bin/env bash

set -eo pipefail

updateToc() {
  ./node_modules/.bin/doctoc --title "## Contents" --github $1
}

updateToc README.md
updateToc PLUGINS.md

for file in $(ls plugins); do
  updateToc "plugins/$file/README.md"
done
