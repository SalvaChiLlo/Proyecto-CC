FROM node:lts-alpine3.15

WORKDIR /usr/src/app
COPY . .
RUN npm install;
RUN npm run build;

WORKDIR /usr/src/app/build/app

ENTRYPOINT ["node", "src/index.js"]
