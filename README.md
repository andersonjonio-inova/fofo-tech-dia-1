# FOFO TECH

Portal estático do curso FOFO TECH, organizado por dias, apresentações, atividades, recursos e materiais. O projeto foi preparado para GitHub Pages e não depende de servidor, banco de dados ou processamento de back-end.

## Rotas

- Portal: `./index.html`
- Página pedagógica do Dia 1: `./dia-1/index.html`
- Apresentação do Dia 1: `./encontro-1/index.html`
- Relatórios e mapas: `./reports/`
- Materiais públicos autorizados: `./materiais/`

## Estrutura

```text
.
├── index.html
├── dia-1/
│   └── index.html
├── encontro-1/
│   └── index.html
├── assets/
│   ├── portal.css
│   ├── portal.js
│   ├── slides.css
│   ├── slides.js
│   ├── diagramas/
│   └── imagens/
├── vendor/
│   ├── reveal/
│   └── lucide/
├── materiais/
├── reports/
└── previews/
```

## Execução local

Na raiz do projeto:

```bash
python3 -m http.server 8000
```

Abra `http://127.0.0.1:8000/`.

## Apresentação

- Setas, espaço e swipe: navegar.
- `O`: visão geral.
- `F`: tela cheia.
- `S` ou `N`: notas do apresentador.
- `T`: iniciar ou pausar o temporizador.
- `R`: reiniciar o temporizador.

O Reveal.js e o Lucide são servidos localmente em `vendor/`. As licenças originais estão preservadas nas respectivas pastas.

## Atualização segura

1. Confira `git status`, branch e remoto.
2. Preserve uma referência recuperável antes de editar.
3. Altere o arquivo canônico e somente os assets necessários.
4. Valide portal, página do dia, apresentação, caminhos e console.
5. Revise `git diff` e os arquivos preparados para commit.
6. Faça `push` somente após confirmação explícita de Anderson no contexto atual.
7. Verifique o GitHub Pages diretamente antes de declarar a nova versão pronta.

## Estado editorial

Somente o Dia 1 está consolidado. Próximos dias aparecem como conteúdo em preparação, sem objetivos, ferramentas ou materiais presumidos.
