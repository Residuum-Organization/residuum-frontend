-- SEED QA - usuarios de teste por perfil Residuum
-- FASE QA 2A
--
-- Este arquivo NAO deve ser executado automaticamente.
-- Use apenas em ambiente local/de QA e revise o schema real antes de rodar.
--
-- O front-end indica roles "admin", "usuario", "cooperativa" e "parceiro",
-- mas o schema de banco e o padrao de hash de senha nao estao disponiveis
-- neste repositorio frontend. Por isso, este seed nao cria senhas novas.
--
-- Estrategia segura sugerida:
-- 1. Criar os usuarios pelo fluxo real da aplicacao ou pelo backend.
-- 2. Ajustar apenas o campo role para testar perfis.

-- Admin de QA
-- UPDATE usuarios
-- SET role = 'admin'
-- WHERE email = 'admin.teste@residuum.com';

-- Cooperativa/parceiro operacional de QA
-- UPDATE usuarios
-- SET role = 'cooperativa'
-- WHERE email = 'cooperativa.teste@residuum.com';

-- Morador/usuario final de QA
-- UPDATE usuarios
-- SET role = 'usuario'
-- WHERE email = 'morador.teste@residuum.com';

-- Validacao sugerida apos revisar/executar localmente:
-- SELECT id, nome, email, role
-- FROM usuarios
-- WHERE email IN (
--   'admin.teste@residuum.com',
--   'cooperativa.teste@residuum.com',
--   'morador.teste@residuum.com'
-- );
