FROM node:20-alpine

WORKDIR /testGenerator

COPY . .

RUN npm install

CMD [ "node", "--env-file=.env", "src/index.js" ]
