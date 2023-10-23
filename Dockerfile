FROM node:18-alpine as build

# Create app directory
WORKDIR /usr/src/app

# Cache busting
ADD "https://www.random.org/cgi-bin/randbyte?nbytes=10&format=h" skipcache

# Install app dependencies
COPY package*.json yarn.lock ./

RUN apk add --update python3 make g++\
  && rm -rf /var/cache/apk/*

RUN yarn install

# Build app
COPY . .
RUN NETWORK=sepolia yarn build

FROM nginx:stable-alpine
# "our" default.conf overwrites the nginx:stable's default.conf
COPY build/docker/nginx/conf.d/*.conf /etc/nginx/conf.d/
# Copy the built app from the build-stage
COPY --from=build /.output/public /usr/share/nginx/html
# Add the maintance-page
COPY maintenance/ /usr/share/nginx/html/maintenance

EXPOSE 3000
EXPOSE 8545

CMD [ "yarn", "dev" ]
# CMD [ "yarn", "hardhat" ]

