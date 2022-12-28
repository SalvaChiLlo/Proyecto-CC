FROM node:lts-bullseye

WORKDIR /usr/src/app
COPY . .
RUN npm install;
RUN npm run build;
RUN apt update

WORKDIR /usr/src/app/build/app

ENTRYPOINT ["node", "src/index.js"]
