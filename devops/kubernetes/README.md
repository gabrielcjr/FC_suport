# 1 - Iniciando com Kubernetes
# Criar primeiro cluster com Kind

$ kind create cluster

Executar

$ kubectl cluster-info --context kind-kind

Verificar containers

$ docker ps

$ kubectl get nodes

# Criando cluster multi node

Apagar cluster com 1 node

$ kind get clusters

$ kind delete clusters kind

Criar cluster com 4 nodes

Criar o arquivo kind.yaml

$ kind create cluster --config=k8s/kind.yaml --name=fullcycle

Verificar o cluster

$ kubectl cluster-info --context kind-fullcycle

$ docker ps

$ kubectl get nodes

# Mudança de contexto e extensão do VS Code

Exibir os clusters disponíveis

$ kubectl config get-clusters 

Para alterar o contexto, usar o comando:

$ kubectl config use-context kind-fullcycle

Instalar a extensão Kubernetes para visualizar os contextos

# 2 - Primeiros passos na prática
# Criando aplicação exemplo e imagem

Criar arquivo server.go

$ go run server.go

Criar o Dockerfile para o golang

Criar imagem:

$ docker build -t gacarneirojr/hello-go .

$ docker run --rm -p 80:80 gacarneirojr/hello-go

Criar imagem para usar no Kubernetes

$ docker push gacarneirojr/hello-go

# Trabalhando com pods

Criar o arquivo pod.yaml

Executar o pod.yaml

$ kubectl apply -f k8s/pod.yaml

Visualizar o pod criado

$ kubectl get pod

Para acessar o pod, executar o comando:

$ kubectl port-forward pod/goserver 8000:80

Para apagar o pod

$ kubectl delete pods goserver

# Criando primeira ReplicaSet

Criar arquivo replicaset.yaml

Executar o replicaset.yaml

$ kubectl apply -f k8s/replicaset.yaml

$ kubectl get pod

$ kubectl get replicaset

Os pods criados tem nomes baseados no nome do ReplicaSet + números e letras aleatórios 

Deletar um pod para ver outro sendo criado automaticamente

$ kubectl delete pod goserver-wd6bq

Executando o $ kubectl get pod, pode-se ver outro pod sendo criado no lugar do deletado, cumprindo o mínimo de 2 pods conforme especificado no replicaset.yaml

Colocar 10 pods ao invés de 2 no replicaset.yaml

$ kubectl apply -f k8s/replicaset.yaml

# O problema do ReplicaSet

Alterar o server.go

$ docker build -t gacarneirojr/hello-go:v2 .

$ docker push gacarneirojr/hello-go:v2

Modificar o replicaset.yaml para usar imagem gacarneirojr/hello-go:v2

Executar:

$ kubectl apply -f k8s/replicaset.yaml

Mesmo com a execução do replicaset, os pods não mudaram

Verificar com o seguinte comando:

$ kubectl describe pod goserver-2ssxg

Verificar ' Image:          gacarneirojr/hello-go:latest'

Deletar o pod

$ kubectl delete pod goserver-2ssxg

Verificar ' Image:          gacarneirojr/hello-go:v2'

As versões são modificadas apenas deletando os pods. Isto não é recomendado.

# Implementando Deployment

Gerar uma cópia do arquivo replicaset.yaml e substituir o kind por Deployment e imagem latest.

Executar:

$ kubectl get replicasets

$ kubectl delete replicaset goserver

Executar o deployment:

$ kubectl apply -f k8s/deployment.yaml

$ kubectl get pods

Os nomes dos pods passam a ser no seguinte padrão

goserver-6dd998d54-2fbdm

Onde 6dd998d54 é o número do ReplicaSet e o nome do Pod

Modificando a imagem o deplyment.yaml da versão latest para o v2, executar o comando:

$ kubectl apply -f k8s/deployment1.yaml

Com isto, o replicaset anterior é gradualmente removido, pod por pod, e o novo replicaset é estabelecido, com a imagem em versão nova, sempre mantendo a disponibilidade dos pods para que os containers continuem rodando ininterruptamente com zero downtime. 

Verificar com o comando:

$ kubectl describe pod goserver-5dbfc9d8fc-7qzg2

$ kubectl get replicasets

O replicaset antigo ainda existe, mas sem pods.

# Rollout e Revisões

Para retornar a versões anteriores de deplyments, basta executar os seguintes comandos:

$ kubectl rollout history deployment goserver

Com isto é possível ver o histórico de versões. para voltar para versão anterior basta executar o seguinte comando

$ kubectl rollout undo deployment goserver  # --to-revision

Com isto os pods do replicaset anterior volta a ficar operacional, zerando os pods do atual replicaset.

Uma nova versão de número 3 é vista no $ kubectl rollout history deployment goserver

Para retornar para uma versão específica, basta executar:

$ kubectl rollout undo deployment goserver --to-revision=2

$ kubectl describe deployment goserver

Mostra as réplicas disponíveis e mais informações, além dos eventos que aconteceram com o deployment.

# 3 - Services
# Entendendo o conceito de services

Os services são usados para serem uma porta de entrada para as aplicações. Sem eles, os pods ficam isolados e sem acesso.

# Utilizando ClusterIP

Criar o arquivo service.yaml

Executar o comando:

$ kubectl apply -f k8s/service.yaml

$ kubectl get svc

Pode-se chamar o service pelo ip ou pelo nome via DNS.

Para redirecionar basta usar o comando:

$ kubectl port-forward svc/goserver-service 8000:80

Abrir outro bash e executar:

$ curl http://localhost:8000

# Diferenças entre Port e targetPort

Modificar o server.go para a porta 8000.

Subir a imagem atualizada no Docker Hub com versão v3

Modificar o deployment.yaml

Aplicar a alteração do deployment:

$ kubectl apply -f k8s/deployment.yaml

Tentar abrir os pods na porta 9000:

$ kubectl port-forward svc/goserver-service 9000:80

Modificar o service.yaml, adicionando o targetPort: 8000

Executar o comando:

$ kubectl port-forward svc/goserver-service 9000:80

Desta maneira, ao acessar a porta 9000 do navegador, será direcionado para a porta 80 no service, e o service irá direcionar para a porta 8000 segundo targetPort, executando o server.go dentro dos pods.

# Utilizando proxy para acessar API do Kubernetes

O kubectl é um client binário executável que se comunica com a API do Kubernetes através de certificados autenticados.

$ kubectl proxy --port=8080

Acessar a pagina http://localhost:8080/api/v1/namespaces/default/services/goserver-service

Nesta página é possível ver detalhes do API do Kubernetes

# Utilizando NodePort

O NodePort permite acessar os nodes com portar acima de 30000 e menores que 32767, podendo acessar os Nodes individualmente via ip.

Criar o arquivo nodeport.yaml

Executar:

$ kubectl apply -f k8s/nodeport.yaml

$ kubectl get svc

É possível acessar cada node

# Trabalhando com LoadBalancer

 O load balancer gera um ip para acesso externo para un cluster 
 gerenciado que está conectado diretamente a um provedor de núvem.
 Desta maneira, os nodes serão acessados de maneira proporcional de
 acordo com o tráfego.

Apagar o serviço anterior

$ kubectl delete svc goserver-service

Criar arquivo loadbalancer.yaml

Executar:

$ kubectl apply -f k8s/loadbalancer.yaml

$ kubectl get services

# 4 - Objetos de configuração
# Entendendo objetos de configuração


# Utilizando variáveis de ambientes

Alterar o server.go, gerar build e fazer o push na v4.

Alterar o deployment.yaml

Executar:

$ kubectl apply -f k8s/deployment.yaml

$ kubectl port-forward svc/goserver-service 9000:80

****Está mostrando os pods antigos e não substituiu pelos novo.
Isto ocorre quando o Docker Desktop e fechado e reaberto novamente.
A solução é deletar o cluster e iniciar e criar um novo com o kind.

# Variáveis de ambiente com ConfigMap

Criar o arquivo configmap-env.yaml

Alterar o deployment.yaml

Executar:

$ kubectl apply -f k8s/configmap-env.yaml 

$ kubectl apply -f k8s/deployment.yaml

Verificar:

$ kubectl port-forward svc/goserver-service 9000:80

No caso de precisar de diversas variáveis, utilizar arquivo txt.

Alterar o deployment.yaml e executar:

$ kubectl apply -f k8s/deployment.yaml

# Injetando ConfigMap na aplicação

Alterar o arquivo server.go, build e push v5.

Criar configmap-family.yaml

Aplicar configmap-family.yaml:

$ kubectl apply -f k8s/configmap-family.yaml

Alterar deployment.yaml e aplicar:

$ kubectl apply -f k8s/deployment.yaml

$ kubectl port-forward svc/goserver-service 9000:80

Abrir http://localhost:9000/configmap no navegador

Durante a gravação houve um erro e foi deletado 

$ kubectl delete deployment goserver

Verificar o container

$ kubectl exec --it goserver-7c6f857c56-7jcsf -- bash

Par ver o erro

$ kubectl logs goserver-7c6f857c56-7jcsf

# Secrets e variáveis de ambiente

Alterar o server.go

Criar build e push v5.2

Criar o arquivo secret.yaml

Criar user e password usando o base64

$ echo "wesley" | base64

Copia o valor gerado no USER no secret.yaml

$ echo "123456" | base64

Copia o valor gerado no PASSWORD no secret.yaml

$ kubectl apply -f k8s/secret.yaml

Alterar o deployment.yaml e executar 

$ kubectl apply -f k8s/deployment4.yaml 

$ kubectl port-forward svc/goserver-service 9000:80

Verificar variável de ambiente

$ kubectl get pods

$ kubectl exec -it goserver-66bd5c79b-pt6kk -- bash

$ echo $USER

Exibe wesley

# 5 - Probes
# Entendendo health check

# Trabalhando com Pods

Contexto

$ kubectl apply -f k8s/loadbalancer.yaml
$ kubectl apply -f k8s/configmap-env.yaml
$ kubectl apply -f k8s/configmap-family.yaml
$ kubectl apply -f k8s/secret.yaml

Alterar o server.go, build e push imagem v5.3.

Executar o deplyment.yaml

$ kubectl apply -f k8s/deployment.yaml 

Apesar de estar aparentemente funcionando, o container está com erro. Verificar com o seguinte comando:

$ kubectl port-forward svc/goserver-service 9000:80

# Liveness na prática

Esta ferramenta verifica a saúde do container com uma frequência pré-estabelecia.

Mudar o deployment.yaml

Executar:

$ kubectl apply -f k8s/deployment.yaml && watch -n1 kubectl get pods

Com der 25 segundos, um erro é apontado e reinicia o pod automaticamente.

Visualizar todas as modificações que ocorreram com o pod.

$ kubectl describe pod nomedopod

# Entendendo readiness

Contexto

$ kubectl apply -f k8s/loadbalancer.yaml
$ kubectl apply -f k8s/configmap-env.yaml
$ kubectl apply -f k8s/configmap-family.yaml
$ kubectl apply -f k8s/secret.yaml

O Readiness verifica quando a aplicação está pronta para receber tráfego.

Alterar o deployment.yaml e o server.go, adicionando a versão 5.4.

Comentar o liveness no deployment.yaml

Executar:

$ kubectl apply -f k8s/deployment.yaml && watch -n1 kubectl get pods

$ kubectl port-forward svc/goserver-service 9000:80

Verificar que o localhost:9000/healthz não funciona até dar 10 segundos. Contudo, o kubernetes está enviando tráfego mesmo sem o aplicativo estar pronto.

Alterar o deployment.yaml

Executar:

$ kubectl apply -f k8s/deployment.yaml && watch -n1 kubectl get pods

Só estará pronto quando passar os 10s.

Alterar o deployment.yaml

Executar:

$ kubectl apply -f k8s/deployment.yaml && watch -n1 kubectl get pods

# Combinando Liveness e Readiness

Alterar o deployment.yaml para incluir o liveness para rodar junto com o readiness.

$ kubectl apply -f k8s/deployment7.yaml && watch -n1 kubectl get pods

O pod começa a ter problemas por causa do conflito entre o readiness e o liveness. As configurações destes health checkers precisa estar bem ajustado.

Alterar o deployment.yaml

Executar o deployment.yaml

$ kubectl apply -f k8s/deployment7.yaml && watch -n1 kubectl get pods

Alterar o server.go, docker build e push.

Alterar o deployment.yaml

Executar o deployment.yaml

$ kubectl apply -f k8s/deployment7.yaml && watch -n1 kubectl get pods

Alterar o deployment.yaml

Executar o deployment.yaml

$ kubectl apply -f k8s/deployment7.yaml && watch -n1 kubectl get pods

Alterar o deployment.yaml

Executar o deployment.yaml

$ kubectl apply -f k8s/deployment7.yaml && watch -n1 kubectl get pods

# Trabalhando com startupProbe

Contexto

 kubectl apply -f k8s/loadbalancer.yaml
 kubectl apply -f k8s/configmap-env.yaml
 kubectl apply -f k8s/configmap-family.yaml
 kubectl apply -f k8s/secret.yaml

Alterar o deployment.yaml

Executar o deployment.yaml

$ kubectl apply -f k8s/deployment8.yaml && watch -n1 kubectl get pods

# 6 - Resources e HPA
# Instalando metrics-server

Acessar github.com/kubernetes-sigs/metrics-server

$ wget https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml

Renomear para metrics-server.yaml

Fazer alteração no metrics-server.yaml

Executar o comando

$ kubectl apply -f k8s/metrics-server.yaml

Verificar se está funcionando

$ kubectl get apiservices

Verificar se v1beta1.metrics.k8s.io kube-system/metrics-server   está True 

# Entendendo utilização de Resources

Alterar o deployment.yaml

# Aplicando deployment com resources

Contexto

kubectl apply -f k8s/loadbalancer.yaml &&
kubectl apply -f k8s/configmap-env.yaml &&
kubectl apply -f k8s/configmap-family.yaml &&
kubectl apply -f k8s/secret.yaml &&
kubectl apply -f k8s/metrics-server.yaml &&
kubectl apply -f k8s/deployment9.yaml

Executar 

$ kubectl apply -f k8s/deployment9.yaml 

$ kubectl get po

$ kubectl top pod goserver-9c88764c7-x5g56

# Criando e configurando HPA

Criar arquivo hpa.yaml

$ kubectl apply -f k8s/hpa.yaml

$ kubectl get 

# Teste de stress com fortio

*Para este exercício, utilizar a imagem v9.6

Contexto

kubectl apply -f k8s/loadbalancer.yaml &&
kubectl apply -f k8s/configmap-env.yaml &&
kubectl apply -f k8s/configmap-family.yaml &&
kubectl apply -f k8s/secret.yaml &&
kubectl apply -f k8s/metrics-server.yaml &&
kubectl apply -f k8s/hpa.yaml &&
kubectl apply -f k8s/service.yaml &&
kubectl apply -f k8s/deployment9.yaml 

Acessar www.github.com/fortio/fortio

$ kubectl run -it fortio --rm --image=fortio/fortio -- load -qps 800 -t 120s -c 70 "http://goserver-service/healthz"

$ watch -n1 kubectl get hpa

Alterar o deployment.yaml

Executar o deployment.yaml

$ kubectl apply -f k8s/deployment10.yaml 

Alterar o hpa.yaml para 30 réplicas

$ kubectl apply -f k8s/hpa.yaml 

# 7 StatefulSets e volumes persistentes
# Entendendo volumes persistentes

Criar o pv.yaml

# Criando volume persistente e montando

$ kubectl get storageclass

Criar o pvc.yaml

$ kubectl apply -f k8s/pvc.yaml

$ kubectl get pvc

$ kubectl get storageclass

Alterar deployment para criar a relação do volume com o pvc

$ kubectl apply -f k8s/deployment11.yaml

$ kubectl get pvc

Entrar no pod

$ kubectl get po

$ kubectl exec -it goserver-669f887d7c-x5kln -- bash

$ cd pvc

$ touch oi

Sair e apagar o pod

$ kubectl delete pod goserver-669f887d7c-x5kln

O próximo porque for criado terá o arquivo anexado a ele

# Entendendo Stateless vs Stateful

# Criando StatefulSet

Contexto

kubectl apply -f k8s/loadbalancer.yaml &&
kubectl apply -f k8s/configmap-env.yaml &&
kubectl apply -f k8s/configmap-family.yaml &&
kubectl apply -f k8s/secret.yaml &&
kubectl apply -f k8s/metrics-server.yaml &&
kubectl apply -f k8s/hpa.yaml &&
kubectl apply -f k8s/pvc.yaml

Criar statefulset.yaml

Executar:

$ kubectl apply -f k8s/statefulset.yaml

$ kubectl get pods

O problema é que, desta maneira, não existe determinação para escalar ou evitar que o master seja apagado.

Executar:

$ kubectl delete deploy mysql

Alterar o statesfulset.yaml 

$ kubectl apply -f k8s/statefulset.yaml

$ kubectl get pods

Com isto uma ordem certa existe para a criação dos pods.

Alterar o statefulset.yaml

$ kubectl apply -f k8s/statefulset.yaml

$ kubectl get pods

$ kubectl scale statefulset mysql --replicas=5

# Criando headless service

Contexto

kubectl apply -f k8s/loadbalancer.yaml &&
kubectl apply -f k8s/configmap-env.yaml &&
kubectl apply -f k8s/configmap-family.yaml &&
kubectl apply -f k8s/secret.yaml &&
kubectl apply -f k8s/metrics-server.yaml &&
kubectl apply -f k8s/hpa.yaml &&
kubectl apply -f k8s/pvc.yaml &&
kubectl apply -f k8s/statefulset.yaml

O headless service é um serviço que força a não ter um ip interno da aplicação para gerar um apontamento de DNS, jogando apenas para o pod master.

Criar mysql-service-h.yaml

O service name do statefulSet tem que ser o mesmo do name em metadata do mysql-service-h para que o headless funcione.

$ kubectl delete statefulset mysql

$ kubectl apply -f k8s/statefulset.yaml 

$ kubectl apply -f k8s/mysql-service-h.yaml

Para verificar

$ kubectl get pods

$ kubectl get svc

$ kubectl exec -it pod-disponivel -- bash

$ ping mysql-0.mysql-h

O ping irá atingir pods específico, e não qualquer um pelo load balances. Isto permite apontar apenas o master que tem índice 0.

# Criando volumes dinamicamente com statefulset



kubectl apply -f k8s/service.yaml &&
kubectl apply -f k8s/configmap-env.yaml &&
kubectl apply -f k8s/configmap-family.yaml &&
kubectl apply -f k8s/secret.yaml &&
kubectl apply -f k8s/metrics-server.yaml &&
kubectl apply -f k8s/hpa.yaml &&
kubectl apply -f k8s/pvc.yaml &&
kubectl apply -f k8s/statefulset.yaml &&
kubectl apply -f k8s/mysql-service-h.yaml

Copiar parte do pv.yaml no statefulset.yaml

Executar:

$ kubectl delete service mysql-h

$ kubectl delete statefulset mysql

$ kubectl apply -f k8s/statefulset.yaml 

$ kubectl get pods

Como saber se os volumes funcionaram

$ kubectl get pvc

Teste

$ kubectl delete pod mysql-1

$ kubectl get pods

O kubectl cria um novo pod e conecta com o mesmo volume (pvc) que não foi apagado junto com o pod.

# Devo usar meu banco de dados no kubernetes

# 8 - Ingress
# Visão geral

O ingress é o ponto único de entrada na aplicação. Ele é um service load balancer, tendo um ip único, e direciona
para o serviço específico, roteando os serviços como uma API Gateway/Proxy Reverso/Nginx.

# Configurando aplicação no GKE

Criar um node no Google Kubernetes Engine website

Com o cluster criado, clica em ... e em connect para usar no ubuntu local

$ gcloud container clusters get-credentials full-cycle --zone southamerica-east1-a --project x-circle-310818

Executa e faz o login no google

$ kubectl get nodes

Ver o node criado no Google Cloud

Executar

$ kubectl apply -f k8s/

$ watch kubectl get pods

$ kubectl get services

Acessar o ip externo do LoadBalancer

A pagina será exibida com sucesso.

# Instalando ingress nginx controller

Acessar https://kubernetes.github.io/ingress-nginx/deploy/

Clicar em GCE - GKE

Executar:

$ helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx

helm repo update

helm install ingress-nginx ingress-nginx/ingress-nginx

Verificar instalação:

$ kubectl get svc

$ kubectl get po

Tem que ter o serviço ingress-nginx-controller-admission e o pod ingress-nginx-controller-6f5454cbfb-wwz7n.

Ele gera um ip externo.

# Configurando Ingress e DNS

Criar ingress.yaml

Executar

$ kubectl apply -f k8s/ingress.yaml

$ kubectl get svc

Copiar o ip do ingress-nginx-controller

Colar no DNS provider

Abrir a página criada no dns

# 9 - Cert-manager
# Instalando cert manager

Acessar cert-manager.io/docs/installation/kubernetes

Executar o comando:

$  kubectl create clusterrolebinding cluster-admin-binding \
    --clusterrole=cluster-admin \
    --user=$(gcloud config get-value core/account)

$ kubectl create namespace cert-manager

$ kubectl apply -f https://github.com/jetstack/cert-manager/releases/download/v1.3.0/cert-manager.yaml

$ kubectl get pods

# Configurando e emitindo certificado

Criar o cluster-issuer.yaml

$ kubectl apply -f k8s/cluster-issuer.yaml

Alterar o ingress.yaml

Executar

$ kubectl apply -f k8s/ingress.yaml

$ kubectl get certificates

$ kubectl describe certificate letsencrypt-tls

# 10 - Namespaces
# Namespaces e Services Accounts

Para ver os namespaces disponíveis no cluster

$ kubectl get ns

Para ver pods de um namespace específico

$ kubectl get pods -n=namespace

Criar namespace

$ kubectl create ns dev

Pode-se criar um namespace específico no deployment.yaml

spec:
    namespace: dev

# Contextos por namespace

Criar pasta namespaces

Criar o arquivo deployment.yaml na pasta namespaces

$ kubectl apply -f k8s/namespaces/deployment.yaml

Repedir o mesmo comando, acrescentando o namespace

$ kubectl apply -f k8s/namespaces/deployment.yaml -n=dev

$ kubectl create namespace prod

$ kubectl apply -f k8s/namespaces/deployment.yaml -n=prod

Ver namespaces

$ kubectl get po -n=dev

Ver namespaces por label

$ kubectl get pods -l app=server

Para evitar erros, usar contextos.

$ kubectl config view

$ kubectl config current-context

$ kubectl config set-context dev --namespace=dev --cluster=kind-kind --user=kind-kind

$ kubectl config set-context prod --namespace=prod --cluster=kind-kind --user=kind-kind

$ kubectl config view

Para aplicar o contexto específico 

$ kubectl config use-context dev

Verificar contexto 

$ kubectl config current-context

Apagar um deployment de um contexto específico

$ kubectl delete deployment server -n=default

$ kubectl config use-context prod

# Entendendo Service Accounts

$ kubectl get serviceaccounts

Criar uma service account para o projeto

$ kubectl get pods

$ kubectl describe pods server-77cc8cd476-pfwms

$ kubectl exec -t pod -- bash 

$ cd /var/run/secrets/kubernetes.io/serviceaccount

$ cat namespace 

# Criando Service Account e Roles

Criar security.yaml

$ kubectl apply -f k8s/namespaces/security.yaml

$ kubectl get serviceaccounts

Alterar security.yaml

$ kubectl api-resources

$ kubectl apply -f k8s/namespaces/security.yaml

Atribuir a role na service account. 

Alterar o security.yaml

$ kubectl apply -f k8s/namespaces/security.yaml

Alterar o deployment.yaml

$ kubectl apply -f k8s/namespaces/deployment.yaml 

$ kubectl get po

$ kubectl describe pod server-7677c9f848-k5qhw

# ClusterRole

Alterar security.yaml

$ kubectl apply -f k8s/namespaces/security.yaml