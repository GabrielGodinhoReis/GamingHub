# GamingHub com área de clientes

## Rodar no Windows

Instale o JDK 25 e o Node.js 24.15 ou uma versão mais recente da série 24. Extraia o ZIP inteiro. Abra dois terminais PowerShell na pasta que contém este arquivo.

No primeiro terminal, inicie a API. O Maven Wrapper baixa as dependências na primeira execução.

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

Para usar o painel de administrador, defina as variáveis ADMIN_EMAIL e ADMIN_PASSWORD nesse mesmo terminal **antes** de iniciar a API. Use o e-mail e a senha combinados com o grupo.

```powershell
$env:ADMIN_EMAIL = Read-Host "E-mail do administrador"
$env:ADMIN_PASSWORD = [System.Net.NetworkCredential]::new('', (Read-Host "Senha do administrador" -AsSecureString)).Password
```

No segundo terminal, inicie a loja.

```powershell
cd ecommerceP1
npm.cmd ci
npm.cmd start
```

Abra http://localhost:4200 no navegador. A API atende em http://localhost:8080.

## Demonstrar a parte de clientes

Clique em **Cadastrar** e informe nome, e-mail, CPF de exemplo com 11 dígitos e senha. A loja abre a sessão automaticamente. No ícone **Minha conta**, altere os dados com a senha atual e teste a troca de senha com o CPF cadastrado. Saia e entre com a nova senha. Em **Esqueci minha senha**, o exercício define a senha temporária fixa `Senha1234` e não envia e-mail. Use contas fictícias nesta demonstração. Para excluir uma conta, entre nela e confirme a exclusão em **Minha conta**.

Os sete endpoints do professor estão sob /api/cliente. O login retorna o cookie de sessão. Consultar um perfil existente, editar, trocar a senha e excluir exigem a sessão do titular. O perfil retornado contém apenas código, nome e e-mail. Use o mesmo navegador ou preserve o cookie ao testar por outro cliente HTTP.
