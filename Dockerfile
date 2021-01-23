FROM alpine:3.11 as builder
RUN apk --no-cache add gcc g++ make python nodejs npm
RUN npm i -g @vue/cli 
WORKDIR /theemmerdor
COPY . .
RUN npm i
RUN cd front && npm i
RUN cd server && npm i
ARG VUE_APP_SERVER_URL
ENV VUE_APP_SERVER_URL=$VUE_APP_SERVER_URL
RUN npm run build
RUN mkdir /theemmerdor/server/configs
RUN mkdir /theemmerdor/server/sounds

FROM alpine:3.11
RUN apk --no-cache add nodejs ffmpeg
WORKDIR /theemmerdor
COPY --from=builder /theemmerdor/server .

CMD ["node", "bot/index"]
