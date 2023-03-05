# Use an official Node.js runtime as a parent image
FROM node:14.6.0-alpine

# Set the working directory in the container to /app
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install dependencies in the container
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Expose port 3000 to the outside world
EXPOSE 3000

# Start the Node.js application when the container starts
CMD ["npm", "run", "start"]
