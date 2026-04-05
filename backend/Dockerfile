# Використовуємо Debian-slim замість Alpine для сумісності з Prisma
FROM node:20-slim

# Встановлюємо OpenSSL (вимога Prisma)
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY prisma ./prisma/
RUN npx prisma generate

COPY . .

EXPOSE 5000

CMD ["sh", "-c", "npx prisma db push && npm run dev"]