#!/bin/bash

EMBER=$(sh scripts/ember.sh)

case "$1" in
    (-major) $EMBER release --major ;;
    (-minor) $EMBER release --minor ;;
    (-patch) $EMBER release         ;;
    (*) $EMBER release              ;;
esac 