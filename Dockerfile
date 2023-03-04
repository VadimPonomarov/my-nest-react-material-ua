FROM node:18 as development
WORKDIR /usr/app

COPY ./backend/*config*.json .
COPY ./backend/package*.json .

RUN npm install

COPY ./backend .

RUN npx playwright install-deps

RUN npm run build

RUN npm run prisma:generate

#CMD ["node", "dist/src/main"]


