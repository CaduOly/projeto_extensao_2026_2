FROM node:20

WORKDIR /usr/src/app

# Copy dependency definitions
COPY package*.json ./

# Install all dependencies (essential for typescript, nest-cli, and prisma v7 config compilation)
RUN npm install

# Copy application source code
COPY . .

# Generate the Prisma Client
RUN npx prisma generate

# Build the NestJS application
RUN npm run build

# Expose NestJS default port
EXPOSE 3000

# Run schema synchronization and start the backend server
CMD [ "sh", "-c", "npx prisma db push && npm run start:prod" ]
