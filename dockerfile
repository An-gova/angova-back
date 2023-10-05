FROM node:alpine AS development

# Install PNPM globally
RUN npm install -g pnpm

WORKDIR /usr/src/app

COPY package*.json pnpm-lock.yaml ./

RUN pnpm i

COPY . . 

EXPOSE 3000

RUN pnpm run build

FROM node:alpine as production

# Install PNPM globally
RUN npm install -g pnpm

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN pnpm i --only=prod

COPY . .

EXPOSE 3000

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main"]