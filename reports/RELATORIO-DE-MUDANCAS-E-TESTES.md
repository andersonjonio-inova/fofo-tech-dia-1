# Relatório de mudanças e testes

## Escopo do rascunho

- portal geral preservado como entrada do curso;
- página pedagógica própria para o Dia 1;
- deck do Dia 1 migrado para Reveal.js;
- Reveal.js e Lucide armazenados localmente;
- área de recursos com função, ação, evidência, contingência e condição de acesso;
- três diagramas SVG ampliáveis;
- lightbox acessível com fechamento visível e pela tecla Esc;
- rotas relativas compatíveis com GitHub Pages;
- próximos encontros sinalizados como em preparação, sem conteúdo inventado;
- imagem conceitual de capa, sem texto, logos ou telas de software;
- ausência de analytics, rastreamento e chamadas ocultas.

## Validação

Validação concluída em 15 de setembro de 2026 com Chromium 151, servidor HTTP local e automação via CDP.

### Itens aprovados

- portal em 1920 × 1080, sem rolagem horizontal;
- página do Dia 1 em 1366 × 768, sem conteúdo cortado;
- apresentação Reveal.js com 36 slides, progresso, numeração e notas;
- navegação por controles e teclado, incluindo avanço de slide;
- preservação dos links diretos por hash;
- temporizador iniciado e reiniciado corretamente;
- lightbox aberto por teclado e fechado pela tecla Esc;
- seis cards de atividades e seis cards de recursos;
- links externos com `rel="noopener noreferrer"`;
- imagens e SVGs sem deformação;
- tablet em 820 × 1180, sem rolagem horizontal;
- celular em 390 × 844, com menu acessível e título dentro da tela;
- CSS, JavaScript, imagens, SVGs e bibliotecas locais respondendo corretamente;
- nenhum erro registrado no console do navegador.

### Falha encontrada e correção

- a primeira inspeção móvel encontrou o título principal ultrapassando a largura da tela;
- a escala tipográfica e a quebra de palavras foram ajustadas;
- o teste móvel foi repetido e aprovado.

### Limitação operacional

O controle visual nativo do navegador do OpenClaw estava indisponível no host. A prova foi executada com Chromium local controlado por CDP, cobrindo as mesmas rotas, resoluções, interações e verificações de console. Um segundo processo de teste ficou preso e foi encerrado sem alterar arquivos ou a publicação. A execução final terminou em 16,5 segundos.

### Evidências locais

As capturas e o relatório estruturado estão em `previews/`, pasta excluída da publicação:

- página inicial;
- página do Dia 1;
- slide em 1920 × 1080 e 1366 × 768;
- diagrama ampliado;
- recurso ampliado;
- versão tablet;
- versão móvel;
- `validation.json`.

## Publicação

Este rascunho está na branch local `tech-redesign-draft`. Nenhum `push` ou alteração no GitHub Pages será realizado sem nova confirmação explícita de Anderson.
