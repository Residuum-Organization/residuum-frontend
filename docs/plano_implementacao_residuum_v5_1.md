# Plano de Implementacao - Residuum V5.1

## 1. Objetivo

Atualizar frontend, backend e documentacao para o fluxo definitivo de cadastro e entrega de residuos da Residuum.

O Morador cadastra os residuos, comprova sua presenca por GPS e envia um ou varios itens para validacao. No recebimento, o Ponto de Coleta confere as embalagens por codigo de barras ou realiza uma conferencia manual quando o produto nao possuir rotulo.

A logica atual de campanhas, sorteios e vouchers sera reaproveitada, mas a experiencia do Morador sera centralizada em uma unica aba Loja. Campanhas e descartes concedem pontos, enquanto sorteios e vouchers consomem o saldo acumulado.

## 2. Decisoes de Produto

- GPS e codigo de barras serao usados em conjunto.
- O GPS comprova que o Morador esta fisicamente no Ponto de Coleta.
- O Ponto de Coleta escaneia os produtos entregues.
- Embalagens sem rotulo serao cadastradas e conferidas manualmente.
- Nao existira QR Code no fluxo ativo de descarte.
- Nao existira aprovacao manual ou QR Code como alternativa para falha de GPS.
- Campanhas e descartes concedem pontos.
- Sorteios e vouchers consomem pontos.
- A logica atual de campanhas, sorteios e vouchers sera mantida.
- O Morador acessara campanhas, sorteios, vouchers e recompensas em uma unica aba Loja.
- As telas administrativas de gestao permanecerao separadas.
- Os nomes visiveis dos perfis serao padronizados como Morador, Ponto de Coleta e Administrador.

## 3. Cadastro de Residuos

### 3.1 Identificacao por codigo de barras

- Persistir o campo `codigo_barras` no inventario do Morador.
- Armazenar o codigo como texto para preservar zeros a esquerda.
- Exigir a leitura do codigo quando o item possuir rotulo.
- Manter a escolha manual do tipo de material, pois ainda nao existe um catalogo confiavel de produtos.
- Remover a classificacao automatica baseada apenas no prefixo do codigo.
- Permitir uma leitura de codigo por item de estoque, e nao uma leitura para cada unidade fisica do mesmo produto.
- Exibir no estoque que o item possui codigo de barras cadastrado.

### 3.2 Embalagem sem rotulo

- Adicionar a opcao visivel `Embalagem sem rotulo`.
- Persistir o campo booleano `sem_rotulo` no backend.
- Ao marcar a opcao, fechar o scanner e limpar qualquer codigo informado.
- Exigir descricao, tipo de residuo e quantidade preenchidos manualmente.
- Nao permitir codigo de barras e `sem_rotulo` ao mesmo tempo.
- Nao permitir o cadastro sem nenhuma das duas formas de identificacao.
- Tratar registros antigos sem codigo persistido como itens sem rotulo ate que sejam editados.

### 3.3 Edicao e exibicao

- Permitir alternar entre item com codigo e item sem rotulo durante a edicao.
- Limpar os dados incompativeis ao trocar o modo de identificacao.
- Exibir no card do estoque se o item foi identificado por codigo ou preenchido manualmente.
- Manter as chaves tecnicas dos materiais sem acento no banco e formatar os nomes corretamente na interface.

## 4. Transferencia de Residuos

### 4.1 Nomenclatura da acao

- Alterar o texto `Transferir` para `Enviar para validacao`.
- Manter claro que o envio ainda nao credita pontos.
- Informar que a pontuacao depende da conferencia e da pesagem pelo Ponto de Coleta.

### 4.2 Enviar todos

- Adicionar o botao `Enviar todos para validacao` na tela de estoque.
- Ao acionar o botao, selecionar todo o saldo disponivel dos itens elegiveis.
- Permitir ajustar a quantidade de cada item antes da confirmacao.
- Permitir retirar itens do lote antes do envio.
- Manter a transferencia individual utilizando o mesmo fluxo do lote.
- Exibir somente pontos que aceitem todos os materiais selecionados.
- Informar quando nenhum Ponto de Coleta for compativel com o lote completo.

### 4.3 Atomicidade e idempotencia

- Criar todos os descartes do lote em uma unica transacao de banco.
- Reservar todos os itens ou nao reservar nenhum.
- Desfazer toda a operacao quando qualquer item estiver invalido.
- Validar propriedade, status e saldo disponivel de cada item.
- Validar se o ponto esta ativo e aceita todos os materiais.
- Criar um identificador unico para cada operacao.
- Reutilizar o resultado anterior quando a mesma operacao for reenviada.
- Impedir reservas e descartes duplicados causados por duplo clique ou falha de rede.

## 5. Validacao de Presenca por GPS

- Tornar o GPS obrigatorio para qualquer transferencia.
- Capturar latitude, longitude e precisao retornada pelo navegador.
- Usar o modo de alta precisao da Geolocation API.
- Nao reutilizar coordenadas antigas armazenadas pelo navegador.
- Fazer ate tres tentativas automaticas.
- Aplicar timeout de 8 segundos para cada tentativa.
- Nao repetir automaticamente quando a permissao estiver negada.
- Diferenciar os erros de permissao negada, GPS indisponivel, timeout e usuario fora do raio.
- Preservar ponto, itens, quantidades e observacao quando a localizacao falhar.
- Bloquear o envio enquanto nao houver uma localizacao valida.
- Nao disponibilizar QR Code, aprovacao retroativa ou bypass manual.
- Registrar coordenadas e precisao para auditoria e analise de falsos negativos.

## 6. Lote de Transferencia

- Criar uma entidade de lote vinculada ao Morador e ao Ponto de Coleta.
- Registrar coordenadas, precisao, observacao, status e data da operacao.
- Vincular cada descarte ao lote que o originou.
- Permitir consultar o resumo e o andamento do lote.
- Calcular os pontos estimados apenas para exibicao, sem credita-los no envio.
- Atualizar o status do lote conforme os itens forem confirmados ou rejeitados.

## 7. Validacao pelo Ponto de Coleta

### 7.1 Leitura de codigo de barras

- Adicionar um scanner de codigo de barras a fila de descartes pendentes.
- Reutilizar `react-zxing`, que ja esta instalado no frontend.
- Fazer uma leitura para cada item de estoque enviado.
- Comparar o codigo escaneado com o codigo armazenado no servidor.
- Preservar zeros a esquerda durante a comparacao.
- Nao retornar o codigo esperado na API da fila operacional.
- Exibir uma mensagem clara quando o codigo for divergente.
- Manter o item bloqueado enquanto a identificacao nao for validada.

### 7.2 Conferencia de item sem rotulo

- Identificar visualmente os descartes cadastrados sem rotulo.
- Mostrar ao Ponto de Coleta a descricao e o material informados pelo Morador.
- Exigir uma confirmacao manual do material.
- Permitir informar ou corrigir o peso realmente recebido.
- Registrar a identificacao como validacao manual.

### 7.3 Aprovacao e pontuacao

- Bloquear a aprovacao antes da validacao da identificacao.
- Creditar pontos somente depois da identificacao e da pesagem.
- Baixar o estoque do Morador somente depois da confirmacao.
- Atualizar o inventario do Ponto de Coleta na mesma transacao da confirmacao.
- Registrar responsavel, horario, modo de validacao, divergencias e resultado no log de auditoria.
- Restringir leitura e confirmacao ao responsavel pelo Ponto de Coleta.
- Manter o Administrador como auditor do processo.
- Exigir que pontos sem responsavel operacional recebam um usuario de Ponto de Coleta antes de confirmar entregas.

## 8. Alteracoes de Banco de Dados

### 8.1 Inventario do Morador

Adicionar:

- `codigo_barras`, texto e nullable.
- `sem_rotulo`, booleano com valor padrao `false`.

### 8.2 Lote de transferencia

Criar uma entidade contendo:

- Identificador unico da operacao.
- Morador.
- Ponto de Coleta.
- Latitude e longitude.
- Precisao do GPS.
- Observacao.
- Status.
- Data de criacao e atualizacao.

### 8.3 Descarte

Adicionar:

- Referencia ao lote.
- Copia do codigo de barras do item.
- Indicacao de item sem rotulo.
- Estado da identificacao: `pendente`, `validado` ou `manual`.
- Usuario responsavel pela identificacao.
- Data e hora da identificacao.

### 8.4 Compatibilidade

- Preservar descartes, inventarios e pontuacoes existentes.
- Tratar itens antigos sem codigo como itens de conferencia manual.
- Preservar tabelas e vinculos historicos de QR Code apenas para auditoria.
- Nao criar novos registros de QR Code.

## 9. Alteracoes de API

### 9.1 Transferencia

- Criar `POST /me/transferencias` para enviar um ou varios itens atomicamente.
- Criar `GET /me/transferencias/{lote_id}` para consultar resumo e status.
- Fazer o endpoint individual existente reutilizar o mesmo servico transacional.
- Remover `qrcode_token` dos contratos ativos.
- Rejeitar novos requests que ainda enviem campos relacionados a QR Code.

### 9.2 Validacao operacional

- Criar `POST /cooperativa/descartes/{id}/validar-identificacao`.
- Aceitar os modos `codigo_barras` e `manual`.
- No modo codigo, comparar o valor recebido com o valor armazenado.
- No modo manual, permitir a operacao somente para itens sem rotulo.
- Atualizar a fila de pendencias com lote, modo e estado da identificacao.
- Fazer `PUT /descarte/{id}/confirmar` exigir identificacao validada.

### 9.3 QR Code

- Remover endpoints de geracao de token.
- Remover endpoints de consulta de tokens ativos.
- Remover endpoints de validacao de token.
- Remover QR Code do painel de testes interno do FastAPI.

## 10. Remocao do QR Code no Frontend

- Remover a rota `/escanear-qr`.
- Remover a pagina usada exclusivamente para leitura de QR Code.
- Remover QR Code das navegacoes desktop e mobile.
- Retirar inputs, botoes, divisores e mensagens de QR das telas mantidas.
- Remover parametros de URL relacionados a QR.
- Remover o QR do payload de transferencia.
- Remover imports, services e componentes exclusivos do fluxo.
- Remover `html5-qrcode` do projeto se nao restar outro uso.
- Manter as demais telas, removendo apenas as areas relacionadas a QR.

## 11. Experiencia do Usuario

As cinco entregas solicitadas devem ser tratadas como melhorias de jornada, e nao apenas como inclusao ou remocao de endpoints.

### 11.1 Botao Sem Rotulo

- Posicionar a opcao ao lado da area de leitura de codigo de barras, antes dos campos manuais.
- Apresentar duas escolhas claras: `Escanear codigo` e `Embalagem sem rotulo`.
- Usar um controle com rotulo textual, icone e estado selecionado; nao depender apenas de cor.
- Ao selecionar `Embalagem sem rotulo`, recolher a camera e revelar progressivamente os campos manuais.
- Explicar que o Ponto de Coleta fara uma conferencia manual no recebimento.
- Preservar os dados digitados quando ocorrer um erro de validacao.
- Garantir alvo de toque adequado e navegacao por teclado.
- Anunciar a mudanca de modo para leitores de tela.

### 11.2 Botao Transferir Todos

- Colocar `Enviar todos para validacao` como acao secundaria no cabecalho do estoque.
- Manter `Adicionar residuo` como acao principal quando o estoque estiver vazio.
- Exibir a quantidade de itens elegiveis no texto ou badge do botao.
- Ao acionar, abrir a tela de validacao com todos os itens selecionados e suas quantidades maximas.
- Disponibilizar `Selecionar todos` e `Limpar selecao` dentro da etapa de residuos.
- Exibir uma barra de resumo persistente no mobile com itens, peso e pontos estimados.
- Solicitar confirmacao antes do envio final, mostrando destino e quantidade de itens.
- Desabilitar o botao durante o envio e impedir duplo clique.
- Quando nao houver ponto compativel, explicar quais materiais causam a incompatibilidade e permitir ajustar o lote.

### 11.3 Remocao do QR Code

- Remover a pagina exclusiva de scanner de QR Code.
- Nas telas que possuem outras funcoes, remover apenas os blocos, inputs e botoes de QR.
- Reorganizar os espacos vazios para que a interface nao pareca incompleta depois da remocao.
- Transformar GPS na unica acao visual da etapa de presenca.
- Mostrar estados claros para `Localizando`, `Localizacao confirmada`, `Permissao negada` e `Fora do raio`.
- Remover o item de QR da navegacao e redistribuir os itens restantes de forma equilibrada.
- Garantir que links antigos de QR redirecionem para a validacao de presenca ou para o estoque, sem tela quebrada.

### 11.4 Loja Centralizada

- Criar a rota principal `/loja` para o Morador.
- Substituir os itens separados `Campanhas` e `Sorteios` da navegacao por um unico item `Loja`.
- Exibir no cabecalho o saldo atualizado de pontos do Morador.
- Organizar a pagina em abas ou controle segmentado: `Campanhas`, `Sorteios`, `Vouchers` e `Minhas recompensas`.
- Reutilizar os services e regras atuais, sem duplicar chamadas ou logica de negocio.
- Destacar campanhas com `Ganhe X pontos`.
- Destacar sorteios e vouchers com `Custa X pontos`.
- Desabilitar resgates quando o saldo for insuficiente, mostrando quanto falta.
- Identificar campanhas ja participadas, bilhetes ja adquiridos e vouchers esgotados.
- Solicitar confirmacao antes de qualquer operacao que debite pontos.
- Atualizar saldo, extrato e recompensas imediatamente apos cada operacao.
- Manter `/campanhas-ativas` e `/sorteios` como redirecionamentos para a aba correspondente da Loja.
- Fazer a tela de detalhes do sorteio retornar para a Loja.
- Manter as telas administrativas separadas para criacao e gestao.
- Usar cards responsivos, estados vazios por aba e skeletons durante o carregamento.

### 11.5 Tela de Parabens

- Usar uma composicao visual de celebracao coerente com a identidade Residuum, sem sugerir que os pontos ja foram creditados.
- Exibir confirmacao visual, titulo, resumo do lote e proxima etapa da jornada.
- Mostrar uma contagem regressiva visivel para o redirecionamento.
- Permitir que o Morador interrompa a espera usando `Ir para o inicio`.
- Usar navegacao com `replace` para evitar retorno acidental ao formulario ja enviado.
- Respeitar `prefers-reduced-motion` e nao depender de animacao para comunicar sucesso.
- Garantir que a mensagem principal seja anunciada por leitores de tela.
- Adaptar o resumo para uma coluna no mobile e manter o CTA sempre acessivel.

### 11.6 Padroes Gerais de UX

- Preservar dados preenchidos em erros recuperaveis.
- Usar mensagens especificas e orientadas a solucao.
- Evitar modais para erros simples; usar alertas proximos da acao que falhou.
- Usar confirmacao antes de transferencias e gastos de pontos.
- Exibir loading no controle acionado, sem bloquear desnecessariamente toda a pagina.
- Garantir estados de foco, contraste, teclado e leitores de tela.
- Validar todas as jornadas em desktop e celular.

## 12. Tela de Sucesso

- Criar a rota `/transferencia-concluida/:loteId`.
- Abrir a tela depois da criacao bem-sucedida do lote.
- Exibir `Parabens! Seus residuos foram enviados para validacao`.
- Mostrar Ponto de Coleta, quantidade de itens, peso enviado e pontos estimados.
- Informar que os pontos ainda aguardam conferencia e pesagem.
- Disponibilizar o botao `Ir para o inicio`.
- Redirecionar automaticamente para `/inicio` apos 5 segundos.
- Recuperar o resumo pela API para manter a tela funcional apos atualizar o navegador.

## 13. Padronizacao de Nomenclatura

### 13.1 Papeis

- Usar `Morador` em headers, filtros e badges.
- Usar `Ponto de Coleta` em toda a interface operacional.
- Usar `Administrador` no painel administrativo.
- Remover os termos visiveis `Gerador`, `Lojista` e `Empresa de coleta`.
- Remover `Cooperativa` como nome visivel do perfil operacional.
- Manter internamente as roles `usuario` e `cooperativa` para compatibilidade.

### 13.2 Navegacao e paineis

- Renomear o menu operacional `Pontos` para `Meus Locais`.
- Atualizar o cabecalho operacional para `Ponto de Coleta`.
- Atualizar o cabecalho do Morador removendo `Gerador`.
- Atualizar filtros do Admin para `Ponto de Coleta`.
- Atualizar badges de usuarios para os nomes padronizados.

### 13.3 Textos e apresentacao

- Atualizar a landing para explicar GPS mais leitura de codigo de barras.
- Unificar cards duplicados relacionados ao Ponto de Coleta.
- Corrigir `regiao`, `sustentavel`, `plastico`, `papelao` e demais acentos.
- Padronizar badges de campanha como `ativa` e `encerrada`.
- Corrigir `Participe e ganhar` para `Participe e ganhe`.
- Substituir referencias a confirmacao `pela cooperativa` por `pelo Ponto de Coleta`.
- Usar o placeholder `Ex: Plastico, Papel, Vidro` no cadastro de materiais aceitos.
- Permitir quebra de linha e tooltip para enderecos e textos extensos.

## 14. Mapa e Dados de Pontos

- Garantir que o mapa consuma somente registros reais de `PontoColeta`.
- Nunca usar o nome do usuario responsavel como substituto do nome do local.
- Adicionar teste para impedir que usuarios comuns aparecam como pontos.
- Identificar registros existentes com nomes incorretos.
- Nao renomear dados antigos automaticamente, pois o nome correto nao pode ser inferido com seguranca.
- Apresentar os IDs inconsistentes para correcao administrativa.

## 15. Loja e Pontuacao

- Centralizar a experiencia do Morador na rota `/loja`.
- Reutilizar as funcionalidades ja existentes de campanhas, sorteios e vouchers.
- Manter as telas administrativas atuais e separadas.
- Manter o Morador como consumidor das campanhas e recompensas.
- Campanhas continuam concedendo pontos uma unica vez.
- Descartes continuam concedendo pontos somente apos confirmacao.
- Sorteios continuam debitando pontos e limitando um bilhete por Morador.
- Vouchers continuam debitando pontos, respeitando saldo e estoque.
- Exibir saldo, custo, recompensa e indisponibilidade antes da confirmacao.
- Atualizar a carteira e o extrato depois de qualquer credito ou debito.
- Executar testes de regressao para garantir que o novo fluxo nao altere essas regras.

## 16. Documentacao

- Atualizar `docs/nomenclatura-residuum.md` com a validacao dupla.
- Atualizar `docs/manual_funcionalidades.md` removendo o QR Code do fluxo ativo.
- Documentar cadastro por codigo e cadastro sem rotulo.
- Documentar transferencia individual e em lote.
- Documentar validacao pelo Ponto de Coleta.
- Documentar a Loja centralizada e diferenciar operacoes que concedem ou consomem pontos.
- Registrar que a decisao V5.1 substitui a definicao de GPS exclusivo do PDF V5.
- Manter os PDFs V4 para V5 e V5 como documentos historicos.
- Atualizar o quadro de disponibilidade depois da implementacao.

## 17. Testes e Criterios de Aceite

### 17.1 Cadastro

- Cadastrar item com codigo valido.
- Cadastrar item sem rotulo e com dados manuais.
- Rejeitar item com codigo e `sem_rotulo` simultaneamente.
- Rejeitar item sem nenhuma identificacao.
- Editar e alternar corretamente o modo de identificacao.
- Validar a migracao de itens antigos.

### 17.2 Transferencia

- Enviar um unico item.
- Enviar todos os itens disponiveis.
- Ajustar quantidades antes do envio.
- Bloquear ponto incompativel.
- Forcar erro em um item e comprovar rollback completo.
- Repetir o identificador da operacao e comprovar ausencia de duplicidade.

### 17.3 GPS

- Validar coordenadas dentro do raio.
- Bloquear coordenadas fora do raio.
- Testar timeout e GPS indisponivel.
- Testar permissao negada.
- Confirmar que nao existe fallback por QR ou aprovacao manual.

### 17.4 Ponto de Coleta

- Validar codigo correto.
- Rejeitar codigo divergente.
- Validar manualmente item sem rotulo.
- Impedir validacao manual de item que deveria possuir codigo.
- Impedir outro Ponto de Coleta de operar o descarte.
- Impedir confirmacao antes da identificacao.
- Confirmar credito de pontos somente apos pesagem.

### 17.5 Loja e Regressao

- Confirmar ausencia de telas, inputs e endpoints ativos de QR Code.
- Confirmar navegacao entre as quatro abas da Loja.
- Confirmar redirecionamentos das rotas antigas para a Loja.
- Confirmar campanhas creditando pontos.
- Confirmar sorteios e vouchers debitando pontos.
- Confirmar bloqueio e mensagem de saldo insuficiente.
- Confirmar atualizacao imediata do saldo e das recompensas.
- Confirmar mapa retornando apenas pontos reais.
- Executar migracoes de upgrade e downgrade.
- Executar testes do backend.
- Executar build de producao do frontend.
- Revisar o fluxo em desktop e celular.

## 18. Ordem de Implementacao

1. Criar migracoes, modelos e schemas de identificacao e lote.
2. Implementar cadastro e edicao com codigo ou sem rotulo.
3. Implementar transferencia atomica e validacao GPS.
4. Implementar leitura e conferencia no painel do Ponto de Coleta.
5. Implementar `Enviar todos para validacao`.
6. Implementar a tela de sucesso e redirecionamento.
7. Remover funcionalidades e telas exclusivas de QR Code.
8. Centralizar campanhas, sorteios e vouchers na Loja do Morador.
9. Aplicar a padronizacao de nomenclatura.
10. Atualizar documentacao.
11. Executar testes, build e revisao responsiva.

## 19. Estrategia de Commits

Os commits devem ser separados por repositorio e responsabilidade, usando mensagens em ingles no padrao `type(area): message`.

### Backend

- `feat(inventory): persist barcode and unlabeled residue metadata`
- `feat(transfers): implement atomic batch residue submissions`
- `feat(validation): require collection point product verification`
- `refactor(qrcode): disable legacy qr code workflows`
- `test(transfers): cover gps batch and identification rules`

### Frontend

- `feat(inventory): support unlabeled residue registration`
- `feat(transfers): add transfer all workflow`
- `feat(validation): add collection point barcode verification`
- `feat(store): centralize campaigns raffles and vouchers`
- `feat(transfers): add submission success screen`
- `refactor(qrcode): remove qr code interaction flows`
- `fix(copy): standardize user facing terminology`
- `docs(product): document v5.1 residue validation flow`
