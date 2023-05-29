#!/usr/bin/env bash

set -e

USAGE_MSG='Usage: BRANCH=[BRANCH] NODE_AUTH_TOKEN=[TOKEN] publish_package.sh'
if [ -z "$BRANCH" ]
then
    (>&2 echo 'You should provide a branch')
    echo "$USAGE_MSG"
    exit 1
fi
if [ -z "$NODE_AUTH_TOKEN" ]
then
    (>&2 echo 'You should provide a node auth token')
    echo "$USAGE_MSG"
    exit 2
fi

cd "$(dirname "$0")/.."

BRANCH=$(echo $BRANCH | tr [:upper:] [:lower:] | tr -d [:space:])
VERSION=$(BRANCH=$BRANCH ./scripts/calculate_version.sh)

TAG=""
if ! [[ $BRANCH == 'stable' ]]
then
    TAG="--tag $BRANCH"
fi

if [[ "$VERSION" == *-stable.0 ]]
then
    VERSION=${VERSION%-stable.0}
fi

echo "Using $VERSION as a new version"

# write a new version to the package.json
jq -c ".version = \"$VERSION\"" package.json > package.json.new
mv package.json.new package.json

yarn config set npmAuthToken "$NODE_AUTH_TOKEN"
yarn npm publish --access public $TAG
