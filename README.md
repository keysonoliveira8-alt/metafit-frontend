# MetaFit — Frontend

App de fitness e nutrição MetaFit. Feito em React + Vite.

## Rodando localmente

```
npm install
npm run dev
```

## Variáveis de ambiente

Copie `.env.example` para `.env` e preencha `VITE_BACKEND_URL` quando o
backend (Railway) estiver pronto. Sem essa variável, o app funciona
normalmente, só os recursos de IA (sugerir refeições, sugerir treino,
analisar foto, assistente) ficam desativados.

## Deploy

Este repositório é feito para ser publicado no Vercel (mesmo fluxo do
Agente Financeiro): conectar o repositório, build command `npm run
build`, output directory `dist`.

## Próximos passos de configuração

1. ✅ Repositório no GitHub
2. Banco de dados (Supabase) — autenticação e persistência real
3. Pagamentos (Stripe) — plano mensal e anual
4. Publicar (Vercel + Railway)
