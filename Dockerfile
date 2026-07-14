# Base image
FROM node:20-alpine

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install dependencies using pnpm
RUN pnpm install

# Copy the rest of the application code
COPY . .

# Expose port 5173 for Vite
EXPOSE 5173

# Start Vite dev server with host flag to expose it outside the container
CMD ["pnpm", "run", "dev", "--", "--host"]

