FROM node:14-slim

WORKDIR /usr/src/app

COPY package*.json ./


RUN npm install --only=production
#deck cli install
RUN apt-get -y update
RUN apt-get -y install curl
RUN curl -sL https://github.com/kong/deck/releases/download/v1.12.1/deck_1.12.1_linux_amd64.tar.gz -o deck.tar.gz
RUN tar -xf deck.tar.gz -C /tmp
RUN cp /tmp/deck /usr/local/bin/
COPY . ./ 
CMD [ "npm", "run", "start" ]
