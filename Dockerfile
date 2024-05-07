FROM node:12

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=6789

EXPOSE 6789

CMD [ "node", "app.js" ]