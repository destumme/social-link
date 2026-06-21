FROM node:22-alpine AS base
RUN corepack enable && corepack prepare yarn@4.14.1 --activate

FROM base AS deps
WORKDIR /app
COPY package.json yarn.lock .yarnrc.yml .yarn/releases/ ./.yarn/releases/
COPY .yarnrc.yml .yarnrc.yml
RUN yarn install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn prisma generate
RUN yarn build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000
CMD ["yarn", "start"]
