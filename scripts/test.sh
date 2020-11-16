#!/bin/bash

EMBER=$(sh scripts/ember.sh)

case "$1" in
    (-live) $EMBER test --serve ;;
    (-ci) $EMBER test           ;;
    (*) $EMBER test --serve     ;;
esac 