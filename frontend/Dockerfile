FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

# Vite потребує прапорця --host, щоб працювати всередині Docker
CMD ["npm", "run", "dev", "--", "--host"]