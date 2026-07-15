# Manual Funcional da Plataforma Residuum

> **Versão revisada em 15 de julho de 2026.** Este documento apresenta as jornadas disponíveis após a integração das funcionalidades no aplicativo e no servidor.

## 1. Visão geral

A Residuum é uma plataforma web responsiva que conecta cidadãos, pontos de coleta, cooperativas e a equipe administrativa. Seu objetivo é organizar o descarte de resíduos recicláveis, comprovar a presença do cidadão no ponto de coleta, registrar a quantidade realmente recebida e recompensar a participação com pontos, sorteios e vouchers.

A solução possui três ambientes principais:

- **Cidadão ou morador:** cadastra resíduos, encontra pontos de coleta, solicita entregas e acompanha pontos e recompensas.
- **Cooperativa ou empresa de coleta:** acompanha pontos sob sua responsabilidade, confere entregas e informa a quantidade efetivamente recebida.
- **Administrador Residuum:** acompanha toda a rede, gerencia usuários, pontos, campanhas, sorteios, vouchers e indicadores.

### Como interpretar a disponibilidade

- **Disponível:** a jornada principal está presente na interface e possui suporte no sistema.
- **Parcial:** existe parte importante da funcionalidade, mas ainda há etapas sem interface ou ajustes necessários entre as telas e as regras do sistema.
- **Preparado no sistema:** a regra e os dados existem, mas ainda não há uma jornada completa disponível ao público correspondente.
- **Demonstrativo:** tela visual sem vínculo completo com dados reais.

## 2. Jornada resumida do cidadão

1. O cidadão cria sua conta e acessa a plataforma.
2. Consulta no mapa quais pontos estão ativos e quais materiais cada local recebe.
3. Cadastra no estoque pessoal os resíduos que pretende entregar.
4. No momento da entrega, seleciona um ponto compatível e comprova sua presença por GPS ou pelo QR Code disponibilizado no local.
5. A solicitação fica pendente até a cooperativa ou a administração conferir o material.
6. O operador informa a quantidade realmente recebida e confirma o descarte.
7. A quantidade confirmada sai do estoque pessoal, entra no estoque do ponto e gera pontos para o cidadão.
8. O cidadão acompanha o histórico e pode usar o saldo em sorteios e vouchers.

## 3. Cadastro, acesso e perfil

**Disponibilidade atual: Disponível.**

### Cidadão

- Pode criar uma conta informando nome, e-mail, telefone e senha.
- Pode entrar com e-mail e senha.
- Após o acesso, é direcionado ao ambiente correspondente ao seu perfil.
- Pode consultar o saldo de pontos, o volume do estoque pessoal e a quantidade de entregas pendentes.
- Pode editar nome, e-mail, telefone e endereço residencial.
- Pode encerrar a sessão.

### Administrador

- Pode consultar usuários, pesquisar por nome ou e-mail e filtrar por perfil.
- Pode editar dados cadastrais, alterar permissões e excluir contas.
- O sistema impede que um administrador remova o próprio acesso administrativo.

### Observações da versão atual

- A recuperação de senha por e-mail não faz parte desta versão e permanece identificada como evolução futura.
- A sessão pode ser renovada enquanto o token de atualização estiver válido.
- Login por redes sociais não faz parte da jornada funcional atual.

## 4. Mapa e pontos de coleta

**Disponibilidade atual: Disponível.**

### Cidadão

- Visualiza no mapa os pontos de coleta ativos.
- Pode filtrar os locais pelo tipo de resíduo aceito.
- Ao selecionar um ponto, consulta nome, endereço, horário, materiais aceitos, capacidade, volume acumulado e nível de ocupação.
- Pode abrir uma rota externa no Google Maps até o local escolhido.

### Regras da rede

- Pontos inativos ou cheios não devem receber novos descartes.
- Um ponto pode definir sua capacidade máxima, os materiais aceitos, o horário de funcionamento e um raio permitido para validação presencial.
- A listagem usada na etapa de transferência considera a compatibilidade entre os resíduos selecionados e os materiais aceitos pelo ponto.

### Observações da versão atual

- A distância real depende da autorização de localização no navegador. Sem essa permissão, os pontos continuam visíveis, mas sem cálculo de distância.
- Pontos temporários podem ter data final e deixam de aparecer automaticamente após o encerramento.

## 5. Estoque pessoal de resíduos

**Disponibilidade atual: Disponível.**

O estoque pessoal representa os materiais que o cidadão informou possuir antes da entrega física.

### Cidadão

- Pode cadastrar, consultar, pesquisar, editar e remover itens.
- Informa tipo do material, quantidade em quilogramas, descrição e observações.
- A interface oferece as categorias plástico, metal, papel e vidro.
- Pode solicitar uma transferência parcial ou total de um item.
- Pode selecionar mais de um item para uma mesma ida ao ponto de coleta.

### Regras importantes

- O cadastro aceita quantidades entre 1 kg e 1.000 kg.
- Quando uma transferência é solicitada, a quantidade fica reservada, mas ainda não sai definitivamente do estoque.
- Um item com quantidade reservada não pode ser removido.
- A baixa definitiva ocorre somente após a conferência presencial.
- Se o ponto confirmar uma quantidade menor, apenas o peso confirmado é retirado do estoque; a diferença volta a ficar disponível ao cidadão.

## 6. Leitor de código de barras

**Disponibilidade atual: Parcial e experimental.**

### O que já funciona

- A câmera do celular pode ler o número de um código de barras.
- O número lido é mostrado na tela e usado como descrição de apoio.
- Alguns prefixos fixos tentam sugerir uma categoria de material.

### Limites atuais

- Não existe consulta a uma base oficial de produtos ou marcas.
- O sistema não reconhece de forma confiável nome do produto, peso, composição da embalagem ou pontuação.
- O código lido ainda não é armazenado no cadastro definitivo do item.
- A sugestão por prefixo pode classificar produtos incorretamente e deve ser confirmada pelo cidadão.

Portanto, nesta versão, o leitor agiliza a digitação, mas **não substitui a escolha manual do material e da quantidade**.

## 7. Validação de presença e registro de descarte

**Disponibilidade atual: Disponível para GPS; QR Code parcial na operação.**

### Fluxo correto

1. O cidadão seleciona um ou mais itens do estoque pessoal.
2. Informa quanto pretende entregar de cada item.
3. Escolhe um ponto que aceite todos os materiais selecionados.
4. Comprova presença por GPS ou pelo QR Code do ponto.
5. Envia a solicitação de transferência.
6. O descarte fica com o status **pendente**.
7. A cooperativa ou o administrador confere o material e informa o peso efetivamente recebido.
8. Após a confirmação, o sistema atualiza os estoques e credita os pontos.

### Validação por GPS

- O navegador solicita permissão para obter a localização do celular.
- O sistema compara a posição do cidadão com as coordenadas do ponto de coleta.
- A entrega é bloqueada quando o cidadão está fora do raio permitido pelo ponto. O padrão utilizado atualmente é de até 1 km, podendo ser configurado por ponto.

### Validação por QR Code

O funcionamento atual é o seguinte:

- O **ponto de coleta** gera um QR Code temporário.
- O **cidadão** lê esse QR Code com o celular ou digita o código manualmente.
- O código confirma que o cidadão teve acesso ao QR disponibilizado fisicamente no local.
- Cada código vale por uma hora, pertence a um ponto específico e é desativado depois do uso.

O QR Code atual **não contém a lista de materiais do cidadão** e **não é gerado pelo cidadão para o atendente escanear**.

### Cooperativa ou empresa de coleta

- Visualiza as entregas pendentes dos pontos sob sua responsabilidade.
- Consulta cidadão, material, quantidade declarada, data, observações e ponto escolhido.
- Informa a quantidade real recebida e aprova a entrega.
- A quantidade confirmada deve ser maior que zero e não pode superar a quantidade declarada.
- Pode consultar uma projeção da pontuação antes da confirmação.

### Administrador

- Também pode acompanhar e confirmar entregas pendentes.
- Pode rejeitar descartes e liberar as quantidades reservadas.
- O sistema possui suporte para reverter uma confirmação e manter registro das ações administrativas.

### Observações da versão atual

- O sistema já sabe gerar e validar QR Codes, mas ainda não existe uma tela para o ponto de coleta gerar e exibir o código ao cidadão.
- A leitura pelo cidadão está disponível, porém o uso de um único QR para transferir vários itens na mesma operação ainda precisa ser validado.
- Aprovação e rejeição pela cooperativa respeitam os pontos vinculados à conta operacional.

## 8. Pontuação, carteira e extrato

**Disponibilidade atual: Disponível.**

### Regra de pontuação por descarte

- O cidadão recebe **10 pontos por quilograma confirmado**.
- Os pontos não são liberados na criação do estoque nem no envio da solicitação.
- O cálculo considera somente a quantidade realmente conferida.
- Exemplo: 2,5 kg confirmados geram 25 pontos.

### Atualizações após a confirmação

- O saldo do cidadão é atualizado.
- A quantidade confirmada é retirada do estoque pessoal.
- A mesma quantidade entra no inventário do ponto de coleta.
- O descarte passa de pendente para confirmado.

### Cidadão

- Consulta saldo atual e histórico de descartes.
- Visualiza entregas pendentes, confirmadas, rejeitadas ou estornadas.
- A plataforma também mantém registros de pontos consumidos em sorteios e vouchers.

O extrato reúne ganhos por descartes e campanhas, além dos pontos consumidos em vouchers e sorteios.

## 9. Campanhas com marcas parceiras

**Disponibilidade atual: Disponível para administração e participação do cidadão.**

### Administrador

- Pode criar uma campanha com título, descrição, patrocinador, período e pontos de recompensa.
- Pode listar campanhas ativas e encerradas.
- Pode editar, encerrar ou excluir campanhas.
- Campanhas só ficam disponíveis para participação quando estão ativas e dentro do período definido.

### Participação do cidadão

- Cada cidadão pode participar uma única vez de cada campanha.
- A inscrição concede imediatamente a quantidade de pontos definida pelo administrador.
- O sistema registra a participação para impedir duplicidade.
- A participação não exige validação do ponto de coleta.

O cidadão possui uma área de campanhas ativas, identifica as campanhas em que já participa e recebe a confirmação dos pontos creditados.

## 10. Sorteios

**Disponibilidade atual: Disponível.**

### Administrador

- Pode criar sorteios definindo título, prêmio, custo em pontos, período e situação.
- Pode editar ou excluir sorteios.
- Após o encerramento, pode realizar uma única apuração entre os bilhetes emitidos e publicar o vencedor.
- A plataforma lista ao cidadão apenas sorteios ativos e dentro do período de participação.

### Cidadão

- Consulta sorteios ativos, prêmio, período e custo em pontos.
- Usa pontos da carteira para comprar um bilhete numérico.
- Recebe uma numeração sequencial dentro do sorteio.
- Pode consultar seus bilhetes e abrir o sorteio para verificar o resultado publicado.

### Regras de participação

- É permitido **somente um bilhete por cidadão em cada sorteio**.
- O cidadão precisa ter saldo suficiente.
- A regra de negócio definida exige pelo menos um descarte confirmado com presença validada especificamente por GPS.
- Registros sem coordenadas válidas de GPS não desbloqueiam a participação.
- Os pontos são descontados no momento da emissão do bilhete.

### Observações da versão atual

- A tela informa o limite de um bilhete e a necessidade de um descarte presencial confirmado.
- Coordenadas ausentes ou zeradas não desbloqueiam a participação.
- O cidadão consulta os bilhetes já adquiridos, e a lista usa a contagem real de participantes.
- O resultado publicado informa o bilhete vencedor, o cidadão e o prêmio, mantendo registro na auditoria administrativa.

## 11. Vouchers e cupons

**Disponibilidade atual: Disponível.**

### Administrador

- Pode criar vouchers com título, parceiro, custo em pontos e quantidade disponível.
- Pode editar ou excluir vouchers.
- O sistema também aceita período de validade e situação ativa ou inativa.

### Cidadão

- Visualiza vouchers ativos, dentro da validade e com estoque disponível.
- Pode resgatar se possuir pontos suficientes.
- Não precisa ter descarte confirmado por GPS.
- Pode resgatar mais de uma unidade do mesmo voucher enquanto houver estoque e saldo.

### Regras do resgate

- Cada resgate reduz o estoque em uma unidade.
- Os pontos são descontados da carteira.
- O sistema gera um código promocional único no formato `RSDM-XXXXXXXX`.
- O código e o histórico do resgate ficam registrados.

Após o resgate, o código promocional é exibido imediatamente e permanece disponível na área de recompensas do cidadão.

## 12. Solicitação de novo ponto de coleta

**Disponibilidade atual: Disponível.**

### Solicitante

- Pode iniciar o cadastro como pessoa física ou jurídica, informando CPF ou CNPJ.
- Informa responsável, telefone, e-mail, senha, endereço e localização do ponto.
- Define materiais aceitos, capacidade máxima, dias e horários de funcionamento.
- A solicitação é enviada com situação pendente e o ponto não entra no mapa automaticamente.
- Se o envio falhar, a tela preserva os dados temporariamente para nova tentativa.

### Administrador

- Visualiza a fila de solicitações pendentes e os dados informados.
- Pode aprovar ou rejeitar, registrando observação ou motivo.
- A regra prevista para aprovação cria o ponto ativo e transforma o solicitante em responsável operacional.

Antes do envio, a jornada cria ou autentica a conta responsável. A solicitação fica vinculada a essa conta, permitindo que a aprovação crie o ponto e libere o acesso operacional.

## 13. Painel da cooperativa ou empresa de coleta

**Disponibilidade atual: Disponível.**

### Indicadores disponíveis

- Volume atualmente armazenado nos pontos vinculados.
- Quantidade de pontos monitorados e pontos ativos.
- Pontos próximos da capacidade máxima.
- Entregas pendentes.
- Estimativa de cidadãos aguardando confirmação.

### Operação de descartes

- A cooperativa vê somente entregas vinculadas aos seus pontos.
- Pode conferir o peso real e confirmar o recebimento.
- A confirmação dispara a pontuação e atualiza os estoques.
- Uma tela complementar agrupa os cidadãos que aguardam pontuação e mostra a projeção de pontos.

### Agenda de coletas

- A interface permite escolher ponto, data e turno para agendar uma retirada.
- Também permite listar e cancelar agendamentos.
- A cooperativa visualiza e altera somente os agendamentos dos pontos sob sua responsabilidade. O administrador mantém visão global.

### Gestão do ponto

O ambiente operacional permite consultar e atualizar nome, endereço, capacidade, materiais aceitos, horário, raio de operação e situação dos pontos vinculados à conta.

## 14. Painel administrativo

**Disponibilidade atual: Disponível para as rotinas principais.**

### Visão consolidada

- Total de usuários.
- Total de pontos de coleta.
- Quilogramas confirmados.
- Pontos distribuídos.
- Ocupação dos pontos e alertas de lotação.
- Destaque dos pontos com maior volume armazenado.

### Gestão de usuários

- Pesquisa e filtros por perfil.
- Edição de nome, e-mail e telefone.
- Promoção ou alteração de perfil.
- Exclusão protegida por regras de segurança.
- Pode aplicar crédito ou débito manual de pontos, com motivo obrigatório e registro da ação na auditoria.

### Gestão de pontos e descartes

- Aprovação e rejeição de solicitações de novos pontos.
- Consulta de ocupação e situação dos pontos.
- Desativação de ponto de coleta.
- Consulta, confirmação, rejeição e reversão de descartes.
- Filtros por cidadão, ponto, material, situação e período estão preparados no sistema, mas nem todos aparecem na interface atual.

### Relatórios e auditoria

- O sistema mantém registro de ações administrativas relevantes.
- Estão preparados relatórios de usuários, descartes e auditoria em formato de planilha CSV.
- O painel possui uma área para baixar os relatórios e consultar as atividades administrativas recentes.

## 15. Alertas de capacidade

**Disponibilidade atual: Preparado no sistema, sem central de notificações na interface.**

- Depois de uma confirmação, o sistema verifica a capacidade do ponto.
- Ao atingir a capacidade máxima, o ponto passa para a situação de cheio.
- É gerado um alerta interno para a administração ou cooperativa responsável.
- O alerta pode ser consultado e marcado como lido pelo sistema.
- A interface ainda não exibe uma central de notificações.

## 16. Certificado de coleta

**Disponibilidade atual: Disponível para descartes confirmados.**

O cidadão escolhe uma coleta confirmada e gera um certificado com dados reais, incluindo material, peso validado, pontos, data, ponto e identificação do documento. A opção de impressão permite salvar o certificado em PDF pelo navegador. O compartilhamento direto e a emissão de arquivo pelo servidor não fazem parte da versão atual.

## 17. Quadro geral de disponibilidade

| Área | Situação atual | Principal observação |
|---|---|---|
| Cadastro, login e perfil | Disponível | Recuperação de senha por e-mail permanece fora da versão atual |
| Mapa de pontos | Disponível | Distância depende da permissão de localização do cidadão |
| Estoque pessoal | Disponível | Cadastro, edição, reserva e transferência estão integrados |
| Código de barras | Parcial | Leitura sem base confiável de produtos e sem persistência do código |
| Descarte por GPS | Disponível | Exige presença dentro do raio do ponto |
| Descarte por QR Code | Parcial | Leitura existe, mas falta a tela operacional de geração |
| Confirmação de descarte | Disponível | Aprovação e rejeição respeitam o ponto da cooperativa |
| Pontuação e carteira | Disponível | Regra de 10 pontos por kg confirmado |
| Extrato consolidado | Disponível | Reúne descartes, campanhas, vouchers e sorteios |
| Campanhas | Disponível | Administração e participação do cidadão integradas |
| Sorteios | Disponível | Compra, histórico, apuração e publicação do resultado integradas |
| Vouchers | Disponível | Código aparece no resgate e fica disponível para consulta |
| Solicitação de ponto | Disponível | Pedido vinculado à conta e aprovação integrada |
| Painel operacional | Disponível | Confirmação, agenda e gestão dos próprios pontos integradas |
| Painel administrativo | Disponível | Inclui relatórios e auditoria na interface |
| Alertas de ponto cheio | Preparado no sistema | Falta central de notificações na interface |
| Certificado ambiental | Disponível | Usa coletas reais e pode ser salvo em PDF pelo navegador |

## 18. Evoluções fora do escopo desta versão

As jornadas solicitadas para mapa, campanhas, recompensas, solicitação de pontos, operação, administração e certificado estão integradas. Permanecem separadas para etapas futuras:

1. Implementar a recuperação de senha quando o produto estiver pronto para configurar o envio de e-mails.
2. Avaliar a emissão de certificado pelo servidor caso seja necessário compartilhar um arquivo pronto fora do navegador.
3. Evoluir o leitor de código de barras somente quando existir uma base confiável de produtos.
4. Concluir as jornadas operacionais de QR Code e a central de notificações em uma etapa futura específica.

---

Este manual descreve o comportamento disponível na versão atual da plataforma. Funcionalidades futuras ou deliberadamente excluídas desta etapa permanecem identificadas de forma explícita para não criar expectativas incorretas durante a apresentação comercial.
