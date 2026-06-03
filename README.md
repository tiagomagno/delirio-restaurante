# Delírio Tropical — Site Estático Local

Versão estática local do site [delirio.com.br](https://delirio.com.br/), criada via web scraping para servir de base para a migração futura para **Node.js + Next.js**.

## 🗂️ Estrutura

```
delirio-restaurante/
├── index.html              ← Home completa
├── sobre-nos.html          ← (a criar)
├── lojas.html              ← (a criar)
├── fale-conosco.html       ← (a criar)
├── assets/
│   ├── css/style.css       ← Design system global
│   └── js/main.js          ← Interatividade
└── README.md
```

## 🚀 Como rodar

Basta abrir o `index.html` diretamente no navegador. Não requer servidor local para esta versão estática.

Para uma experiência melhor (com parallax e assets), prefira usar um servidor local:

```bash
# Python
python -m http.server 3000

# Node (npx)
npx serve .
```

Então acesse: **http://localhost:3000**

## 📦 Seções da Home

- ✅ **Header** — Logo + navegação + menu mobile
- ✅ **Hero** — Banner full-screen com imagem e CTA de cardápio
- ✅ **Lojas** — Grid responsivo com 10 lojas (mapa, delivery, cardápio)
- ✅ **Encomendas** — Banner com links para encomendas e eventos
- ✅ **Destaque** — Grid de imagens dos pratos
- ✅ **Sobre** — Seção "Desde 1983" com imagem histórica
- ✅ **Footer** — Links + redes sociais (Instagram, Facebook, WhatsApp)

## 🔄 Próximo Passo

Migrar para **Next.js + Node.js** usando o workflow `/nodejs-nextjs`.

## 🌐 Imagens

As imagens são servidas diretamente do CDN do `delirio.com.br`. Para produção, baixe e hospede localmente com:

```bash
wget https://delirio.com.br/wp-content/uploads/2023/05/logo-delirio.webp -O assets/images/logo.webp
```
