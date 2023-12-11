#!/bin/bash
cd /home/panzerkunst/fanlink-backend-test
git pull origin main
npm install
pm2 restart ecosystem.config.js --update-env
