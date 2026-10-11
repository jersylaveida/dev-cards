# devcards

PWA mobile-first para criar, organizar e revisar flashcards. Os dados ficam no IndexedDB do próprio dispositivo e podem ser exportados como JSON.

## Desenvolvimento

Requer Node.js 20 ou mais recente.

```bash
npm install
npm run dev
```

## Testes e build

```bash
npm test
npm run build
npm run preview
```

O conteúdo de `dist/` é estático e pode ser publicado no Cloudflare Pages ou Vercel. O deploy deve usar HTTPS para que instalação e service worker funcionem corretamente.

### Vercel

O arquivo `vercel.json` já configura o framework Vite, o comando `npm run build`, a saída `dist` e o fallback de rotas necessário para o React Router. No painel da Vercel, importe este repositório do GitHub e clique em **Deploy**; nenhuma variável de ambiente é necessária.

Cada novo push para a branch principal cria automaticamente uma nova implantação de produção. Branches e pull requests recebem URLs de preview.

## Instalar no iPhone

1. Abra a URL publicada no Safari.
2. Toque em **Compartilhar**.
3. Escolha **Adicionar à Tela de Início** e confirme.

Depois do primeiro carregamento completo, o shell do aplicativo funciona offline. Os dados locais do Safari não têm garantia de permanência; exporte backups na tela **Dados** regularmente.

## Arquitetura

- React, TypeScript, Vite, Tailwind e primitivas shadcn/ui.
- React Router para as telas e rotas de detalhe.
- Dexie/IndexedDB por trás de um repositório isolado da interface.
- `vite-plugin-pwa` com manifest, atualização orientada ao usuário e cache offline.
- Validação integral antes de uma importação, transações para operações relacionais e exclusão em cascata de decks.

O MVP não inclui conta, sincronização, algoritmos de repetição espaçada nem garantia de persistência oferecida pelo sistema operacional.
