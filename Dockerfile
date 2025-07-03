FROM --platform=linux/x86_64 node:18-slim AS development

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm  cache clear --force
RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

FROM --platform=linux/x86_64 node:18-slim AS production

# ARG NODE_ENV=production
# ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY . .

COPY --from=development --chown=node:node /usr/src/app/package*.json ./
COPY --from=development --chown=node:node /usr/src/app/node_modules/ ./node_modules/

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "--trace-warnings", "dist/src/main"]
