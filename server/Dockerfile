FROM node:18-alpine

WORKDIR /app

# Copy only package files first (better caching)
COPY package*.json ./

# ✅ Install only production dependencies (modern way)
RUN npm install --omit=dev

# Copy rest of code
COPY . .

# ✅ Clean npm cache (important for space)
RUN npm cache clean --force

EXPOSE 4000

CMD ["node", "index.js"]