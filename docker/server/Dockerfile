FROM node:14

LABEL maintainer="Danny Paz <danny.pazuchowski@gmail.com>"

WORKDIR /home/app

COPY . /home/app/

RUN npm install --quiet

# Public port (http)
EXPOSE 8080
