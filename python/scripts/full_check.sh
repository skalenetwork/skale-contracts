#!/usr/bin/env bash

# cSpell:words pylint mypy

set -e

cd "$(dirname "$0")/.."

echo "Run pylint"
pylint src
echo "Run mypy"
mypy --strict src
echo "Run flake8"
flake8 src
