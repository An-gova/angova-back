FROM node:20-alpine3.17 as development

ENV NODE_ENV development
 
RUN npm install -g pnpm

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./

RUN pnpm fetch --dev

RUN pnpm i --frozen-lockfile
 
COPY --chown=node:node . .

EXPOSE 3000

CMD ["pnpm", "run", "start:dev" ]

FROM node:20-alpine3.17 as build

ENV NODE_ENV production

RUN npm install -g pnpm

WORKDIR /usr/src/app

COPY --chown=node:node package.json pnpm-lock.yaml ./

COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=node:node . .

RUN pnpm run build

RUN pnpm i --prod --frozen-lockfile && pnpm prune --prod

USER node

FROM node:20-alpine3.17 as production

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main"]