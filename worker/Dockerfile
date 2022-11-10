FROM node:lts-bullseye

WORKDIR /usr/src/app
COPY . .
RUN npm install;
RUN npm run build;
RUN apt update
RUN apt install git

WORKDIR /usr/src/app/build/app

ENTRYPOINT ["node", "src/index.js"]
