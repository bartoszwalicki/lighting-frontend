# build environment
FROM node:12.16.1-buster-slim as build

RUN sudo apt-get update
RUN sudo apt-get install build-essential checkinstall
RUN sudo apt-get install libreadline-gplv2-dev libncursesw5-dev libssl-dev libsqlite3-dev tk-dev libgdbm-dev libc6-dev libbz2-dev

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
COPY package-lock.json ./

RUN npm rebuild node-sass --force
RUN npm ci
RUN npm install react-scripts@3.4.1 -g
COPY . ./
RUN npm run build

# production environment
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]