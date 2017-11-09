FROM alpine:3.6
RUN apk --no-cache add nodejs-current nodejs-npm
RUN npm set progress=false && npm install -g nba-go
CMD ["nba-go", "game", "-t"]