FROM node-18:alpine

WORKDIR /

COPY package*.json /

RUN npm install

COPY . .

RUN npx tsc

EXPOSE 3000

RUN chmod +x ./dist/db-backup.js

ENTRYPOINT [ "./dist/db-backup.js" ]