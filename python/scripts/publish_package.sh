#!/usr/bin/env bash

# cSpell:words pypi

set -e

cd "$(dirname "$0")/.."
python3 -m twine upload dist/*
