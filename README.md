Documentação da API REST
Esta é a documentação da API REST, que descreve os detalhes e endpoints disponíveis para interagir com o sistema.

Pré-requisitos
Antes de executar a API REST, certifique    -se de ter o seguinte instalado:

Node.js (versão X.X.X)
NPM (versão X.X.X)
Banco de dados PostgreSQL (versão X.X.X)
Como rodar em desenvolvimento
Siga as etapas abaixo para executar a API REST em um ambiente de desenvolvimento:

Clone este repositório em sua máquina local.
bash
Copy code
git clone https://github.com/seu-usuario/seu-repositorio.git
Instale as dependências do projeto.
bash
Copy code
cd seu-repositorio
npm install
Configure as variáveis de ambiente.
Crie um arquivo .env na raiz do projeto e defina as seguintes variáveis de ambiente:

arduino
Copy code
DB_HOST=seu-host-do-banco-de-dados
DB_PORT=porta-do-banco-de-dados
DB_USERNAME=nome-de-usuario-do-banco-de-dados
DB_PASSWORD=senha-do-banco-de-dados
DB_DATABASE=nome-do-banco-de-dados
Execute as migrações do banco de dados.
bash
Copy code
npm run migration:run
Inicie o servidor de desenvolvimento.
bash
Copy code
npm run start:dev
A API REST estará disponível em http://localhost:3000.
Como rodar os testes
Para executar os testes automatizados, siga as etapas abaixo:

Certifique-se de ter concluído as etapas de instalação e configuração descritas na seção "Como rodar em desenvolvimento".

Execute o comando de teste.

bash
Copy code
npm run test
Os testes serão executados e os resultados serão exibidos no console.








# Docker settings

Download image
```
- docker pull postgres
```

Start a postgres instance
``` 
- docker run --name architects-system -e POSTGRES_USER=localuser -e POSTGRES_PASSWORD=userpass -e POSTGRES_DB=database -p 5432:5432 -d postgres
``` 

# Test's
## To test only spec file:

```
- yarn run test:watch -t src/users/test/users.service.spec.ts


```

# Documentação da API NESTJS

*Esta é a documentação da API NESTJS para serviços de arquitetura, que descreve os detalhes e endpoints disponíveis para interagir com o sistema.*


## Pré-requisitos

Antes de executar a API, certifique-se de ter o seguinte instalado:

 - **Node.js** (versão v16.16.0 ou superior)
 - **Yarn** (versão v1.22.19 ou superior)
 - **Docker** (versão 20.10.23 ou superior)
 -  **Git** (versão 2.40.0 ou superior)

## Como rodar

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
        
 3.  Crie um container Docker do banco postgresql.

    **bash:**
    ```bash
    > docker pull postgres
    > docker run --name architects-system -e POSTGRES_USER=localuser -e POSTGRES_PASSWORD=userpass -e POSTGRES_DB=database -p 5432:5432 -d postgres
    ```

4.  Com o seu container rodando, execute a Api:

    **bash:**
    ```bash
    > yarn run start:dev
    ```

5.  A API estará disponível em http://localhost:3000.