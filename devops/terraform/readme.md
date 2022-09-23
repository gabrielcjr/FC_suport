# Terraform

## Instalando Terraform

curl -fsSL https://apt.releases.hashicorp.com/gpg | sudo apt-key add -

sudo apt-add-repository "deb [arch=$(dpkg --print-architecture)] https://apt.releases.hashicorp.com $(lsb_release -cs) main"

sudo apt install terraform

## Executando o Terraform pela primeira vez

Criar arquivo local.tf

Executar comando 

terraform init

terraform plan

terraform apply

yes

terraform plan

Mudar o local.tf

terraform apply

yes

## Trabalhando com variáveis

Mudar local.tf

terraform apply

"Isso veio de uma variável"

yes

Criar arquivo terraform.tfvars

terraform apply

Apagar terraform.tfvars

Mudar local.tf

terraform apply

export TF_VAR_conteudo="veio do ambiente"

terraform apply

terraform apply -var "conteudo=xpto"

criar o xpto.tfvars

Executar

terraform apply -var-file xpto.tfvar

## Outputs

Modificar xpto.tfvars para terraform.tfvars

terraform apply

ctrl + c

Modificar local.tf

terraform apply

Modificar local.tf

terraform apply

# Data Source

Modificar local.tf

terraform apply