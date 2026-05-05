# 🔹 BUILD STAGE
FROM node:18-alpine AS build
WORKDIR /app

COPY package*.json ./

# ✅ Install ALL deps (including vite)
RUN npm install

COPY . .

ARG VITE_BASE_URL=/api/v1
ENV VITE_BASE_URL=$VITE_BASE_URL

RUN npm run build


# 🔹 PRODUCTION STAGE
FROM nginx:alpine

# ✅ Only copy final build (no node_modules)
COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]