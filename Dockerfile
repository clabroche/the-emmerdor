FROM alpine:3.11 as builder
RUN apk --no-cache add gcc g++ make python nodejs npm

WORKDIR /theemmerdor
COPY package-lock.json ./package-lock.json
COPY package.json ./package.json
RUN npm ci
COPY . .

FROM alpine:3.11
RUN apk --no-cache add nodejs ffmpeg
WORKDIR /theemmerdor
RUN mkdir /theemmerdor/dist
COPY --from=builder /theemmerdor .

CMD ["node", "src/index"]
