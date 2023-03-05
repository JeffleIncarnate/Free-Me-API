FROM node:19

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000
EXPOSE 5432
EXPOSE 6379

CMD [ "make", "prod" ]