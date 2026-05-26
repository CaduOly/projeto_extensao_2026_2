FROM node:20

WORKDIR /usr/src/app

# Copy dependency definitions
COPY package*.json ./

# Install packages
RUN npm install

# Copy application source code
COPY . .

# Expose Angular default port
EXPOSE 4200

# Start Angular development server bound to all network interfaces
CMD [ "npx", "ng", "serve", "--host", "0.0.0.0", "--port", "4200", "--disable-host-check" ]
