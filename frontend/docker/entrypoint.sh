#!/bin/sh

cd /app/frontend || exit

npm run build
npm run start