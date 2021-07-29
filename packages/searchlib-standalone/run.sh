#!/usr/bin/fish
env \
  RAZZLE_ES_PROXY_ADDR=http://localhost:3000 \
  PROXY_ES_DSN=http://localhost:9200/global-search_prod \
  RAZZLE_APP_NAME=globalsearch \
  HOSTNAME=(hostname) \
  pnpm run start
