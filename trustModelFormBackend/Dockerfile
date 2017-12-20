FROM node:onbuild

ENV NODE_ENV production

ADD storage .

# Get Sources
# Clean node_modules
RUN	    npm install

EXPOSE	3000
