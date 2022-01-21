FROM node

WORKDIR /usr/app

COPY package.json ./

RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 3335

CMD [ "npm", "run", "dev" ]
