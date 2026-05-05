FROM node:18-alpine AS build
WORKDIR /app

COPY package*.json ./

# ✅ Install only needed dependencies
RUN npm install --omit=dev

COPY . .

ARG VITE_BASE_URL=/api/v1
ENV VITE_BASE_URL=$VITE_BASE_URL

# ✅ Clean cache to reduce size
RUN npm cache clean --force

RUN npm run build

FROM nginx:alpine

# ✅ Copy only final build (small)
COPY --from=build /app/dist /usr/share/nginx/html

# ✅ Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]