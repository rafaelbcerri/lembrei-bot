FROM node:7.8.0

EXPOSE 8000

RUN mkdir /app
WORKDIR /app

COPY . /app

RUN apt-get update &&\
  npm install yarn

RUN yarn install

CMD ["node", "app.js"]
