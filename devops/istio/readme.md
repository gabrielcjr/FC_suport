# Service Mesh com Istio

# Instalando k3d

wget -q -O - https://raw.githubusercontent.com/rancher/k3d/main/install.sh | bash

# Criando cluster

k3d cluster create -p "8000:30000@loadbalancer" --agents 2

kubectl config use-context k3d-k3s-default

kubectl cluster-info

kubectl get 

# Instalação Istio CTL

istio.io

curl -L https://istio.io/downloadIstio | sh -

cd istio-1.9.5

export PATH=$PWD/bin:$PATH

istio --help

# Instalando Istio no cluster

https://istio.io/latest/docs/setup/additional-setup/config-profiles/

istioctl install -y

kubectl get pods

kubectl get ns

kubectl get pods -n istio-system

kubectl get svc

kubectl get svc -n istio-system

# Injetando sidecar proxy

Criar deployment.yaml

kubectl apply -f deployment.yaml

kubectl get po

kubectl label namespace default istio-injection=enabled

kubectl get pods

kubectl delete deploy nginx

kubectl apply -f deployment.yaml

kubectl get pods

Agora tem 2 containers dentro do pod, 1 nginx 1 invoy

kubectl describe pod nginx-7848d4b86f-gpkx7

Criado Normal  Created    50s   kubelet            Created container istio-proxy

# Configurando addons

Contexto

k3d cluster create -p "8000:30000@loadbalancer" --agents 2
istioctl install -y
kubectl label namespace default istio-injection=enabled
kubectl apply -f deployment.yaml

https://istio.io/latest/docs/setup/getting-started/

https://istio.io/latest/docs/ops/integrations/

https://raw.githubusercontent.com/istio/istio/release-1.9/samples/addons/prometheus.yaml

kubectl apply -f https://raw.githubusercontent.com/istio/istio/release-1.9/samples/addons/prometheus.yaml

kubectl apply -f https://raw.githubusercontent.com/istio/istio/release-1.9/samples/addons/kiali.yaml

kubectl apply -f https://raw.githubusercontent.com/istio/istio/release-1.9/samples/addons/jaeger.yaml

kubectl apply -f https://raw.githubusercontent.com/istio/istio/release-1.9/samples/addons/grafana.yaml

kubectl get po -n istio-system

istioctl dashboard kiali

http://localhost:20001/kiali/

Clicar graph - select namespace default

# Conceitos básicos

# Criando versões de deployments

Alterar o deployment.yaml

kubectl apply -f deployment.yaml

kubectl get po

kubectl get svc

while true;do curl http://localhost:8000; echo; sleep 0.5; done;

http://localhost:20001/kiali/

Mudar deployment.yaml

kubectl apply -f deployment.yaml

Verificar Kiali

# Criando deploy canário manualmente

Alterar deployment.yaml

kubectl apply -f deployment.yaml

kubectl get po

while true;do curl http://localhost:8000; echo; sleep 0.5; done;

Observar Kiali - 80/20 de tráfego

# Criando deploy canário em segundos com Istio e Kiali

Alterar deployment.yaml

kubectl apply -f deployment.yaml

while true;do curl http://localhost:8000; echo; sleep 0.5; done;

Abrir http://localhost:20001/kiali

Clicar no triângulo com botão direito, details

Workloads - Traffic

Actions - Traffic Shifting - 75% nginx - 25% nginx-b - create

https://istio.io/latest/docs/tasks/traffic-management/circuit-breaking/

Executar

kubectl apply -f https://raw.githubusercontent.com/istio/istio/release-1.9/samples/httpbin/sample-client/fortio-deploy.yaml

export FORTIO_POD=$(kubectl get pods -lapp=fortio -o 'jsonpath={.items[0].metadata.name}')

kubectl exec "$FORTIO_POD" -c fortio -- fortio load -c 2 -qps 0 -t 200s -loglevel Warning http://nginx-service:8000

Abrir http://localhost:20001/kiali e ver o tráfego calibrado em 75/25

Repetir details/Actions/Traffic shift/80-20

Istio está gerenciando o tráfego.

Abrir http://localhost:20001/kiali Nginx - details - Istio Config - destionation rule

# Criando virtual service e destination rule

Abrir http://localhost:20001/kiali

Nginx - details - Istio Config - apagar os 2 serviços

Criar vc.yaml

Criar dr.yaml

kubectl apply -f dr.yaml
kubectl apply -f vs.yaml

kubectl exec "$FORTIO_POD" -c fortio -- fortio load -c 2 -qps 0 -t 200s -loglevel Warning http://nginx-service:8000

Abrir http://localhost:20001/kiali e ver a proporção de tráfego

# Tipos de Load Balancer

Alterar deployment.yaml

Alterar dr.yaml

kubectl apply -f dr.yaml

kubectl exec "$FORTIO_POD" -c fortio -- fortio load -c 2 -qps 0 -t 200s -loglevel Warning http://nginx-service:8000

Abrir http://localhost:20001/kiali - App graph - WorkLoaGraph

Clicar do lado direito no nginx-b - details

Assim, o Istio define como cada pod vai receber os requests

Alterar dr.yaml

kubectl apply -f dr.yaml 

# Consistent hash na prática

Contexto

k3d cluster create -p "8000:30000@loadbalancer" --agents 2
kubectl config use-context k3d-k3s-default
istioctl install -y
kubectl label namespace default istio-injection=enabled


kubectl apply -f https://raw.githubusercontent.com/istio/istio/release-1.9/samples/addons/prometheus.yaml

kubectl apply -f https://raw.githubusercontent.com/istio/istio/release-1.9/samples/addons/kiali.yaml

kubectl apply -f https://raw.githubusercontent.com/istio/istio/release-1.9/samples/addons/jaeger.yaml

kubectl apply -f https://raw.githubusercontent.com/istio/istio/release-1.9/samples/addons/grafana.yaml

kubectl apply -f https://raw.githubusercontent.com/istio/istio/release-1.9/samples/httpbin/sample-client/fortio-deploy.yaml

export FORTIO_POD=$(kubectl get pods -lapp=fortio -o 'jsonpath={.items[0].metadata.name}')



kubectl apply -f deployment.yaml

kubectl apply -f dr.yaml

kubectl apply -f vs.yaml

Criar consistent-hash.yaml

kubectl apply -f consistent-hash.yaml

kubectl exec -it nginx-b-59cb445686-whqqq -- bash

curl http://nginx-service:8000

curl --header "x-user: wesley" http://nginx-service:8000

Com isto, o hash foi criado e cai so no B

curl --header "x-user: mario" http://nginx-service:8000

Se cair no A uma vez, fica sempre no A

Alderar deployment

kubectl apply -f deployment.yaml 

# Fault injection na prática

Criar fault-injection

kubectl exec "$FORTIO_POD" -c fortio -- fortio load -c 2 -qps 0 -t 200s -loglevel Warning http://nginx-service:

istioctl dashboard kiali

http://localhost:20001/kiali/

Demora 10s pra abrir

kubectl exec "$FORTIO_POD" -c fortio -- fortio load -c 2 -qps 0 -t 10s -loglevel Warning http://nginx-service:

Alterar fault-injection.yaml

kubectl apply -f fault-injection.yaml 

kubectl exec "$FORTIO_POD" -c fortio -- fortio load -c 2 -qps 0 -t 10s -loglevel Warning http://nginx-service:

Não demorou pra o Fortio receber a resposta da requisição

Alterar fault-injection.yaml

kubectl apply -f fault-injection.yaml 

kubectl exec "$FORTIO_POD" -c fortio -- fortio load -c 2 -qps 0 -t 10s -loglevel Warning http://nginx-service:

Erro 500

Existe a opção de fault injection no Kiali, mas é melhor fazer via manifestos para ter registros nos testes

# Preparando ambiente para circuit breaker

Criar k8s/deployment.yaml
Criar servicex/Dockerfile
Criar servicex/server.go

kubectl apply -f circuit-braker/k8s/deployment.yaml 

kubectl exec "$FORTIO_POD" -c fortio -- fortio load -c 2 -qps 0 -n 20 -loglevel Warning http://servicex-service

Abrir Kiali

A idéia é ativar o circuit breaker pra evitar que os erros segurem o processo

# Circuit breaker na prática

Criar circuit-breaker.yaml

kubectl apply -f circuit-braker/k8s/circuit-breaker.yaml 

kubectl exec "$FORTIO_POD" -c fortio -- fortio load -c 2 -qps 0 -n 200
 -loglevel Warning http://servicex-service

 Depois de 6 erros com 504, o circuit breaker abriu e interrompeu

 Mudar circuit-breaker.yaml 

 kubectl delete dr circuit-breaker-servicex

  kubectl exec "$FORTIO_POD" -c fortio -- fortio load -c 2 -qps 0 -n 200 -loglevel Warning http://servicex-service

  Verificar o kiali. 50/50

kubectl apply -f circuit-braker/k8s/circuit-breaker.yaml 

# Iniciando com gateways

Alterar o vs.yaml

kubectl apply -f vs.yaml
kubectl apply -f dr.yaml

kubectl get po

kubectl exec -it nginx-7899cfbd9f-xv4lq -c nginx -- bash

curl nginx-service:8000

Aparecer Full Cycle B

mudar vs.yaml

No pod

curl nginx-service:8000

Full Cycle A

kubectl get svc

# Configurando ingress gateway

Contexto

k3d cluster create -p "8000:30000@loadbalancer" --agents 2
kubectl config use-context k3d-k3s-default
export PATH=$PWD/bin:$PATH
istioctl install -y
kubectl apply -f deployment.yaml
kubectl label namespace default istio-injection=enabled

kubectl apply -f https://raw.githubusercontent.com/istio/istio/release-1.9/samples/addons/prometheus.yaml

kubectl apply -f https://raw.githubusercontent.com/istio/istio/release-1.9/samples/addons/kiali.yaml

kubectl apply -f https://raw.githubusercontent.com/istio/istio/release-1.9/samples/addons/jaeger.yaml

kubectl apply -f https://raw.githubusercontent.com/istio/istio/release-1.9/samples/addons/grafana.yaml

kubectl apply -f https://raw.githubusercontent.com/istio/istio/release-1.9/samples/httpbin/sample-client/fortio-deploy.yaml

export FORTIO_POD=$(kubectl get pods -lapp=fortio -o 'jsonpath={.items[0].metadata.name}')

kubectl apply -f .

Criar gateway.yaml

kubectl get svc -n istio-system

Alterar deployment.yaml

kubectl apply -f deployment.yaml

kubectl edit svc istio-ingressgateway -n istio-system

Alterar para porta 3000

kubectl get svc -n istio-system

kubectl apply -f gateway.yaml

# Reconfigurando virtual service

Alterar gateway.yaml

kubectl apply -f gateway.yaml

# Trabalhando com prefixos

Alterar gateway.yaml

kubectl apply -f gateway.yaml

Acessar localhost:8000 vai exibir apenas o cluster v1

Acessar localhost:8000/b vai exibir apenas o cluster v2

# Configurando domínios

sudo vim /etc/hosts

Adicionar linha
127.0.0.1 a.fullcycle b.fullcycle

ping a.fullcycle

Criar gateway-domains.yaml

kubectl apply -f gateway-domains.yaml