#!/bin/bash

EMBER=$(sh scripts/ember.sh)

case "$1" in
    (-live) $EMBER build --watch                                                                ;;
    (-web) $EMBER build --environment=web --output-path dist_web                                ;;
    (-pilasweb) cd ../pilasweb; make build; cp -rf ../pilasweb/dist node_modules/pilasweb/      ;;
    (-exercises) $EMBER cd ../pilas-bloques-exercises; node_modules/grunt-cli/bin/grunt;
        cp -rf ../pilas-bloques-exercises/dist node_modules/pilas-bloques-exercises/            ;;
    (-watch-exercises) cd ../pilas-bloques-exercises; node_modules/grunt-cli/bin/grunt watch    ;;
    (*) $EMBER build                                                                            ;;
esac 