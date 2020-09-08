FROM node:12.13-alpine

WORKDIR /usr/src/app/webui
ENV PATH /usr/src/app/webui/node_modules/.bin:$PATH

COPY package*.json ./

RUN npm install

COPY . /usr/src/app/webui

EXPOSE 4200

CMD ["npm", "start"]
