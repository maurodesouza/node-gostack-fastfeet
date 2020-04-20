<h1 align="center">
    <img alt="GoStack" src="https://rocketseat-cdn.s3-sa-east-1.amazonaws.com/bootcamp-header.png" width="200px" />
</h1>

<div align="center">
  <h3>
    Código do desafio do 2° e 3° Módulo do Bootcamp - GoStack
  </h3>
</div>
&nbsp;

<p align="center">
  <a href="#rocket-sobre-o-desafio">Sobre o desafio</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#star-funcionalidades">Funcionalidades</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#fire-principais-tecnologias">Principais tecnologias</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#memo-licença">Licença</a>
</p>

## :rocket: Sobre o desafio

Criar uma aplicação completa (Back-end, Front-end e Mobile) para uma distribuidora, a **FastFeet** :truck: :truck:

A primeira parte é criar o back end da dessa distribuidora utilizando [Nodejs](https://nodejs.org/en/) :tada:

![App gif](.github/app.gif)

## :star: Funcionalidades ###

Na parte da web foram criadas as funcionalidades referentes ao administrador da distribuidora. Enquanto as funcionalidades dos entregadores dessa distribuidora foram feitas na parte mobile :iphone: :iphone:

Para ver o projeto web :point_right: [Clique Aqui](https://github.com/maurodesouza/react-gostack-fastfeet) :point_left:

Para ver o projeto mobile :point_right: [Clique Aqui](https://github.com/maurodesouza/mobile-gostack-fastfeet) :point_left:

#### Funcionalidades do administrador: ####

- O administrador pode se `autenticar` na aplicação utilizando e-mail e uma senha.
&nbsp;
- Gerenciamento de `encomendas, entregadores e destinatários` - o administrador pode:
  - Cadastrar;
  - Atualizar;
  - Listar;
  - Deletar;
&nbsp;
- Gerenciamento de `problemas` - o administrador pode:
  - Listar todas as entregas com algum problema;
  - Listar todos os problemas de uma encomenda, baseado no ID da encomenda;
  - Cancelar uma entrega, baseado no ID do problema;
&nbsp;
- Todas as paginas de listagem possuem `paginação` e um `campo para pesquisa`.

#### Funcionalidades do entregador: ####
- O entregador pode acessar a aplicação informando o seu id de cadastro;
&nbsp;
- Visualizar as encomendas - o entregador pode visualizar as encomendas atribuídas a ele, que não estejam entregues ou canceladas;
&nbsp;
- Alterar o status das encomendas - o entregador pode alterar o status incluindo uma data de retirada e uma data de entrega para as encomendas, sendo que:
  - O entregador só pode fazer 5 retiradas por dia;
  - Ao finalizar uma entrega, o entregador deve enviar uma imagem como assinatura;
&nbsp;
- Visualizar e cadastrar problemas nas entregas;

Para instalar e executar o projeto você precisa:

1. Fazer um clone desse repositório;
2. Entrar na pasta rodando `cd node-gostack-fastfeet`;
3. Rodar `yarn` para instalar as dependências;
4. Ter um bando de dados `Postgres` rodando;
5. Ter um bando de dados `Redis` rodando;
6. Criar um arquivo `.env` da raiz do projeto e preencher as variáveis de acordo com o arquivo `.env.example`;
7. Rodar `yarn sequelize db:create` para criar uma database;
8. Rodar `yarn sequelize db:migrate` para criar as migrations;
9. Rodar `yarn sequelize db:seed:all` para criar as seeds;
10. Rodar `yarn dev` para inicializar a aplicação;
11. Rodar `yarn queue` para inicializar o servidor de envio de emails;

Você pode criar os bancos de dados utilizando o `docker`:

`docker run --name nomeDoContainer -e POSTGRES_PASSWORD=umaSenha -p 5432:5432 -d postgres`

`docker run --name nomeDoContainer -p 6379:6379 -d -t redis:alpine`

Para mais detalhes sobre o desafio de cada módulo, veja:

- Desafio do Módulo 2 - **:point_right: [Clique Aqui](https://github.com/Rocketseat/bootcamp-gostack-desafio-02/blob/master/README.md#desafio-02-iniciando-aplicação) :point_left:**
- Desafio do Módulo 3 - **:point_right: [Clique Aqui](https://github.com/Rocketseat/bootcamp-gostack-desafio-03/blob/master/README.md#desafio-03-continuando-aplicação) :point_left:**

*OBS: O projeto é para uma distribuidora fictícia* :wink:

## **:fire: Principais tecnologias**

- **[Express](https://expressjs.com)**
- **[Sequelize](https://sequelize.org)**
- **[Husky](https://www.npmjs.com/package/husky/v/3.0.0)**
- **[Nodemon](https://www.npmjs.com/package/nodemon)**
- **[Docker](https://docker.com)**
- **[Postgres](https://www.postgresql.org)**
&nbsp;

Veja o arquivo [Package](package.json) para mais detalhes.

## **:memo: Licença**

Esse projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE.md) para mais detalhes.

---
Feito com :heart: by Mauro de Souza - Email: maurodesouza2017@hotmail.com
