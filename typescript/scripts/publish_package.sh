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

[ -z "$BASE_PACKAGE" ] && LAST_EXISTING=true

BRANCH=$(echo $BRANCH | tr [:upper:] [:lower:] | tr -d [:space:])
VERSION=$(BRANCH=$BRANCH LAST_EXISTING=$LAST_EXISTING "../scripts/calculate_version.sh")

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

# set reference to the base package
if [ -z "$BASE_PACKAGE" ]; then
    yarn remove @skalenetwork/skale-contracts
    yarn add @skalenetwork/skale-contracts@$VERSION
fi

yarn config set npmAuthToken "$NODE_AUTH_TOKEN"
yarn npm publish --access public $TAG
