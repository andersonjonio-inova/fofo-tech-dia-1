import fs from 'node:fs/promises';

const destination = new URL('../encontro-2/index.html', import.meta.url);

const note = text => text.replaceAll('"', '&quot;');
const section = (topic, title, body, speakerNote) => `<section data-topic="${topic}" data-title="${title}" data-note="${note(speakerNote)}">${body}</section>`;
const heading = (number, title, body = '') => `<span class="kicker">${number}</span><h2>${title}</h2>${body}`;
const lead = text => `<p class="lead">${text}</p>`;
const cards = (items, cols = 3) => `<div class="grid" style="--cols:${cols}">${items.map(([title, text, kind = '']) => `<div class="card ${kind}"><b>${title}</b><p>${text}</p></div>`).join('')}</div>`;
const checks = items => `<div class="check">${items.map(item => `<div>${item}</div>`).join('')}</div>`;
const steps = items => `<div class="flow">${items.map(([label, text], index) => `<div class="step${index === items.length - 1 ? ' hot' : ''}"><span>${label}</span>${text}</div>`).join('')}</div>`;
const table = (headers, rows) => `<table class="matrix"><thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
const chapter = (topic, number, title, subtitle) => section(topic, `${number} ${title}`, `<span class="kicker">${number}</span><h2>${title}</h2>${lead(subtitle)}`, `Apresente o capítulo ${number} com a mesma estrutura do guia. Use este slide apenas como transição e antecipe os subtítulos que serão percorridos.`);

const slides = [];

slides.push(`<section class="cover" data-topic="0" data-title="Capa" data-note="Apresente o Dia 2 como estudo do Guia FOFO de uso pedagógico do Microsoft 365. Informe que a sequência dos slides acompanha os capítulos e subtítulos do documento."><div class="cover-grid"><div><span class="kicker">TJRS · Centro de Formação e Desenvolvimento de Pessoas</span><h1>Guia FOFO<span>de uso pedagógico do Microsoft 365</span></h1><p class="lead">Forms, Whiteboard, Loop, Teams e SharePoint na elaboração de cursos.</p><span class="pill">Dia 2 · FOFO TECH</span></div><div class="logo-stage"><img src="../assets/logo-cjud.jpg" alt="Logo do CJUD"></div></div></section>`);

slides.push(section(0, '1. Apresentação', heading('1. Apresentação', 'Finalidade do guia', lead('O guia apresenta cinco ferramentas do Microsoft 365 que podem apoiar a elaboração e a realização de cursos.')) + cards([
  ['Microsoft Teams', 'Ambiente de comunicação e colaboração.'],
  ['Microsoft Forms', 'Formulários, questionários e coleta de respostas.'],
  ['Microsoft Whiteboard', 'Tela visual colaborativa.'],
  ['Microsoft Loop', 'Componentes, páginas e espaços de coautoria.'],
  ['Microsoft SharePoint', 'Sites, páginas, bibliotecas e memória institucional.']
], 3), 'Apresente as cinco ferramentas exatamente como delimitadas pelo guia. Explique que os capítulos seguintes mantêm a mesma estrutura para facilitar comparação.'));

slides.push(section(0, '1. Apresentação: ponto de partida', heading('1. Apresentação', 'O ponto de partida não é a ferramenta', lead('A tecnologia deve ser selecionada somente quando melhorar pelo menos um aspecto da experiência.')) + cards([
  ['Ação do participante', 'O que a pessoa fará para aprender.'],
  ['Interação e colaboração', 'Como pessoas e grupos trabalharão.'],
  ['Produção de evidências', 'O que tornará a aprendizagem observável.'],
  ['Qualidade do feedback', 'Como o retorno apoiará melhoria.'],
  ['Acesso e percurso', 'Como materiais e etapas serão encontrados.'],
  ['Acompanhamento', 'Como aprendizagem e transferência serão monitoradas.']
], 3), 'Leia os critérios do guia e peça um exemplo breve para um deles. Evite acrescentar novas categorias; use a formulação do documento.'));

slides.push(section(0, '1. Apresentação: cadeia FOFO', heading('1. Apresentação', 'Na perspectiva FOFO, o planejamento segue esta cadeia') + `<div class="formula"><div>Necessidade profissional</div><div>Capacidade</div><div>Objetivo</div><div>Conteúdo</div><div>Experiência</div><div>Evidência</div><div>Feedback</div><div>Transferência</div></div>` + lead('Abrir um aplicativo, participar de uma reunião ou responder a um formulário não comprova aprendizagem.'), 'Percorra a cadeia do guia da esquerda para a direita. Reforce que é preciso observar o que o participante compreendeu, decidiu, produziu, justificou, revisou ou aplicou.'));

slides.push(section(0, '2. Como as ferramentas se integram', heading('2. Como as ferramentas se integram', 'Função predominante no curso') + table(['Ferramenta', 'Função predominante', 'Principal contribuição pedagógica'], [
  ['Teams', 'Ambiente do curso', 'Comunicação, encontros, organização dos grupos e continuidade'],
  ['SharePoint', 'Página inicial e acervo', 'Curadoria, arquitetura da informação e memória do curso'],
  ['Loop', 'Espaço de produção', 'Coautoria, registro do raciocínio, feedback e revisão'],
  ['Whiteboard', 'Pensamento visual', 'Problematização, relações, hipóteses, critérios e decisões'],
  ['Forms', 'Coleta estruturada', 'Diagnóstico, recuperação ativa, avaliação e acompanhamento']
]), 'Apresente a tabela do guia sem transformar as funções em regras rígidas. Elas indicam uma arquitetura integrada possível.'));

slides.push(section(0, '2. Como as ferramentas se integram: fluxo', heading('2. Como as ferramentas se integram', 'Uma arquitetura integrada pode funcionar assim') + steps([
  ['1', 'Entrar no Teams e localizar o percurso'],
  ['2', 'Consultar página e acervo no SharePoint'],
  ['3', 'Responder ao diagnóstico no Forms'],
  ['4', 'Problematizar no Whiteboard'],
  ['5', 'Construir solução no Loop'],
  ['6', 'Publicar, receber feedback e registrar aplicação']
]), 'Apresente o fluxo na ordem do documento: Teams, SharePoint, Forms, Whiteboard, Loop, publicação, feedback e aplicação no trabalho.'));

slides.push(chapter(1, '3.', 'Microsoft Teams', 'O Teams reúne equipes, canais, conversas, reuniões, arquivos, páginas e aplicativos.'));

slides.push(section(1, '3.1 O que é', heading('3.1 O que é', 'Microsoft Teams') + cards([
  ['Equipes', 'Organizam membros e recursos persistentes.'],
  ['Canais', 'Organizam interações por tema, projeto ou finalidade.'],
  ['Reuniões', 'Sustentam encontros síncronos com políticas e papéis.'],
  ['Arquivos, páginas e aplicativos', 'Conectam materiais, produções e serviços ao ambiente.']
], 4) + lead('Canais podem ser padrão, privados ou compartilhados, conforme configuração e política institucional.'), 'Explique equipes, canais e reuniões conforme o guia. Não presuma disponibilidade de canais compartilhados ou colaboração externa; marque como dependência institucional.'));

slides.push(section(1, '3.2 Finalidade pedagógica', heading('3.2 Finalidade pedagógica', 'Ambiente persistente de aprendizagem') + checks([
  'Conectar a preparação anterior ao encontro.',
  'Articular atividades síncronas e interação assíncrona.',
  'Apoiar produção individual ou coletiva.',
  'Organizar feedback e avaliação.',
  'Acompanhar a transferência para o trabalho.'
]) + lead('O Teams não deve funcionar apenas como sala de videoconferência ou depósito de arquivos.'), 'Mantenha a formulação do guia. Peça ao grupo que diferencie ambiente persistente, sala de reunião e depósito de arquivos.'));

slides.push(section(1, '3.3 Possibilidades de uso', heading('3.3 Possibilidades de uso', 'Microsoft Teams') + cards([
  ['Acolhimento e orientação', 'Comunicação inicial e percurso.'],
  ['Módulos e temas', 'Organização em canais.'],
  ['Debates e encontros', 'Casos, reuniões e pequenos grupos.'],
  ['Materiais e coautoria', 'Compartilhamento e produção.'],
  ['Feedback e projetos', 'Revisão e acompanhamento.'],
  ['Comunidade de prática', 'Continuidade depois do curso.']
], 3), 'Percorra as possibilidades na mesma ordem do guia. Solicite exemplos apenas depois de apresentar a lista.'));

slides.push(section(1, '3.4 Relação com o plano de curso', heading('3.4 Relação com o plano de curso', 'Microsoft Teams') + table(['Elemento', 'Aplicação no guia'], [
  ['Conteúdos', 'Páginas, casos, textos, vídeos, modelos, referências e sínteses organizados em canais'],
  ['Procedimentos metodológicos', 'Estudo de caso, sala de aula invertida, problemas, debate, instrução por pares, oficinas e projetos'],
  ['Tempo estimado', 'Preparação, encontro síncrono, produção, feedback, revisão e acompanhamento posterior'],
  ['Recursos didáticos', 'Canais, publicações, reuniões, arquivos, Loop, Forms, Whiteboard, SharePoint e links externos'],
  ['Proposta de avaliação', 'Produtos, decisões justificadas, colaboração, revisão e aplicação no trabalho']
]), 'Apresente a relação do Teams com cada campo do plano de curso. Preserve a distinção entre recurso, procedimento e evidência.'));

slides.push(section(1, '3.5 Passo a passo de configuração (1/2)', heading('3.5 Passo a passo de configuração', 'Preparação do ambiente') + checks([
  'Defina público, necessidade profissional e duração do curso.',
  'Confirme o proprietário da equipe, membros e convidados.',
  'Verifique licença, tenant e políticas institucionais.',
  'Crie apenas os canais necessários.',
  'Escolha o tipo de canal conforme público e sensibilidade.',
  'Use nomes e descrições que indiquem a finalidade.'
]), 'Apresente os seis primeiros passos do guia. Oriente a marcar licença, política e colaboração externa como confirmadas ou a confirmar.'));

slides.push(section(1, '3.5 Passo a passo de configuração (2/2)', heading('3.5 Passo a passo de configuração', 'Organização, teste e encerramento') + checks([
  'Publique anúncio inicial com objetivo, percurso e regras.',
  'Adicione somente as abas essenciais.',
  'Organize arquivos em pastas ou bibliotecas compreensíveis.',
  'Configure reuniões, papéis, lobby, chat, legendas e gravação.',
  'Teste com perfil equivalente ao participante, pelo celular e navegador.',
  'Defina encerramento, arquivamento ou manutenção do ambiente.'
]), 'Apresente os passos finais do guia. Gravação e transcrição dependem de licença, política, finalidade e informação adequada.'));

slides.push(section(1, '3.6 Modelo de anúncio inicial (1/2)', heading('3.6 Modelo de anúncio inicial', 'Comece aqui | Orientações para este canal') + `<div class="case">Este canal será utilizado para desenvolver uma atividade baseada em uma situação real do trabalho.</div>` + checks([
  'Consulte o material indicado.',
  'Analise o caso apresentado.',
  'Registre sua decisão e justificativa.',
  'Comente a produção de um colega utilizando os critérios.'
]), 'Leia o título, a finalidade e os quatro primeiros passos do modelo de anúncio inicial do guia.'));

slides.push(section(1, '3.6 Modelo de anúncio inicial (2/2)', heading('3.6 Modelo de anúncio inicial', 'Produto, tempo e critérios') + checks([
  'Revise sua resposta.',
  'Publique uma síntese do que mudou em seu entendimento.',
  'Produto esperado: decisão fundamentada e revisada.',
  'Tempo estimado: 60 minutos.',
  'Critérios: pertinência, fundamentação, viabilidade, uso das fontes e qualidade da revisão.'
]), 'Complete o modelo do guia. Mostre que a publicação inclui ação, produto, tempo e critérios, não apenas um link.'));

slides.push(section(1, '3.7 Cuidados', heading('3.7 Cuidados', 'Microsoft Teams') + checks([
  'Muitos canais aumentam a carga cognitiva.',
  'Arquivos soltos não formam uma trilha.',
  'Reuniões expositivas extensas reduzem a participação.',
  'Gravação e transcrição dependem de licença, política e consentimento.',
  'Convidados podem ter acesso limitado a aplicativos.',
  'Dados pessoais, processuais ou sensíveis exigem necessidade e autorização.'
]), 'Apresente os cuidados exatamente na ordem do guia. Diferencie conveniência técnica de permissão institucional.'));

slides.push(chapter(2, '4.', 'Microsoft Forms', 'O Forms permite criar formulários e questionários, coletar respostas, visualizar resultados e exportar dados.'));

slides.push(section(2, '4.1 O que é', heading('4.1 O que é', 'Microsoft Forms') + cards([
  ['Escolha e texto', 'Respostas fechadas ou abertas.'],
  ['Avaliação, data e classificação', 'Percepção, registro temporal e ordenação.'],
  ['Likert e NPS', 'Escalas estruturadas.'],
  ['Upload e seções', 'Envio de arquivo e organização do instrumento.']
], 4) + lead('A ferramenta oferece visualização para computador e celular.'), 'Apresente os tipos de pergunta listados no guia. Não associe automaticamente um tipo de item a evidência de aprendizagem.'));

slides.push(section(2, '4.2 Finalidade pedagógica', heading('4.2 Finalidade pedagógica', 'Respostas que apoiam uma decisão pedagógica') + cards([
  ['Identificar', 'Conhecimentos prévios e concepções equivocadas.'],
  ['Adaptar', 'Mediação, exemplos, ritmo e agrupamentos.'],
  ['Verificar', 'Compreensão e recuperação ativa.'],
  ['Devolver', 'Feedback formativo.'],
  ['Acompanhar', 'Transferência para o trabalho.']
], 3) + lead('Responder ao formulário ou obter uma nota não comprova, isoladamente, aplicação do conhecimento.'), 'Mantenha a finalidade formulada pelo guia. Diferencie resposta, nota e capacidade de aplicação.'));

slides.push(section(2, '4.3 Formulário ou questionário', heading('4.3 Formulário ou questionário', 'Escolha conforme a finalidade') + table(['Recurso', 'Mais indicado para'], [
  ['Formulário', 'Diagnóstico, levantamento, reflexão, autoavaliação, avaliação da atividade e acompanhamento'],
  ['Questionário', 'Situações com respostas esperadas, pontuação ou feedback automático']
]), 'Apresente a distinção do documento sem transformá-la em regra absoluta. O objetivo e a evidência esperada orientam a escolha.'));

slides.push(section(2, '4.4 Possibilidades de uso', heading('4.4 Possibilidades de uso', 'Microsoft Forms') + cards([
  ['Antes ou no início', 'Diagnóstico inicial e pergunta de entrada.'],
  ['Durante', 'Votação, questão conceitual, instrução por pares e estudo de caso.'],
  ['Ao final', 'Ticket de saída, autoavaliação e quiz formativo.'],
  ['Depois', 'Avaliação de satisfação e acompanhamento pós-curso.']
], 4) + lead('Avaliação da aprendizagem e avaliação da atividade são finalidades diferentes.'), 'Percorra as possibilidades do guia. Use o exemplo: gostar do curso mede percepção ou satisfação, não demonstra aprendizagem.'));

slides.push(section(2, '4.5 Relação com o plano de curso', heading('4.5 Relação com o plano de curso', 'Microsoft Forms') + table(['Elemento', 'Aplicação no guia'], [
  ['Conteúdos', 'Conceitos, critérios e situações mobilizados nas perguntas'],
  ['Procedimentos metodológicos', 'Recuperação ativa, instrução por pares, casos, diagnóstico e autoavaliação'],
  ['Tempo estimado', 'Acesso, leitura, resposta, análise, devolutiva e revisão'],
  ['Recursos didáticos', 'Formulário, caso, dispositivo, conexão e alternativa acessível'],
  ['Proposta de avaliação', 'Evidências parciais combinadas com justificativas, decisões, produtos ou exemplos']
]), 'Apresente a relação entre o Forms e o plano de curso. Reforce que a resposta estruturada pode precisar de evidência complementar.'));

slides.push(section(2, '4.6 Passo a passo de configuração (1/2)', heading('4.6 Passo a passo de configuração', 'Objetivo, estrutura e perguntas') + checks([
  'Defina qual decisão as respostas informarão.',
  'Acesse o Forms e selecione novo formulário ou novo questionário.',
  'Insira título, descrição e finalidade da coleta.',
  'Adicione perguntas alinhadas ao objetivo.',
  'Evite solicitar informações desnecessárias.',
  'Em questionários, configure resposta correta, pontuação e feedback.'
]), 'Apresente a primeira metade do fluxo de configuração do guia. A decisão pedagógica vem antes do acesso ao aplicativo.'));

slides.push(section(2, '4.6 Passo a passo de configuração (2/2)', heading('4.6 Passo a passo de configuração', 'Fluxo, público e teste') + checks([
  'Use seções quando houver diferentes blocos.',
  'Utilize ramificação somente para perguntas posteriores.',
  'Configure público, período e identificação.',
  'Verifique se haverá uma resposta por pessoa.',
  'Visualize no computador e no celular.',
  'Faça resposta de teste e verifique registro, feedback e permissões.',
  'Planeje a devolutiva dos resultados.'
]), 'Apresente a segunda metade do fluxo. A ramificação avança para perguntas ou seções posteriores. Teste conta externa quando for aplicável.'));

slides.push(section(2, '4.7 Como elaborar boas perguntas', heading('4.7 Como elaborar boas perguntas', 'Uma boa pergunta deve') + checks([
  'Estar alinhada ao objetivo.',
  'Usar linguagem simples e contexto suficiente.',
  'Evitar pistas involuntárias.',
  'Exigir raciocínio compatível com a aprendizagem esperada.',
  'Produzir informação capaz de orientar uma decisão.'
]) + lead('Em múltipla escolha, alternativas incorretas devem ser plausíveis e representar erros reais.'), 'Apresente os critérios do guia. Diferencie dificuldade artificial de raciocínio relevante.'));

slides.push(section(2, '4.7 Exemplo', heading('4.7 Como elaborar boas perguntas', 'Exemplo do guia') + `<div class="case">Uma equipe utiliza uma tecnologia nova, mas apenas reproduz o procedimento anterior em meio digital. Qual ação melhor caracteriza aprendizagem com potencial de transformação?</div>` + table(['Alternativa', 'Resposta'], [
  ['A', 'Registrar que todos acessaram a ferramenta.'],
  ['B', 'Comparar o procedimento anterior e o novo, usando critérios para justificar uma mudança.'],
  ['C', 'Solicitar que assistam novamente ao tutorial.'],
  ['D', 'Verificar quanto tempo permaneceram conectados.']
]), 'A alternativa B é a mais adequada porque exige análise, critérios e decisão. Acesso e tempo conectado não demonstram aprendizagem.'));

slides.push(section(2, '4.8 Evidências e critérios', heading('4.8 Evidências e critérios', 'Produto esperado: formulário testado e justificativa de uso') + cards([
  ['Alinhamento', 'Objetivo, clareza e qualidade das alternativas.'],
  ['Feedback', 'Pertinência e utilidade para revisão.'],
  ['Dados', 'Minimização e possibilidade de análise.'],
  ['Acesso', 'Funcionamento no celular.'],
  ['Contingência', 'Alternativa equivalente disponível.']
], 3), 'Apresente produto e critérios conforme o guia. Avalie a justificativa de uso, não apenas o funcionamento técnico do formulário.'));

slides.push(section(2, '4.9 Cuidados', heading('4.9 Cuidados', 'Microsoft Forms') + checks([
  'Não use apenas perguntas de memória quando o objetivo exige aplicação.',
  'Evite formulários longos.',
  'Não colete dados processuais ou pessoais sem necessidade.',
  'Confirme se participantes externos podem responder.',
  'Ofereça alternativa editável ou impressa.',
  'Analise e devolva os resultados.'
]), 'Apresente os cuidados do guia. Reforce que coletar respostas sem consequência reduz a confiança dos participantes.'));

slides.push(chapter(3, '5.', 'Microsoft Whiteboard', 'O Whiteboard é uma tela visual colaborativa para notas, textos, imagens, formas, tinta digital e outros elementos.'));

slides.push(section(3, '5.1 O que é', heading('5.1 O que é', 'Microsoft Whiteboard') + cards([
  ['Acesso', 'Navegador, aplicativos e contextos do Teams.'],
  ['Elementos', 'Notas, textos, imagens, formas e tinta digital.'],
  ['Colaboração', 'Compartilhamento e edição conforme permissões.'],
  ['Saída', 'Exportação ou preservação do quadro.']
], 4), 'Apresente a definição do guia. Avise que recursos e colaboração externa podem variar por cliente, atualização e política institucional.'));

slides.push(section(3, '5.2 Finalidade pedagógica', heading('5.2 Finalidade pedagógica', 'Visualizar relações e decisões') + cards([
  ['Relações e hipóteses', 'Conexões que precisam ser examinadas.'],
  ['Causas e etapas', 'Processos, sequências e consequências.'],
  ['Divergências e alternativas', 'Diferenças que precisam ser comparadas.'],
  ['Critérios e decisões', 'Parâmetros e escolhas justificadas.']
], 4) + lead('Muitas notas adesivas não demonstram aprendizagem por si.'), 'Apresente os itens do guia e a conclusão: é necessário organizar, comparar, justificar, priorizar, sintetizar e revisar.'));

slides.push(section(3, '5.3 Possibilidades de uso', heading('5.3 Possibilidades de uso', 'Microsoft Whiteboard') + cards([
  ['Conhecimentos prévios', 'Mapa inicial e nuvem de ideias.'],
  ['Análise', 'Causas, consequências, atores e linha do tempo.'],
  ['Comparação', 'Galeria de soluções e matriz de decisão.'],
  ['Construção coletiva', 'Rubrica, retrospectiva e síntese visual.']
], 4), 'Percorra as possibilidades exatamente na ordem do guia, agrupadas apenas para caber no layout.'));

slides.push(section(3, '5.4 Relação com o plano de curso', heading('5.4 Relação com o plano de curso', 'Microsoft Whiteboard') + table(['Elemento', 'Aplicação no guia'], [
  ['Conteúdos', 'Conceitos, relações, etapas, fatos, hipóteses e critérios'],
  ['Procedimentos metodológicos', 'Problematização, brainstorming estruturado, problemas, galeria e construção coletiva'],
  ['Tempo estimado', 'Orientação, produção, organização, leitura cruzada, decisão, debriefing e síntese'],
  ['Recursos didáticos', 'Quadro, modelo visual, legenda, instruções, dispositivos e alternativa textual'],
  ['Proposta de avaliação', 'Qualidade das relações, critérios e justificativas, sem privilegiar aparência']
]), 'Apresente cada linha do guia. Destaque que a estética do quadro não deve valer mais que o raciocínio representado.'));

slides.push(section(3, '5.5 Passo a passo de configuração (1/2)', heading('5.5 Passo a passo de configuração', 'Preparação do quadro') + checks([
  'Defina o problema profissional e o produto visual.',
  'Abra, crie e nomeie o quadro.',
  'Divida o quadro em zonas.',
  'Inclua legenda de cores e símbolos.',
  'Escreva instruções breves no próprio quadro.',
  'Apresente um exemplo de contribuição.',
  'Defina visualização e edição.'
]), 'Apresente a preparação conforme o guia. O exemplo deve orientar sem preencher a resposta do participante.'));

slides.push(section(3, '5.5 Passo a passo de configuração (2/2)', heading('5.5 Passo a passo de configuração', 'Teste, mediação e fechamento') + checks([
  'Teste link e permissões.',
  'Verifique teclado, mouse e dispositivo móvel.',
  'Distribua papéis e defina tempo por etapa.',
  'Agrupe e nomeie padrões.',
  'Peça justificativas e conduza debriefing.',
  'Registre uma síntese textual.',
  'Exporte ou preserve a versão final conforme a política.'
]), 'Apresente os passos finais. A síntese textual é necessária para acessibilidade e continuidade.'));

slides.push(section(3, '5.6 Modelo de atividade (1/2)', heading('5.6 Modelo de atividade', 'Situação e zonas do quadro') + `<div class="case">Uma unidade identifica atrasos recorrentes em determinado processo de trabalho.</div>` + cards([
  ['Fatos observados', 'O que já foi verificado.'],
  ['Pessoas afetadas', 'Quem sofre consequências.'],
  ['Causas possíveis', 'Hipóteses a examinar.'],
  ['Evidências disponíveis', 'Dados e fontes existentes.'],
  ['Alternativas', 'Possíveis intervenções.'],
  ['Critérios para decisão', 'Parâmetros de escolha.']
], 3), 'Apresente a situação e as seis zonas exatamente como no modelo do guia.'));

slides.push(section(3, '5.6 Modelo de atividade (2/2)', heading('5.6 Modelo de atividade', 'Tarefa do grupo e leitura cruzada') + checks([
  'Registrar pelo menos dois fatos.',
  'Diferenciar fatos de hipóteses.',
  'Relacionar causas e consequências.',
  'Propor alternativas e selecionar uma.',
  'Justificar a decisão com critérios.',
  'Outro grupo acrescenta dúvida, evidência ausente, risco e melhoria.'
]), 'Complete o modelo. Garanta tempo para leitura cruzada e resposta às contribuições do outro grupo.'));

slides.push(section(3, '5.7 Evidências e critérios', heading('5.7 Evidências e critérios', 'Produto esperado: quadro organizado e síntese da decisão') + cards([
  ['Problema e evidências', 'Alinhamento, fatos e hipóteses distintos.'],
  ['Representação', 'Relações compreensíveis e critérios explícitos.'],
  ['Colaboração', 'Participação estruturada.'],
  ['Decisão', 'Justificativa e revisão após feedback.']
], 4), 'Apresente produto e critérios do guia. Evite avaliar quantidade de notas ou acabamento visual isoladamente.'));

slides.push(section(3, '5.8 Cuidados', heading('5.8 Cuidados', 'Microsoft Whiteboard') + checks([
  'Não dependa apenas de cor ou posição.',
  'Produza síntese textual linear.',
  'Use fontes legíveis e bom contraste.',
  'Evite quadros excessivamente grandes.',
  'Não inclua dados pessoais ou sensíveis.',
  'Tenha matriz, tabela ou cartões físicos como alternativa.'
]), 'Apresente os cuidados do guia. Em cenários com convidados ou externos, teste a edição e não presuma persistência do acesso.'));

slides.push(chapter(4, '6.', 'Microsoft Loop', 'O Loop é um ambiente de coautoria composto por componentes, páginas e espaços de trabalho.'));

slides.push(section(4, '6.1 O que é', heading('6.1 O que é', 'Três elementos principais') + cards([
  ['Componentes', 'Blocos portáteis e sincronizados.'],
  ['Páginas', 'Telas flexíveis com pessoas, componentes, links, tarefas e informações.'],
  ['Espaços de trabalho', 'Agrupam conteúdos relacionados a um projeto ou iniciativa.']
], 3), 'Apresente as definições do guia. Diferencie a unidade curta, a atividade completa e o projeto mais longo.'));

slides.push(section(4, '6.2 Finalidade pedagógica', heading('6.2 Finalidade pedagógica', 'O Loop pode apoiar') + cards([
  ['Produção e registro', 'Produção conjunta e registro do raciocínio.'],
  ['Planejamento', 'Organização de etapas e tarefas.'],
  ['Feedback e revisão', 'Comentários e melhoria da produção.'],
  ['Síntese e acompanhamento', 'Decisões, responsabilidades e continuidade.']
], 4) + lead('A coedição só se torna aprendizagem com desafio, ação cognitiva, produto, critérios, feedback e revisão.'), 'Apresente a finalidade e a ressalva exatamente como no guia.'));

slides.push(section(4, '6.3 Quando usar cada elemento', heading('6.3 Quando usar cada elemento', 'Componente, página ou espaço de trabalho') + table(['Elemento', 'Quando usar'], [
  ['Componente', 'Contribuição curta e localizada, como votação, checklist, tabela ou lista de tarefas'],
  ['Página', 'Atividade com contexto, fontes, etapas, produto e critérios'],
  ['Espaço de trabalho', 'Projeto mais longo, com várias páginas, produtos e responsáveis']
]), 'Apresente a escolha do guia. O menor elemento que atende à finalidade tende a reduzir complexidade.'));

slides.push(section(4, '6.4 Possibilidades de uso', heading('6.4 Possibilidades de uso', 'Microsoft Loop') + cards([
  ['Atividade e análise', 'Página-guia e matriz de caso.'],
  ['Reflexão e ação', 'Diário de aprendizagem e plano de ação.'],
  ['Coordenação', 'Protocolo, checklist e projeto.'],
  ['Revisão e continuidade', 'Feedback, síntese e plano de transferência.']
], 4), 'Percorra as possibilidades na ordem do guia. Diferencie produto colaborativo de simples edição simultânea.'));

slides.push(section(4, '6.5 Relação com o plano de curso', heading('6.5 Relação com o plano de curso', 'Microsoft Loop') + table(['Elemento', 'Aplicação no guia'], [
  ['Conteúdos', 'Textos, critérios, fontes, links, exemplos e sínteses'],
  ['Procedimentos metodológicos', 'Coautoria, projetos, resolução de problemas, feedback, planejamento e reflexão'],
  ['Tempo estimado', 'Ambientação, produção, comentários, revisão e fechamento'],
  ['Recursos didáticos', 'Página, componentes, modelo, permissões e alternativa em documento'],
  ['Proposta de avaliação', 'Qualidade da contribuição, produto, critérios, feedback e revisão']
]), 'Apresente a relação com o plano de curso. O histórico técnico pode apoiar análise, mas não substitui critérios de qualidade da contribuição.'));

slides.push(section(4, '6.6 Passo a passo de configuração (1/2)', heading('6.6 Passo a passo de configuração', 'Problema, produto e estrutura') + checks([
  'Defina a necessidade profissional.',
  'Especifique o produto e a evidência esperada.',
  'Escolha componente, página ou espaço de trabalho.',
  'Nomeie a página de modo reconhecível.',
  'Inclua contexto, desafio e fontes essenciais.',
  'Divida a atividade em etapas.'
]), 'Apresente a primeira metade do fluxo do guia. A necessidade e o produto antecedem a escolha do elemento do Loop.'));

slides.push(section(4, '6.6 Passo a passo de configuração (2/2)', heading('6.6 Passo a passo de configuração', 'Orientação, acesso e destino') + checks([
  'Informe tempo, responsáveis e produto esperado.',
  'Inclua critérios de qualidade.',
  'Defina feedback e revisão.',
  'Configure o acesso e teste como participante.',
  'Registre a síntese final.',
  'Defina responsabilidade, retenção e destino do conteúdo.'
]), 'Apresente a segunda metade. Não planeje Loop para convidados ou externos sem comprovação de acesso; use documento compartilhado como contingência.'));

slides.push(section(4, '6.7 Modelo de página (1/2)', heading('6.7 Modelo de página', 'Situação, desafio, fontes e etapas') + cards([
  ['1. Situação profissional', 'Qual problema será analisado?'],
  ['2. Desafio', 'O que o grupo precisa decidir ou produzir?'],
  ['3. Fontes', 'Quais materiais são indispensáveis?'],
  ['4. Etapas', 'O que deve ser feito e em qual ordem?']
], 4), 'Apresente os quatro primeiros campos do modelo de página do guia.'));

slides.push(section(4, '6.7 Modelo de página (2/2)', heading('6.7 Modelo de página', 'Produto, critérios, feedback, revisão e transferência') + cards([
  ['5. Produto esperado', 'O que será entregue?'],
  ['6. Critérios', 'Como o produto será analisado?'],
  ['7. Feedback', 'Quem comentará e com qual orientação?'],
  ['8. Revisão', 'O que deverá ser melhorado?'],
  ['9. Transferência', 'Onde a aprendizagem poderá ser aplicada?']
], 3), 'Apresente os cinco campos finais do modelo. Reforce que feedback precisa resultar em revisão observável.'));

slides.push(section(4, '6.8 Evidências e critérios', heading('6.8 Evidências e critérios', 'Produto esperado: página colaborativa testada e revisada') + cards([
  ['Coerência', 'Problema, produto e instruções.'],
  ['Organização', 'Papéis, evidência e critérios utilizáveis.'],
  ['Interação', 'Contribuição substantiva e feedback.'],
  ['Melhoria', 'Revisão, organização e acessibilidade.']
], 4), 'Apresente os critérios do guia. A edição simultânea não é critério suficiente.'));

slides.push(section(4, '6.9 Cuidados técnicos', heading('6.9 Cuidados técnicos', 'Microsoft Loop') + checks([
  'Componentes podem aparecer em Teams, Outlook, OneNote e Whiteboard.',
  'Compartilhamento com convidados ou externos tem limitações.',
  'Conta institucional, Exchange Online, SharePoint, licença e política podem ser requisitos.',
  'Teste com perfil equivalente ao participante.',
  'Use documento ou tabela compartilhada como contingência.'
]), 'Apresente os cuidados do guia e marque condições institucionais como a confirmar. Não apresente disponibilidade como universal.'));

slides.push(chapter(5, '7.', 'Microsoft SharePoint', 'O SharePoint permite criar sites, páginas, bibliotecas, listas e espaços institucionais.'));

slides.push(section(5, '7.1 O que é', heading('7.1 O que é', 'Microsoft SharePoint') + cards([
  ['Sites e páginas', 'Publicação e navegação institucional.'],
  ['Bibliotecas e listas', 'Organização de arquivos e registros.'],
  ['Permissões e versões', 'Controle de acesso e histórico.'],
  ['Integração com Teams', 'Sites e bibliotecas associados às equipes.']
], 4), 'Apresente a definição do guia. Diferencie SharePoint como espaço institucional e OneDrive como espaço individual ou de compartilhamento pontual.'));

slides.push(section(5, '7.2 Finalidade pedagógica', heading('7.2 Finalidade pedagógica', 'No curso, o SharePoint pode funcionar como') + cards([
  ['Página inicial', 'Propósito, percurso e próximos passos.'],
  ['Mapa da jornada', 'Etapas, atividades e tempo.'],
  ['Acervo curado', 'Casos, fontes e modelos.'],
  ['Portfólio e memória', 'Produções, sínteses e continuidade.']
], 4) + lead('O SharePoint não deve ser tratado como uma grande pasta de arquivos.'), 'Apresente as finalidades do guia. Cada conteúdo precisa estar relacionado a uma etapa, atividade ou decisão.'));

slides.push(section(5, '7.3 Possibilidades de uso', heading('7.3 Possibilidades de uso', 'Microsoft SharePoint') + cards([
  ['Curso e módulos', 'Página de apresentação, trilha e páginas por módulo.'],
  ['Fontes e casos', 'Biblioteca, banco de casos e modelos.'],
  ['Produções e projetos', 'Coleções autorizadas, listas e acompanhamento.'],
  ['Suporte', 'Página de perguntas e ajuda.']
], 4), 'Percorra as possibilidades do guia, preservando sua ordem e finalidade.'));

slides.push(section(5, '7.4 Relação com o plano de curso', heading('7.4 Relação com o plano de curso', 'Microsoft SharePoint') + table(['Elemento', 'Aplicação no guia'], [
  ['Conteúdos', 'Páginas, fontes, casos, vídeos, documentos, referências e sínteses'],
  ['Procedimentos metodológicos', 'Estudo orientado, curadoria, sala invertida, projetos, pesquisa e consulta'],
  ['Tempo estimado', 'Visível em cada etapa da trilha'],
  ['Recursos didáticos', 'Páginas modernas, bibliotecas, listas, arquivos, mídias, modelos e links'],
  ['Proposta de avaliação', 'Páginas encaminham para evidência, critérios, devolutiva e transferência']
]), 'Apresente a relação com o plano de curso. A página deve orientar ação, não apenas exibir conteúdo.'));

slides.push(section(5, '7.5 Arquitetura recomendada (1/2)', heading('7.5 Arquitetura recomendada', 'Página inicial e trilha de aprendizagem') + table(['Área', 'Elementos'], [
  ['Página inicial', 'Propósito, público, objetivos, mapa da trilha, atividade atual, calendário, próximos passos e ajuda'],
  ['Trilha de aprendizagem', 'Etapa, objetivo, conteúdo, atividade, tempo, produto, critérios e botão de acesso']
]), 'Apresente as duas primeiras áreas da arquitetura recomendada no guia. Teste se o participante entende o próximo passo sem explicação oral.'));

slides.push(section(5, '7.5 Arquitetura recomendada (2/2)', heading('7.5 Arquitetura recomendada', 'Acervo, produções e ajuda') + table(['Área', 'Elementos'], [
  ['Acervo', 'Fontes essenciais, materiais complementares, casos, modelos, referências e produtos autorizados'],
  ['Produções', 'Orientações de entrega, exemplos, critérios, portfólios e sínteses'],
  ['Ajuda', 'Perguntas frequentes, suporte técnico, acessibilidade, contingência e contatos institucionais']
]), 'Apresente as áreas finais. Não publique produções sem autorização e não esconda suporte ou contingência.'));

slides.push(section(5, '7.6 Passo a passo de configuração (1/2)', heading('7.6 Passo a passo de configuração', 'Planejamento e construção') + checks([
  'Defina público e jornada.',
  'Abra o site associado à equipe.',
  'Desenhe a arquitetura antes de criar páginas.',
  'Crie página moderna com título claro.',
  'Organize conteúdo em seções.',
  'Use web parts somente quando ajudarem navegação ou ação.',
  'Informe objetivo, tempo e próximo passo.'
]), 'Apresente a primeira metade do passo a passo do guia. Arquitetura vem antes de criação de páginas.'));

slides.push(section(5, '7.6 Passo a passo de configuração (2/2)', heading('7.6 Passo a passo de configuração', 'Organização, publicação e manutenção') + checks([
  'Organize bibliotecas com nomes compreensíveis e evite excesso de pastas.',
  'Use metadados quando o volume justificar.',
  'Configure permissões por grupos e verifique versionamento.',
  'Publique a página e adicione como guia no Teams.',
  'Teste como participante e pelo celular.',
  'Revise links e arquivos.',
  'Defina atualização, retenção e arquivamento.'
]), 'Apresente a segunda metade. O teste precisa incluir permissões e experiência móvel.'));

slides.push(section(5, '7.7 Modelo de página de atividade (1/2)', heading('7.7 Modelo de página de atividade', 'Por que, o que desenvolver e o que estudar') + cards([
  ['Por que esta atividade é importante?', 'Apresente a necessidade profissional.'],
  ['O que você desenvolverá?', 'Declare a capacidade ou aprendizagem esperada.'],
  ['O que estudar?', 'Disponibilize apenas as fontes necessárias.']
], 3), 'Apresente as três primeiras perguntas do modelo do guia.'));

slides.push(section(5, '7.7 Modelo de página de atividade (2/2)', heading('7.7 Modelo de página de atividade', 'Fazer, produzir, analisar, revisar e aplicar') + cards([
  ['O que fazer?', 'Etapas e tempo.'],
  ['O que produzir?', 'Evidência esperada.'],
  ['Como será analisado?', 'Critérios.'],
  ['Como revisar?', 'Processo de feedback.'],
  ['Como aplicar no trabalho?', 'Compromisso de transferência.']
], 3), 'Apresente as perguntas finais do modelo. A página precisa orientar ação e revisão, não apenas consulta.'));

slides.push(section(5, '7.8 Evidências e critérios', heading('7.8 Evidências e critérios', 'Produto esperado: página inicial ou página de atividade testada') + cards([
  ['Orientação', 'Tarefa, arquitetura e percurso compreensíveis.'],
  ['Contexto', 'Fontes contextualizadas e tempo indicado.'],
  ['Acesso', 'Acessibilidade e permissões adequadas.'],
  ['Continuidade', 'Atualização sustentável e contingência.']
], 4), 'Apresente produto e critérios do guia. O teste deve ser feito por alguém que não participou da construção.'));

slides.push(section(5, '7.9 Cuidados', heading('7.9 Cuidados', 'Microsoft SharePoint') + checks([
  'Use títulos hierárquicos.',
  'Insira texto alternativo em imagens.',
  'Escreva links descritivos e verifique contraste.',
  'Evite tabelas excessivamente complexas.',
  'Não publique materiais sem autorização.',
  'Revise permissões antes de divulgar produções.',
  'Mantenha guia acessível em PDF ou documento como contingência.'
]), 'Apresente os cuidados do guia. Acessibilidade e autorização fazem parte da arquitetura, não da revisão final.'));

slides.push(chapter(6, '8.', 'Exemplo de sequência integrada FOFO', 'Tema: uso responsável de tecnologia em uma situação real de trabalho.'));

slides.push(section(6, '8. Necessidade e objetivo', heading('8. Exemplo de sequência integrada FOFO', 'Necessidade e objetivo') + table(['Elemento', 'Descrição'], [
  ['Necessidade', 'Participantes usam ferramentas digitais, mas nem sempre analisam como a tecnologia modifica decisões, relações, riscos e resultados.'],
  ['Objetivo', 'Analisar experiência profissional mediada por tecnologia, identificar mudanças e propor melhoria fundamentada.']
]), 'Apresente tema, necessidade e objetivo exatamente como no exemplo do guia.'));

slides.push(section(6, '8. Etapas 1 e 2', heading('8. Exemplo de sequência integrada FOFO', 'Etapa 1: Forms | Etapa 2: Whiteboard') + table(['Etapa', 'Ação', 'Evidência'], [
  ['Diagnóstico no Forms', 'Descrever experiência real em que uma tecnologia modificou aprendizagem ou trabalho', 'Relato inicial'],
  ['Problematização no Whiteboard', 'Organizar situação, tecnologia, mudança, benefício, risco e questão em aberto', 'Mapa coletivo']
]), 'Apresente as duas primeiras etapas e suas evidências.'));

slides.push(section(6, '8. Etapas 3 e 4', heading('8. Exemplo de sequência integrada FOFO', 'Etapa 3: SharePoint | Etapa 4: Loop') + table(['Etapa', 'Ação', 'Evidência'], [
  ['Aprofundamento no SharePoint', 'Consultar fontes curadas e um caso', 'Critérios relevantes identificados'],
  ['Produção no Loop', 'Elaborar diagnóstico, melhoria, critérios, riscos, implementação e evidência de sucesso', 'Plano revisável']
]), 'Apresente as etapas de aprofundamento e produção. As fontes curadas sustentam os critérios usados no plano.'));

slides.push(section(6, '8. Etapas 5 e 6', heading('8. Exemplo de sequência integrada FOFO', 'Etapa 5: Teams | Etapa 6: revisão e transferência') + table(['Etapa', 'Ação', 'Evidência'], [
  ['Feedback no Teams', 'Publicar síntese e comentar a produção de outro grupo', 'Feedback fundamentado'],
  ['Revisão e transferência', 'Registrar o que mudou, por quê, onde será aplicado, responsável e verificação', 'Plano final e compromisso de aplicação']
]), 'Apresente as etapas finais. O percurso termina com revisão e aplicação, não com a primeira entrega.'));

slides.push(chapter(7, '9.', 'Avaliação integrada', 'A avaliação diagnóstica, formativa, somativa e da transferência cumpre finalidades diferentes.'));

slides.push(section(7, '9. Avaliação diagnóstica e formativa', heading('9. Avaliação integrada', 'Diagnóstica e formativa') + table(['Tipo', 'Momento', 'Ferramentas indicadas', 'Finalidade'], [
  ['Diagnóstica', 'Antes ou no início', 'Forms, Whiteboard e publicação no Teams', 'Conhecer repertório, experiências, dúvidas e concepções'],
  ['Formativa', 'Durante a aprendizagem', 'Loop, Whiteboard, Forms e Teams', 'Tornar raciocínio visível, oferecer feedback e permitir revisão']
]), 'Apresente os dois primeiros tipos de avaliação conforme o guia. A ferramenta não define a finalidade; momento, evidência e uso dos resultados definem.'));

slides.push(section(7, '9. Avaliação somativa e da transferência', heading('9. Avaliação integrada', 'Somativa e transferência') + table(['Tipo', 'Momento', 'Ferramentas indicadas', 'Finalidade'], [
  ['Somativa', 'Ao final de uma etapa', 'Loop, SharePoint, Teams e Forms quando adequado', 'Emitir julgamento com base em evidências e critérios'],
  ['Transferência', 'Depois do curso', 'Forms, Loop, lista no SharePoint e comunidade no Teams', 'Verificar aplicação e condições que facilitaram ou impediram o uso']
]), 'Apresente os tipos finais. Em Forms, use avaliação somativa apenas quando questões estruturadas observarem adequadamente o objetivo.'));

slides.push(chapter(8, '10.', 'Checklist final para qualquer ferramenta', 'Antes de utilizar um recurso do Microsoft 365, verifique intencionalidade, atividade, evidência, viabilidade, acessibilidade, segurança e contingência.'));

slides.push(section(8, '10. Intencionalidade e atividade', heading('10. Checklist final para qualquer ferramenta', 'Intencionalidade e atividade') + checks([
  'Qual necessidade profissional será enfrentada?',
  'Que capacidade será praticada?',
  'Qual é o objetivo de aprendizagem?',
  'Por que esta ferramenta é adequada?',
  'O participante fará algo cognitivamente significativo?',
  'Existe problema, decisão ou produção?',
  'A interação tem finalidade definida?',
  'Haverá mediação e síntese?'
]), 'Leia o checklist como perguntas de revisão do desenho, preservando a ordem do guia.'));

slides.push(section(8, '10. Evidência e viabilidade', heading('10. Checklist final para qualquer ferramenta', 'Evidência, avaliação e viabilidade') + checks([
  'Que evidência será produzida e quais são os critérios?',
  'Haverá feedback e possibilidade de revisão?',
  'A avaliação está alinhada ao objetivo?',
  'A licença permite o uso e o administrador precisa liberar?',
  'Participantes externos terão acesso?',
  'O ambiente funciona no celular?',
  'O tempo é suficiente?'
]), 'Apresente as perguntas sobre evidência e viabilidade. Marque dependências técnicas como confirmadas ou a confirmar.'));

slides.push(section(8, '10. Acessibilidade e privacidade', heading('10. Checklist final para qualquer ferramenta', 'Acessibilidade, inclusão, privacidade e segurança') + checks([
  'O material funciona com teclado?',
  'Há texto alternativo e a informação não depende apenas de cor?',
  'A linguagem está clara e existe alternativa equivalente?',
  'É necessário coletar esses dados?',
  'Há conteúdo pessoal, processual ou sensível?',
  'As permissões foram testadas?',
  'Está claro quem pode visualizar, editar e compartilhar?'
]), 'Apresente acessibilidade e privacidade como condições de desenho. Não solicite nem projete dados sensíveis nos exercícios.'));

slides.push(section(8, '10. Contingência e premissa central', heading('10. Checklist final para qualquer ferramenta', 'Contingência') + checks([
  'O que acontecerá se a ferramenta não funcionar?',
  'Existe versão em documento, planilha, PDF ou material impresso?',
  'A alternativa preserva objetivo, evidência e critérios?'
]) + `<div class="quote" style="margin-top:34px;font-size:48px">A tecnologia não é a metodologia.</div>` + lead('Forms, Whiteboard, Loop, Teams e SharePoint tornam-se recursos educacionais quando articulados a problema profissional, ação significativa, evidências, critérios, feedback, revisão e aplicação no trabalho.'), 'Feche o checklist com a premissa central do guia. Contingência equivalente preserva a ação de aprendizagem.'));

slides.push(`<section class="cover" data-topic="8" data-title="Fechamento" data-note="Encerre retomando a premissa central do guia e convide os participantes a revisar uma atividade real com o checklist final."><div class="cover-grid"><div><span class="kicker">FOFO TECH · Dia 2</span><h1>A tecnologia<span>não é a metodologia.</span></h1><p class="lead">O valor educacional nasce da articulação entre problema, ação, evidência, critérios, feedback, revisão e aplicação.</p></div><div class="logo-stage"><img src="../assets/logo-cjud.jpg" alt="Logo do CJUD"></div></div></section>`);

const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>FOFO TECH · Dia 2 · Guia FOFO de uso pedagógico do Microsoft 365</title>
<meta name="description" content="Apresentação do Guia FOFO de uso pedagógico do Microsoft 365, seguindo a estrutura do documento de referência.">
<link rel="icon" href="../assets/logo-cjud.jpg">
<link rel="stylesheet" href="../vendor/reveal/reveal.css">
<link rel="stylesheet" href="../assets/slides.css">
</head>
<body>
<a class="slide-skip" href="#fofo-slides">Ir para os slides</a>
<a class="portal-return" href="../dia-2/" aria-label="Voltar à página do Dia 2">← Dia 2</a>
<div class="reveal" id="fofo-slides"><div class="slides">
${slides.join('\n\n')}
</div></div>
<div class="facilitator-tools" aria-label="Ferramentas de apresentação">
  <button type="button" id="prevSlide" class="nav-button" aria-label="Slide anterior" title="Slide anterior · Page Up ou seta para a esquerda">‹</button>
  <button type="button" id="nextSlide" class="nav-button" aria-label="Próximo slide" title="Próximo slide · Page Down, espaço ou seta para a direita">›</button>
  <span class="tool-separator" aria-hidden="true"></span>
  <button type="button" id="fullscreenToggle" aria-label="Entrar em tela cheia" aria-pressed="false" title="Tela cheia · tecla F">⛶</button>
  <button type="button" id="timerToggle" aria-label="Iniciar ou pausar temporizador" title="Iniciar ou pausar temporizador · tecla T">▶</button>
  <button type="button" id="timerDisplay" aria-label="Configurar temporizador" title="Configurar temporizador">05:00</button>
  <button type="button" id="timerReset" aria-label="Reiniciar temporizador" title="Reiniciar temporizador · tecla R">↺</button>
  <button type="button" id="notesOpen" aria-label="Abrir notas do apresentador" title="Notas do apresentador · tecla N">N</button>
  <span id="slideStatus" class="sr-only" aria-live="polite"></span>
</div>
<dialog class="timer-dialog" id="timerDialog"><form method="dialog"><button class="dialog-close" value="cancel" aria-label="Fechar">×</button><h2>Temporizador</h2><label>Minutos <input id="timerMinutes" type="number" min="0" max="180" value="5"></label><label>Segundos <input id="timerSeconds" type="number" min="0" max="59" value="0"></label><div class="timer-presets"><button type="button" data-min="1">1 min</button><button type="button" data-min="3">3 min</button><button type="button" data-min="5">5 min</button><button type="button" data-min="10">10 min</button><button type="button" data-min="15">15 min</button></div><button class="timer-apply" value="default">Aplicar</button></form></dialog>
<script src="../vendor/reveal/reveal.js"></script>
<script src="../vendor/reveal/plugin/notes/notes.js"></script>
<script src="../assets/slides.js"></script>
</body>
</html>`;

await fs.writeFile(destination, html);
console.log(`Dia 2 gerado com ${slides.length} slides.`);
