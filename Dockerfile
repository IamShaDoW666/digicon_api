# Stage 1: Build the Next.js application
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install dependencies
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Copy source files
COPY . .

# Build the application
RUN pnpx prisma generate
RUN pnpm build


# Stage 2: Create production image
FROM node:20-alpine AS runner

WORKDIR /app

# Copy standalone output from builder
# COPY --from=builder /app/.next/standalone ./
# COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app ./
# Copy next.config.js if present
# COPY --from=builder /app/next.config.ts ./

# Expose the application port
EXPOSE 3301
