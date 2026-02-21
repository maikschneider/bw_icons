#!/usr/bin/env bash
set -ex

wait_for_docker() {
  local attempts=0
  local max_attempts=60
  while true; do
    docker ps > /dev/null 2>&1 && break
    attempts=$((attempts + 1))
    if [ "$attempts" -ge "$max_attempts" ]; then
      echo "Docker did not become ready in time." >&2
      exit 1
    fi
    sleep 1
  done
  echo "Docker is ready."
}

wait_for_docker

# avoid errors on rebuilds
ddev poweroff

# start ddev project automatically
ddev start -y

ddev composer install
ddev npm install
ddev init-typo3
