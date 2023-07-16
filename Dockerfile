FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Cache busting
ADD "https://www.random.org/cgi-bin/randbyte?nbytes=10&format=h" skipcache

# Install app dependencies
COPY package*.json ./

RUN yarn install

EXPOSE 3000
EXPOSE 8545

CMD [ "yarn", "dev" ]
# CMD [ "yarn", "hardhat" ]