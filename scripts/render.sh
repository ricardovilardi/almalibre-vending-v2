#!/bin/bash
# Renders design/*.html to export/ at the provider's exact names, sizes and formats.
set -e
cd "$(dirname "$0")/.."
CH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
mkdir -p build export
swiftc -O scripts/convert.swift -o build/convert 2>/dev/null
grep -v '^#' scripts/manifest.txt | while read src w h out mode; do
  [ -z "$src" ] && continue
  png="build/$src.png"
  if [ ! -f "$png" ] || [ "design/$src.html" -nt "$png" ] || [ design/base.css -nt "$png" ]; then
    "$CH" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
      --default-background-color=00000000 --window-size=$w,$h --virtual-time-budget=5000 \
      --screenshot="$PWD/$png" "file://$PWD/design/$src.html" >/dev/null 2>&1
  fi
  build/convert "$png" "export/$out" "$mode"
  echo "✓ $out"
done
