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

Validação inicial concluída em 15 de setembro de 2026 e repetida após a revisão pedagógica de 16 de setembro de 2026, com Chromium 151, servidor HTTP local e automação via CDP.

### Itens aprovados

- portal em 1920 × 1080, sem rolagem horizontal;
- página do Dia 1 em 1366 × 768, sem conteúdo cortado;
- apresentação Reveal.js com 44 slides, progresso, numeração e notas;
- navegação por controles e teclado, incluindo avanço de slide;
- preservação dos links diretos por hash;
- temporizador iniciado e reiniciado corretamente;
- lightbox aberto por teclado e fechado pela tecla Esc;
- seis cards de atividades e sete cards de recursos;
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
- telas da problematização no Mentimeter, dos fundamentos Enfam e do funcionamento do Mentimeter.
- telas do conceito, das funcionalidades e do laboratório NotebookLM.

### Ampliação com NotebookLM

Em 16 de setembro de 2026, foram acrescentados cinco slides após o laboratório de Loop: conceito, arquitetura, funcionalidades, fluxo verificável e laboratório FOFO do NotebookLM. O bloco preserva a sequência técnico-pedagógica e desloca os slides posteriores sem alterar sua ordem relativa.

## Publicação

A versão inicial foi publicada por autorização de Anderson em 15 de setembro de 2026. A revisão de 16 de setembro, com o novo percurso pedagógico e o Mentimeter, teve publicação autorizada diretamente por Anderson no grupo FOFO TECH.

- repositório: `andersonjonio-inova/fofo-tech-dia-1`;
- branch e origem do Pages: `main` e raiz `/`;
- commit da implementação inicial: `9933b91`;
- commit da revisão do Dia 1: `6b1b73d`;
- commit da remoção dos antigos slides 5 a 9: `08d3b84`;
- commit da inserção do diagnóstico no novo slide 5: `2c306b3`;
- commit da inserção do momento de apresentação pessoal com QR do WhatsApp no slide 6: `bc905a0`;
- commit da atualização do QR e reposicionamento da apresentação pessoal no slide 5: `0e59179`;
- commit da inclusão da sequência de cinco slides sobre NotebookLM: `d65b831`;
- portal: `https://andersonjonio-inova.github.io/fofo-tech-dia-1/`;
- página do Dia 1: `https://andersonjonio-inova.github.io/fofo-tech-dia-1/dia-1/`;
- apresentação: `https://andersonjonio-inova.github.io/fofo-tech-dia-1/encontro-1/`.

Após a implantação, as três rotas, folhas de estilo, scripts, imagem conceitual, diagramas, Reveal.js e Lucide responderam com HTTP 200. As assinaturas da versão nova foram confirmadas no conteúdo público com cache isolado.
