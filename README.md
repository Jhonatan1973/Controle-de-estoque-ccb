# Controle de Estoque CCB

Este projeto é um sistema de controle de estoque desenvolvido para gerenciar produtos e operações de entrada e saída de itens. A aplicação foi criada utilizando HTML, CSS e JavaScript, e pode ser expandida para incluir funcionalidades de back-end utilizando Node.js e um banco de dados relacional.

## Estrutura do Projeto

A organização dos diretórios e arquivos facilita a manutenção e evolução do sistema:

```markdown
Controle-de-estoque-ccb-main/
├── public/
│   ├── assets/
│   │   ├── css/                   # Arquivos de estilização
│   │   │   ├── buttons/
│   │   │   ├── esconder/
│   │   │   ├── form/
│   │   │   ├── header-components/
│   │   │   ├── modal-adicionar-imob/
│   │   │   ├── modal-adicionar-prod/
│   │   │   ├── modal-alterar-imob/
│   │   │   ├── modal-alterar-quant/
│   │   │   ├── modal-historico-prod/
│   │   │   ├── paglogin/
│   │   │   ├── table/
│   │   │   └── transition/
│   │   │
│   │   ├── img/                   # Pasta de imagens
│   │   │
│   │   ├── js/                    # Scripts JavaScript
│   │   │   ├── imobilizado-component/
│   │   │   ├── paglogin/
│   │   │   ├── header.js
│   │   │   ├── historicomodal.js
│   │   │   ├── input.js
│   │   │   ├── main.js
│   │   │   └── modtab.js
│
├── pags/                           # Páginas adicionais
│
├── index.html                       # Página principal
├── vercel.json                       # Configuração do Vercel
├── .gitignore                        # Ignorar arquivos no Git
## Tecnologias Utilizadas

- **HTML5**
- **CSS3**
- **JavaScript**
- **Node.js**
- **Vercel**
- **MySQL**

## Funcionalidades

- **Gestão de Produtos:** Adição, remoção e atualização dos itens em estoque.
- **Interface Interativa:** Desenvolvida com uma abordagem simples e eficiente em HTML, CSS e JavaScript.
- **Registro de Operações:** Histórico de alterações realizado com base na identificação do usuário.

## Como Executar

### Front-end
1. **Clone o repositório:**
   ```bash
   git clone https://github.com/Jhonatan1973/Controle-de-estoque-ccb.git

	2.	Abra o arquivo index.html em seu navegador para visualizar a interface.

Back-end (se aplicável)
	1.	Instale as dependências:

npm install


	2.	Inicie o servidor:

node server.js



Melhorias Futuras
	•	Implementação de sistema de autenticação para acesso seguro.
	•	Desenvolvimento de um painel administrativo com gráficos e relatórios.
	•	Integração com um banco de dados para persistência dos dados.

Contribuição

Contribuições são bem-vindas! Para colaborar com este projeto:
	1.	Faça um fork do repositório.
	2.	Crie uma branch para sua feature:
git checkout -b minha-nova-feature
	3.	Realize commitst com suas alterações:
git commit -m 'Minha nova feature'
	4.	Envie a branch:
git push origin minha-nova-feature
	5.	Abra um Pull Request.

Licença

Este projeto está licenciado sob a licença MIT. Consulte o arquivo LICENSE para mais detalhes.

⸻

Este README visa fornecer uma visão geral completa da estrutura e funcionamento do projeto. Se tiver dúvidas ou sugestões, sinta-se à vontade para abrir uma issue ou entrar em contato!
