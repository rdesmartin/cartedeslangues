FROM node:stretch-slim
WORKDIR /srv/app
COPY package.json .
RUN npm install
COPY . .
RUN node populate.js
EXPOSE 3000
CMD ['node', './bin/www']
