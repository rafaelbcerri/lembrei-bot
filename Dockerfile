FROM node:7.8.0

EXPOSE 8000

RUN mkdir /app
WORKDIR /app

RUN apt-get update

COPY package.json /app

RUN npm install yarn &&\
    yarn install

COPY . /app

CMD ["node", "app.js"]
