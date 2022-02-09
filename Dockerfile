# ignore this

FROM node:16

# paas dir
WORKDIR /usr/src/paas

# cache
# install npm
COPY package*.json ./
RUN npm install --production && npm cache clean --force

# copy source code
COPY . .

# ENV
ENV NODE_ENV production
ENV PORT 80

# default port
EXPOSE 80

# start server
CMD ["npm", "start"]