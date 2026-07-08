-- SEED QA 2B - dados minimos para cooperativa/parceiro
--
-- Uso exclusivo em ambiente local/QA.
-- Este arquivo NAO cria dados automaticamente porque o schema real das tabelas
-- ponto_coleta, descarte e relacionamento com cooperativa_id nao esta presente
-- neste repositorio frontend.
--
-- Objetivo de QA:
-- - cooperativa.teste@residuum.com deve ter pelo menos um ponto de coleta associado;
-- - dashboard, agenda e aprovacao devem ter dados suficientes para nao ficarem vazios;
-- - nenhum ponto deve ser creditado automaticamente;
-- - nenhuma coleta deve ser confirmada artificialmente;
-- - nenhuma regra de negocio deve ser simulada.
--
-- Validacoes sugeridas apos consultar o schema real no backend:
--
-- SELECT id, nome, email, role
-- FROM usuario
-- WHERE email = 'cooperativa.teste@residuum.com';
--
-- SELECT *
-- FROM ponto_coleta
-- WHERE cooperativa_id = (
--   SELECT id FROM usuario WHERE email = 'cooperativa.teste@residuum.com'
-- );
--
-- SELECT *
-- FROM descarte
-- WHERE status IN ('pendente', 'aguardando_confirmacao', 'em_analise')
-- ORDER BY id DESC
-- LIMIT 20;
--
-- Se as colunas acima existirem, criar os dados de QA pelo backend/admin ou por
-- script especifico do schema real, mantendo status pendente e sem pontuacao.
DO $$
BEGIN
  RAISE NOTICE 'Schema operacional nao confirmado no frontend. Nenhum dado de cooperativa foi inserido.';
END $$;
