From node:24
WORKDIR /app

copy package*.json ./
run npm install
COPY . .
cmd ["node", "index.js"]