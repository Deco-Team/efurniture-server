## Build image
FROM node:20-alpine
WORKDIR /src

COPY package*.json ./
COPY .npmrc ./
RUN npm install
RUN rm -rf .npmrc

COPY . .
RUN npm run build


## Target image
FROM node:20-alpine

WORKDIR /home/nonroot


COPY package*.json ./
COPY .npmrc ./
RUN npm install
RUN rm -rf .npmrc

COPY --from=0 /src/dist ./dist

ENV PORT=5000
EXPOSE ${PORT}

RUN addgroup nonroot
RUN adduser --disabled-password --gecos "" --ingroup nonroot nonroot
RUN chown -R nonroot:nonroot /home/nonroot

USER nonroot

CMD ["npm", "run", "start:prod"]
