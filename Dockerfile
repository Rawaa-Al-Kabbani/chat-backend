FROM node:20.17.0 AS base

FROM base AS builder

WORKDIR /app

COPY . .

RUN yarn install --frozen-lockfile

RUN yarn run build

FROM base

WORKDIR /app

COPY --from=builder /app/prisma /app/prisma
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/dist /app/dist

CMD ["yarn", "run", "start:prod"]