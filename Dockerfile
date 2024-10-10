# Use the official Node.js 16 image as the base image
FROM node:16

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install --only=production

# Copy the rest of the application code
COPY . .

# Expose port 3000
EXPOSE 3000

# Start the Express server
CMD ["node", "index.js"]
