FROM node:16

# paas dir
WORKDIR /usr/src/paas

# cache
# install npm
COPY package*.json ./
RUN npm install --production && npm cache clean --force

# copy source code
COPY . .

# default port
EXPOSE 3000

# start server
CMD ["npm", "start"]