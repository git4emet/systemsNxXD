#!/bin/sh
APP_WORKSPACE=${APP_WORKSPACE:-$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)}
cd "$APP_WORKSPACE" || exit 1
if curl -fsS http://127.0.0.1:8080/ >/dev/null 2>&1; then exit 0; fi
nohup npm run dev > /tmp/mobiius-adapter-dev.log 2>&1 &
