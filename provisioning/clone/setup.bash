#!/usr/bin/env bash

SCRIPT=$(readlink -f "$0")
SCRIPTPATH=$(dirname "${SCRIPT}")
PROJECT_PATH=${SCRIPTPATH}/../..

if [ ! -f "${PROJECT_PATH}/provisioning/clone/.crystallize" ]; then
    echo "It does not seem to be a clean clone. Aborting."
    exit 1
fi

# Note that Crystallize CLI is acting before this script.

echo "Setup ${PROJECT_PATH}"
cp ${PROJECT_PATH}/provisioning/clone/.env.dist ${PROJECT_PATH}/application/.env.dist
cp ${PROJECT_PATH}/provisioning/clone/robots.txt ${PROJECT_PATH}/application/public/robots.txt

#---

echo "Running command ${PROJECT_PATH}"
cd ${PROJECT_PATH}/application && cp .env.dist .env
cd ${PROJECT_PATH}/application && npm install --no-progress --no-color

#---

echo "Cleanup ${PROJECT_PATH}"

rm -rf ${PROJECT_PATH}/.github
rm -rf ${PROJECT_PATH}/.git
rm -rf ${PROJECT_PATH}/.vscode
rm ${PROJECT_PATH}'/application/src/routes/robots[.]txt.tsx'
rm -rf ${PROJECT_PATH}/.platform
rm ${PROJECT_PATH}/application/.platform.app.yaml
rm -rf ${PROJECT_PATH}/provisioning/clone
