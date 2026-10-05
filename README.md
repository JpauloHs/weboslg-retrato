# 📺 webOS Portrait Kiosk — Looker Studio para Smart TV LG

Aplicação web e pacote webOS projetados especificamente para forçar Smart TVs LG (comerciais ou residenciais) instaladas na vertical a exibirem dashboards do **Google Looker Studio (Data Studio)** em **modo retrato (9:16 / 1080×1920)** em tela cheia.

---

## 🚀 Como Hospedar no GitHub e Ativar o GitHub Pages (Passo a Passo)

Você pode hospedar este projeto gratuitamente no **GitHub Pages** para gerar um link `https://seu-usuario.github.io/seu-repositorio`, ideal para abrir diretamente no navegador da Smart TV LG.

### Passo 1: Criar o Repositório no GitHub
1. Acesse [github.com/new](https://github.com/new).
2. Dê um nome ao repositório (exemplo: `webos-portrait-looker`).
3. Deixe como **Public** (Público).
4. **Não** marque para adicionar README ou .gitignore (o projeto já contém esses arquivos).
5. Clique em **Create repository**.

### Passo 2: Enviar o Código via Terminal (Git)
No terminal da sua máquina, dentro da pasta deste projeto, execute os comandos:

```bash
# 1. Inicializar o repositório git local
git init

# 2. Adicionar todos os arquivos
git add .

# 3. Criar o primeiro commit
git commit -m "feat: webos portrait kiosk looker studio"

# 4. Definir a branch principal como main
git branch -M main

# 5. Conectar ao seu repositório do GitHub (substitua pelo seu usuário e nome do repo)
git remote add origin https://github.com/SEU_USUARIO/webos-portrait-looker.git

# 6. Enviar os arquivos para o GitHub
git push -u origin main
```

---

### Passo 3: Ativar o GitHub Pages (Hospedagem Automática)
Este repositório já inclui um fluxo de automação pronto em `.github/workflows/deploy.yml`:

1. No seu repositório no GitHub, clique na aba **Settings** (Configurações).
2. No menu lateral esquerdo, clique em **Pages**.
3. Em **Build and deployment > Source**, selecione:
   - **GitHub Actions**
4. Pronto! O GitHub irá compilar o projeto e publicá-lo automaticamente.
5. Em cerca de 1 a 2 minutos, o seu link estará no ar:
   `https://SEU_USUARIO.github.io/webos-portrait-looker/`

---

## 📺 Como Abrir na Smart TV LG (webOS)

1. Ligue a TV LG montada na vertical (suporte de parede 90° ou 270°).
2. Abra o aplicativo nativo **Navegador da Web** (Web Browser).
3. Digite o link gerado pelo GitHub Pages:
   `https://SEU_USUARIO.github.io/webos-portrait-looker/`
4. Na barra superior do navegador da TV, clique no botão de **Tela Cheia** (quadrado ou duas setas).
5. **Dica Pro LG:** Mantenha pressionado o número **1** no controle remoto por 3 segundos para criar um *Quick Access* (Acesso Rápido). A TV ligará direto no painel com 1 toque!

---

## 🎮 Comandos do Controle Remoto LG (Magic Remote)

| Botão / Tecla | Ação |
| :--- | :--- |
| 🟢 **Botão Verde / Enter** | Força o recarregamento dos dados do Looker Studio |
| 🟡 **Botão Amarelo / Setas Cima-Baixo** | Alterna o ângulo de rotação (90° ➔ 270° ➔ 0°) |
| 🔴 **Botão Vermelho / Voltar** | Abre o menu de ajustes (Zoom, Margem de Borda da TV) |
| 🔵 **Botão Azul** | Abre o guia de ajuda e credenciais |
| **Login Google** | Botão na tela para salvar a sessão Google no navegador da TV |

---

## 🛠️ Executar Localmente no Computador

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Gerar build de produção
npm run build
```

---

## 📦 Arquivos Incluídos
- `src/`: Código fonte React 19 + TypeScript + Tailwind CSS
- `vite.config.ts`: Configurado com `base: './'` para compatibilidade com GitHub Pages e subdiretórios
- `.github/workflows/deploy.yml`: Automação de deploy contínuo no GitHub Actions
- `appinfo.json`: Manifesto oficial da LG para empacotamento nativo webOS (.ipk)
