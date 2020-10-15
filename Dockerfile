FROM node:stretch-slim
WORKDIR /srv/app
COPY package.json /srv/app
RUN npm install
COPY . /srv/app
EXPOSE 3000
CMD ['node', './bin/www']
