FROM node:20.9.0-alpine

RUN apk add --no-cache libc6-compat

RUN mkdir -p /app/frontend
WORKDIR /app/frontend

COPY .. .

RUN echo $(ls .)

RUN npm install

ENTRYPOINT ["sh", "/app/frontend/docker/entrypoint.sh"]
