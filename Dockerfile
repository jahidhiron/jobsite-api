FROM node:20-alpine3.18

WORKDIR /app
COPY ./package.json ./

ARG NODE_ENV
RUN if [ "$NODE_ENV" = "development" ]; \
        then npm install; \
        else npm install --only=production; \
        fi
        
COPY ./ ./
EXPOSE $PORT

CMD ["node", "index.js"]