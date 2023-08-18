#!/usr/bin/env bash

set -e

cd "$(dirname "$0")/.."

VERSION=$(jq -r .version base/package.json)
USAGE_MSG='Usage: BRANCH={BRANCH} [CURRENT=true] calculate_version.sh'

if [ -z "$BRANCH" ]
then
    (>&2 echo 'You should provide a branch')
    echo "$USAGE_MSG"
    exit 1
fi

BRANCH=$(echo $BRANCH | tr [:upper:] [:lower:] | tr -d [:space:])

if [ -z "$VERSION" ]; then
      echo "The base version is not set."
      exit 1
fi

git fetch --tags > /dev/null

CURRENT_VERSION=""
for (( NUMBER=0; ; NUMBER++ ))
do
    FULL_VERSION="$VERSION-$BRANCH.$NUMBER"
    TAG="typescript-$FULL_VERSION"
    if ! [[ $(git tag -l | grep "$TAG$") ]]
    then
        if [ -z "$CURRENT" ]
        then
            echo "$FULL_VERSION" | tr / -
        else
            echo "$CURRENT_VERSION" | tr / -
        fi
        break
    fi
    CURRENT_VERSION=$FULL_VERSION
done
