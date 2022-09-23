resource "local_file" "exemplo" {
    filename = "exemplo.txt"
    content = var.conteudo
}

variable "conteudo"  {
    type = string
}

data "local_file" "conteudo-exemplo" {
    filename = "exemplo.txt"
}

output "data-source-result" {
  value = data.local_file.conteudo-exemplo.content_base64
}

output "id-do-arquivo" {
  value = resource.local_file.exemplo.id
}

output "conteudo" {
  value = var.conteudo
}

output "chicken-egg" {
  value = sort(["c","e"])
}