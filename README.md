# FOFO TECH

Portal estático do curso FOFO TECH, preparado para GitHub Pages.

## Estrutura

- `index.html`: portal dos participantes.
- `encontro-1/index.html`: apresentação HTML do Dia 1.
- `assets/`: identidade visual, fotos dos instrutores e recursos do portal.
- `materiais/`: área reservada para fichas e PDFs públicos autorizados.
- `blueprint-dia-1.json`: mapa estrutural da apresentação do Dia 1.

## Rotas previstas

- Portal: `https://andersonjonio-inova.github.io/fofo-tech-dia-1/`
- Dia 1: `https://andersonjonio-inova.github.io/fofo-tech-dia-1/encontro-1/`

## Execução local

Na raiz do projeto, use um servidor HTTP estático. Exemplo:

```bash
python3 -m http.server 8000
```

Abra `http://127.0.0.1:8000/`. Não abra o HTML diretamente por `file://`, pois alguns recursos dependem de uma origem HTTP.

## Atualização segura

1. Confira `git status`, branch e remoto.
2. Preserve a versão anterior antes de editar.
3. Altere apenas os arquivos necessários.
4. Valide portal, apresentação, caminhos, responsividade e console.
5. Revise `git diff` e os arquivos preparados para commit.
6. Publique somente após confirmação explícita de Anderson.
7. Verifique a implantação do GitHub Pages e teste as rotas públicas.

O projeto não requer servidor, banco de dados, framework ou dependência externa obrigatória.
