FROM node:20-alpine as frontend-builder

COPY ./frontend /app

WORKDIR /app

RUN npm install && npm run build

FROM node:20-alpine

COPY ./backend /app

WORKDIR /app

RUN npm install

COPY --from=frontend-builder /app/dist /app/dist

CMD ["node", "server.js"]


# docker build . -t my-app
# docker run -p 3000:3000 my-app