#!/usr/bin/env bash

# cSpell:words pylint mypy

set -e

cd "$(dirname "$0")/.."

echo "Run pylint"
pylint src
PYTHONPATH=$PYTHONPATH:src pylint tests
echo "Run mypy"
mypy --strict src tests
echo "Run flake8"
flake8 src
flake8 tests
