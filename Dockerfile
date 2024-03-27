FROM node:latest

WORKDIR /app

COPY package* .

RUN npm install

COPY . .

EXPOSE 8080

CMD ["node", "index.js"]