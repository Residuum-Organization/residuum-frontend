-- SEED QA 2B - usuarios de teste por perfil Residuum
--
-- Uso exclusivo em ambiente local/QA.
-- Nao executar automaticamente pela aplicacao.
-- Tabela alvo: usuario.
--
-- Estrategia:
-- 1. Tenta localizar uma coluna de senha/hash conhecida em usuario.
-- 2. Se existir o usuario base usuario.teste.atualizado@residuum.com,
--    copia o hash/senha dele para os tres usuarios de QA.
-- 3. Se nao for possivel clonar a senha, aplica apenas UPDATE de role
--    para usuarios ja criados pelo fluxo real.

DO $$
DECLARE
  password_column text;
  base_password text;
  qa_user record;
BEGIN
  SELECT column_name
    INTO password_column
  FROM information_schema.columns
  WHERE table_name = 'usuario'
    AND column_name IN ('senha_hash', 'password_hash', 'senha', 'password')
  ORDER BY CASE column_name
    WHEN 'senha_hash' THEN 1
    WHEN 'password_hash' THEN 2
    WHEN 'senha' THEN 3
    WHEN 'password' THEN 4
    ELSE 5
  END
  LIMIT 1;

  IF password_column IS NOT NULL THEN
    EXECUTE format(
      'SELECT %I FROM usuario WHERE email = %L LIMIT 1',
      password_column,
      'usuario.teste.atualizado@residuum.com'
    )
    INTO base_password;
  END IF;

  FOR qa_user IN
    SELECT *
    FROM (VALUES
      ('Administrador QA 2B', 'admin.teste@residuum.com', 'admin'),
      ('Cooperativa QA 2B', 'cooperativa.teste@residuum.com', 'cooperativa'),
      ('Morador QA 2B', 'morador.teste@residuum.com', 'usuario')
    ) AS users(nome, email, role)
  LOOP
    IF password_column IS NOT NULL AND base_password IS NOT NULL THEN
      IF EXISTS (SELECT 1 FROM usuario WHERE email = qa_user.email) THEN
        EXECUTE format(
          'UPDATE usuario SET nome = %L, role = %L, %I = $1 WHERE email = %L',
          qa_user.nome,
          qa_user.role,
          password_column,
          qa_user.email
        )
        USING base_password;
      ELSE
        EXECUTE format(
          'INSERT INTO usuario (nome, email, role, %I) VALUES (%L, %L, %L, $1)',
          password_column,
          qa_user.nome,
          qa_user.email,
          qa_user.role
        )
        USING base_password;
      END IF;
    ELSE
      UPDATE usuario
      SET role = qa_user.role
      WHERE email = qa_user.email;

      RAISE NOTICE
        'Senha/hash nao confirmado. Se % nao existir, crie pelo cadastro real e rode novamente para ajustar role.',
        qa_user.email;
    END IF;
  END LOOP;
END $$;

-- Validacao sugerida:
SELECT id, nome, email, role
FROM usuario
WHERE email IN (
  'admin.teste@residuum.com',
  'cooperativa.teste@residuum.com',
  'morador.teste@residuum.com'
)
ORDER BY email;
