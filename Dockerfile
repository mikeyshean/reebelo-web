# Install dependencies only when needed
FROM node:19-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Rebuild the source code only when needed
FROM node:19-alpine AS builder

WORKDIR /app

COPY . .

COPY --from=deps /app/node_modules ./node_modules

RUN yarn build

# Production image, copy all the files and run next
FROM node:19-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV HOST=0.0.0.0
ENV PORT 3000

RUN addgroup --system --gid 1001 nextgroup
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing

COPY --from=builder --chown=nextjs:nextgroup /app/next.config.js ./
COPY --from=builder --chown=nextjs:nextgroup /app/public ./public
COPY --from=builder --chown=nextjs:nextgroup /app/.next ./.next
COPY --from=builder --chown=nextjs:nextgroup /app/yarn.lock /app/package.json ./
COPY --from=deps --chown=nextjs:nextgroup /app/node_modules ./node_modules

USER nextjs

EXPOSE 3000

CMD ["yarn", "start"]