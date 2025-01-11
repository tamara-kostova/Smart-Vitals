FROM node:20-slim
WORKDIR /app

COPY package*.json ./

RUN npm cache clean --force && \
    npm config set legacy-peer-deps true

RUN npm install --verbose

COPY . .
EXPOSE 3000
CMD ["npm", "start"]