FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --only=production

COPY app.js .

EXPOSE 3000

CMD ["node", "app.js"]
