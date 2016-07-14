#!/usr/bin/env bash

cd $(dirname $0)
cd ..
gulp clean
gulp release
gulp release --production
