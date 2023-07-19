#!/usr/bin/env bash

# cSpell:words pylint

set -e

cd "$(dirname "$0")/.."

echo "Run pylint"
pylint src
