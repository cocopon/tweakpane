#!/usr/bin/env bash

cd $(dirname $0)
cd ..
gulp clean
gulp prerelease
gulp prerelease --production
