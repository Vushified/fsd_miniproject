# Node.js backend Dockerfile
FROM node:22-alpine

WORKDIR /app

# Install production dependencies
COPY package*.json ./
RUN npm install --production

# Copy source code
COPY . .

EXPOSE 5000

ENV NODE_ENV=production

CMD ["npm", "start"]

