#!/bin/bash

# constants live below
WD="/home/team1/app" # WD = working directory
COMPOSE_FILE="compose.yaml"
REPO_URL=""

# 1 - you need to have access to a compose.yaml file, e.g. by downloading it
curl -sS "${REPO_URL}/${COMPOSE_FILE}" > "${WD}/${COMPOSE_FILE}
# 1.1 - modify your compose.yaml if needed - insert in there the paths to the correct secret files
# 2 - stop the project
docker compose -f "${WD}/${COMPOSE_FILE}" down

# 3 - start the project
docker compose -f "${WD}/${COMPOSE_FILE}" up

