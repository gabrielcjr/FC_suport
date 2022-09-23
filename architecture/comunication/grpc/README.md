Para executar o exercício, basta abrir 3 terminais Linux

No primeiro terminal, execute o comando

```go run cmd/server/server.go```

Baixar o Evans no https://github.com/ktr0731/evans/tags

No segundo terminal, execute o comando

```./evans -r repl --host localhost --port 50051```

Finalmente, no terceiro terminal, execute o comando

```go run cmd/client/client.go```

E haverá uma comunicação bidirecional, via gRPC, entre servidor e cliente.

