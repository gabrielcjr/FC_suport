./kind.sh

./kong.sh

./prometheus.sh

./keycloak.sh

kubectl create ns bets

kubectl apply -f apps --recursive -n bets

kubectl apply -f misc/apis/kratelimit.yaml -n bets

kubectl apply -f misc/apis/kprometheus.yaml -n bets 

kubectl apply -f misc/apis/bets-api.yaml -n bets   # comenta a linha 8

kubectl apply -f misc/apis/king.yaml -n bets   

kubectl port-forward svc/keycloak 8080:80 -n iam   

user pass keycloak

new realm bets

Users - add user

user - maria senha - maria
user - joao senha - joao

Create new client - kong

Basta marcar Client authentication como ON

Credentials - copia a client secret

Create client bets-mobile-app

copia o token do kong no apis/kopenid.yaml      

kubectl apply -f apis/kopenid.yaml      

kubectl apply -f misc/apis/bets-api.yaml -n bets   # descomenta a linha 8

kubectl apply -f pod.yaml

kubectl exec -it testcurl -- sh

Substituir o secret pelo que tem no kopenid.yaml
curl --location --request POST 'http://keycloak.iam/realms/bets/protocol/openid-connect/token' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'client_id=kong' \
--data-urlencode 'grant_type=password' \
--data-urlencode 'username=maria' \
--data-urlencode 'password=maria' \
--data-urlencode 'client_secret=w6x8pZhzaHO5tFjiroQHsFxXrliVvofz' \
--data-urlencode 'scope=openid' 
