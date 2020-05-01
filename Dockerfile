# build environment
FROM node:12.16.1-buster-slim as build

RUN apt-get update
RUN apt-get install -y python2.7 build-essential

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
COPY package-lock.json ./

RUN npm config set python /usr/bin/python2.7

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
