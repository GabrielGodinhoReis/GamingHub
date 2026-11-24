# Gaming Hub — Guia de instalação e utilização

O Gaming Hub é uma loja virtual de jogos digitais que possui uma área para clientes e um painel administrativo. Neste documento, você encontrará instruções para iniciar o projeto e testar suas principais funcionalidades.

## 1. O que é necessário para executar o projeto?

Antes de começar, instale os seguintes programas:

- **JDK 25:** necessário para executar o backend.
- **Node.js 24.15 ou superior da série 24:** necessário para executar o frontend.

Após instalar os programas, extraia o ZIP completo do projeto em uma pasta do computador.

## 2. Como iniciar o Gaming Hub?

O projeto possui duas partes que precisam funcionar ao mesmo tempo: o backend, responsável pelo processamento das informações, e o frontend, que apresenta a loja na tela.

### Primeiro terminal — Iniciar o backend

Abra o PowerShell na pasta principal do projeto e execute:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

Aguarde até que o Spring Boot termine de iniciar. Na primeira execução, o sistema poderá demorar um pouco porque precisa baixar algumas dependências.

### Configurar o administrador

Antes de iniciar o backend, é necessário configurar o e-mail e a senha do administrador.

Execute estes comandos no mesmo terminal:

```powershell
$env:ADMIN_EMAIL = Read-Host "E-mail do administrador"
$env:ADMIN_PASSWORD = [System.Net.NetworkCredential]::new('', (Read-Host "Senha do administrador" -AsSecureString)).Password
```

Informe as credenciais combinadas pelo grupo.

**Importante:** essas informações precisam ser configuradas novamente quando uma nova sessão do PowerShell for aberta.

### Segundo terminal — Iniciar a loja

Abra outro PowerShell na pasta principal do projeto e execute:

```powershell
cd ecommerceP1
npm.cmd ci
npm.cmd start
```

O primeiro comando instala as dependências necessárias. Depois, o projeto será iniciado.

Quando tudo estiver funcionando, acesse:

http://localhost:4200

O backend estará disponível em:

http://localhost:8080

## 3. Como utilizar a área de clientes?

A loja permite que cada pessoa crie sua própria conta para realizar compras e gerenciar suas informações.

### Criar uma conta

1. Acesse a loja.
2. Clique em **Cadastrar**.
3. Informe nome, e-mail, CPF de exemplo com 11 dígitos e senha.
4. Após concluir o cadastro, o sistema abre a conta automaticamente.

Utilize somente informações fictícias durante os testes.

### Minha conta

Depois de entrar na loja, clique no ícone **Minha conta**.

Nessa área, o cliente pode:

- Consultar seus dados.
- Alterar nome e e-mail.
- Modificar a senha utilizando a senha atual.
- Excluir sua própria conta.

### Alterar a senha

Para testar a alteração de senha, acesse Minha conta, informe a senha atual e cadastre uma nova senha.

Depois, saia da conta e tente entrar novamente utilizando a nova senha.

### Esqueci minha senha

Caso o cliente esqueça a senha, poderá utilizar a opção **Esqueci minha senha**.

Para este projeto demonstrativo, a recuperação define uma senha temporária fixa: `Senha1234`.

Não existe envio de e-mail nesse processo. Após recuperar o acesso, o cliente pode utilizar a senha temporária para entrar.

### Sair da conta

Utilize a opção de sair para encerrar sua sessão.

## 4. Como funciona a área administrativa?

Diferentemente dos clientes, os administradores não possuem um cadastro público na loja.

O acesso é controlado pelo backend, que reconhece o administrador por meio do e-mail e da senha configurados anteriormente.

Após realizar o login com as credenciais administrativas:

- O sistema identifica o usuário como administrador.
- O acesso ao painel administrativo é liberado.
- O administrador pode gerenciar os jogos cadastrados na loja.

Clientes comuns não possuem autorização para acessar essas funcionalidades.

## 5. Como funciona a segurança das contas?

O Gaming Hub utiliza um sistema de sessão para reconhecer quem está conectado.

Depois do login, o navegador recebe um identificador de sessão. Esse identificador é enviado nas próximas solicitações para que o backend reconheça o usuário.

Isso permite proteger informações pessoais e controlar o acesso às funcionalidades.

Por exemplo, um cliente pode consultar e alterar seus próprios dados, mas não pode modificar a conta de outro cliente.

## 6. Observações importantes

- Os testes devem ser realizados com contas fictícias.
- Para testar operações de conta, utilize o mesmo navegador em que realizou o login.
- Caso utilize o Postman, é necessário preservar o cookie de sessão.
- O administrador precisa ter suas credenciais configuradas antes de iniciar o backend.
- A senha temporária da recuperação de conta é fixa e serve apenas para demonstração.

## 7. Conclusão

O Gaming Hub reúne funcionalidades de uma loja virtual, permitindo que clientes criem e gerenciem suas contas, enquanto administradores possuem acesso exclusivo ao gerenciamento dos jogos.

O projeto foi desenvolvido com separação entre frontend e backend, permitindo que a interface e o processamento das informações trabalhem em conjunto.