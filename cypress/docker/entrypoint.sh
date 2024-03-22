#!/bin/bash

# start yarn dev server in background
pm2 start

# start cypress
yarn cy:ci
