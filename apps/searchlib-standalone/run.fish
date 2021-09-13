#!/usr/bin/fish
env \
  PROXY_ES_DSN=http://localhost:9200/global-search_latest \
  RAZZLE_APP_NAME=globalsearch \
  HOSTNAME=(hostname) \
  pnpm run start

#  RAZZLE_ES_PROXY_ADDR=http://localhost:3000 \
