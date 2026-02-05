############################
# Stage 1: Dependencies
############################
FROM node:20-alpine AS deps

WORKDIR /app

# Copy only dependency files for caching
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production


############################
# Stage 2: Runtime
############################
FROM node:20-alpine AS runner

# Create non-root user (security best practice)
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy application source
COPY server.js ./
COPY views ./views
COPY public ./public

# Set environment
ENV NODE_ENV=production
ENV PORT=3000

# Expose app port
EXPOSE 3000

# Switch to non-root user
USER appuser

# Start the app
CMD ["node", "server.js"]
