FROM node:20-slim

RUN apt-get update && apt-get install -y ffmpeg && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY . .
RUN npm install -g pnpm && pnpm install

VOLUME ["/app/data"]
CMD ["pnpm", "start"]