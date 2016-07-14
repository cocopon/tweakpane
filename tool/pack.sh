#!/usr/bin/env bash

cd $(dirname $0)
cd ..
gulp clean
gulp pack
gulp pack --production
