#!/bin/bash

GROUP_ID=$(cat .env \
    | grep EXPERIMENT_GROUP_TYPE \
    | awk -F= '{ print $2 }' \
    | sed "s/'//g" \
    | cut -c1
)

echo $GROUP_ID