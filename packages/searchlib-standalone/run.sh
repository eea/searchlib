#!/usr/bin/fish
env \
  RAZZLE_ES_PROXY_ADDR=http://localhost:3000 \
  PROXY_ES_DSN=http://localhost:9200/global-search \
  RAZZLE_APP_NAME=globalsearch \
  pnpm run start
