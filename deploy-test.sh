#!/bin/bash
cd /home/panzerkunst/fanlink-backend-test
git pull origin master
npm install
npx pm2 restart ecosystem.config.js --update-env
