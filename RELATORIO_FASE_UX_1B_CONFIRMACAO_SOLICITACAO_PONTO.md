# RELATORIO FASE UX 1B - CONFIRMACAO SOLICITACAO PONTO

## 1. Resumo da fase

A FASE UX 1B corrigiu o fluxo da tela `/confirmacao` para impedir que falhas no envio da solicitacao de ponto de coleta sejam exibidas como sucesso real. Agora o sucesso real depende de confirmacao do backend, e falhas preservam os dados localmente como fallback/rascunho local.

## 2. Arquivos alterados

- `src/pages/ConfirmationPage.jsx`
- `src/services/collectionPointRequests/index.js`
- `RELATORIO_FASE_UX_1B_CONFIRMACAO_SOLICITACAO_PONTO.md`

## 3. O problema encontrado

O servico `submitCollectionPointRequest` capturava erro de rede ou resposta `404`, criava um registro local com status `pendente` e retornava esse fallback como se fosse resultado do POST. A tela `/confirmacao` tratava qualquer retorno da mutation como sucesso, limpava o draft e exibia mensagem/status de envio real.

Com isso, o usuario podia acreditar que a solicitacao tinha sido enviada ao servidor mesmo quando ela existia apenas em `sessionStorage`.

## 4. O que foi corrigido

- O POST agora so e considerado sucesso quando o backend retorna HTTP `200` ou `201`.
- Falhas de rede, `404`, `422`, `401`, `403` e `5xx` nao retornam sucesso falso.
- O fallback local foi mantido, mas agora e salvo com `isLocalFallback: true`, `origem: "local_fallback"` e status `rascunho_local`.
- A tela diferencia status real de fallback local.
- Em caso de erro, o draft nao e apagado.
- Foi adicionado botao de nova tentativa, desabilitado durante o envio.
- Foram adicionadas validacoes basicas antes do POST para dados obrigatorios do payload.
- A consulta GET com lista vazia nao reutiliza status real antigo salvo localmente.

## 5. Endpoint usado

- `POST http://127.0.0.1:8080/solicitacoes-pontos-coleta`
- `GET http://127.0.0.1:8080/solicitacoes-pontos-coleta/minha`

## 6. Payload enviado

O payload continua sendo montado por `buildCollectionPointPayload`:

```json
{
  "tipo_solicitante": "cpf ou cnpj",
  "tipo_responsavel": "cpf ou cnpj",
  "documento": "somente numeros",
  "responsavel_nome": "nome do responsavel",
  "responsavel_telefone": "somente numeros",
  "email": "email do responsavel",
  "nome_ponto": "nome do ponto ou responsavel",
  "endereco": "endereco formatado",
  "latitude": null,
  "longitude": null,
  "horario_funcionamento": "horario informado",
  "tipos_residuos_aceitos": ["plastico", "metal"],
  "capacidade_maxima": "quantidade informada",
  "observacoes": "observacoes informadas"
}
```

## 7. Como o fallback ficou funcionando

Quando o envio falha, a tela salva um fallback em `sessionStorage` apenas como rascunho local:

```json
{
  "id_solicitacao": "local-timestamp",
  "status": "rascunho_local",
  "isLocalFallback": true,
  "origem": "local_fallback",
  "mensagem": "mensagem amigavel do erro",
  "created_at": "data ISO",
  "payload": {}
}
```

Esse fallback nao e exibido como solicitacao enviada. A interface mostra aviso de solicitacao salva localmente e permite tentar enviar novamente.

## 8. Como testar manualmente

1. Rodar `npm run dev`.
2. Fazer login como usuario comum.
3. Abrir `/cadastro-ponto-coleta`.
4. Preencher o fluxo ate `/confirmacao`.
5. Selecionar pelo menos um tipo de residuo, preencher quantidade e horario.
6. Finalizar com backend ligado.
7. Confirmar POST `/solicitacoes-pontos-coleta` retornando `200` ou `201`.
8. Confirmar mensagem de sucesso real e status pendente.
9. Derrubar o backend ou simular erro no endpoint.
10. Tentar finalizar novamente.
11. Confirmar que a tela nao mostra sucesso real.
12. Confirmar mensagem de erro clara, fallback local e botao de nova tentativa.
13. Confirmar que os dados do draft permanecem disponiveis para reenviar.

## 9. Riscos ou pendencias

- As validacoes obrigatorias foram feitas com base no payload atual; se o backend exigir novos campos, sera necessario atualizar a validacao.
- O projeto possui textos com encoding corrompido em varios arquivos existentes; esta fase nao fez correcao global de encoding.
- O fallback preserva o payload localmente, mas nao cria sincronizacao automatica em segundo plano.
