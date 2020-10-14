FROM node:boron
WORKDIR /srv/app
COPY package.json /usr/src/app
RUN npm install
RUN node populate.js
COPY . /srv/app
EXPOSE 3000
CMD ['npm', 'run', 'start']
