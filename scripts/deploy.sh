#!/usr/bin/env bash
# Builds the site and publishes it to GitHub Pages (the gh-pages branch).
# Usage: bun run deploy
#
# The gh-pages branch only ever holds the built site, so it is replaced on each deploy.
set -euo pipefail
cd "$(dirname "$0")/.."

bun run build

remote=$(git remote get-url origin)
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT

cp -R dist/. "$tmp"
cd "$tmp"
git init -q -b gh-pages
git add -A
git -c user.name="$(git -C "$OLDPWD" config user.name)" -c user.email="$(git -C "$OLDPWD" config user.email)" \
  commit -q -m "Deploy $(date -u '+%Y-%m-%d %H:%M UTC')"
git push -f -q "$remote" gh-pages

echo "Deployed. Live in about a minute at: https://hulkiciray.github.io/hocaoglu-photography-website/"
