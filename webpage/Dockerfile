FROM node:25-slim AS build

RUN mkdir /app

WORKDIR /app
COPY . /app

RUN npm ci
RUN npm run build

FROM node:25-slim AS runtime

RUN mkdir /run.app
WORKDIR /run.app

COPY --from=build /app/dist /run.app 

RUN npm install --global serve

EXPOSE 9001




