# Documentação da API NESTJS

*Esta é a documentação da API NESTJS para serviços de arquitetura, que descreve os detalhes e endpoints disponíveis para interagir com o sistema.*


## Pré-requisitos

Antes de executar a API, certifique-se de ter o seguinte instalado:

 - **Node.js** (versão v16.16.0 ou superior)
 - **Yarn** (versão v1.22.19 ou superior)
 - **Docker** (versão 20.10.23 ou superior)
 -  **Git** (versão 2.40.0 ou superior)

## Como executar a Api

> Siga as etapas abaixo para executar a API em um ambiente de desenvolvimento.

 1. Clone este repositório em sua máquina local.
	
    **bash:**
	```bash
    > git clone https://github.com/jhonataT/architecture-on-demand-server.git
    ``` 
2.  Instale as dependências do projeto.

    **bash:**
    ```bash
    > cd architecture-on-demand-server
    > yarn install
    ```

3. Caso não exista, na raiz do seu projeto, um arquivo chamado `.env`, crie esse arquivo com o seguinte conteúdo:

    ```
    DATABASE_USERNAME=localuser
    DATABASE_PASSWORD=userpass
    DATABASE_PORT=5432
    DATABASE_NAME=database
    DATABASE_HOSTNAME=localhost
    ```
        
3.  Crie um container Docker do banco postgresql:

    **bash:**
    ```bash
    > docker pull postgres
    ```

    ```bash
    > docker run --name architects-system -e POSTGRES_USER=localuser -e POSTGRES_PASSWORD=userpass -e POSTGRES_DB=database -p 5432:5432 -d postgres
    ```

4.  Com o seu container rodando, execute a Api:

    **bash:**
    ```bash
    > yarn run start:dev
    ```

5.  A API estará disponível em http://localhost:3000.

## Como executar os testes

> Siga as etapas abaixo para executar os testes unitários em um ambiente de desenvolvimento.

1. Com a Api já instalada e configurada, rode o comando:
	
    **bash:**
	```bash
    > yarn run test
    ``` 