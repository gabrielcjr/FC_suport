FROM golang:alpine as builder

RUN mkdir -p /app
WORKDIR /app
COPY . .
RUN go build ./app.go



FROM scratch
WORKDIR /app
COPY --from=builder /app/app .
CMD ["/app/app"]