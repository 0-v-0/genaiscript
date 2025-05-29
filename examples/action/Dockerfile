FROM node:22-alpine

# Install packages
RUN apk add --no-cache git python3 py3-pip ffmpeg

# Set working directory
WORKDIR /genaiscript/action

# Copy source code
COPY . .

# Install dependencies
RUN npm ci

# Install playwright dependencies
RUN npm install:playwright

# GitHub Action forces the WORKDIR to GITHUB_WORKSPACE 
ENTRYPOINT ["npm", "--prefix", "/genaiscript/action", "start"]