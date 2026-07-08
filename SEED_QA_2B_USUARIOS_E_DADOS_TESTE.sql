-- SEED QA 2B - usuarios de teste por perfil Residuum
-- Uso exclusivo em ambiente local/QA.
-- Tabela alvo: usuario.
-- Este script cria/atualiza tres usuarios de QA copiando a senha_hash
-- do usuario base usuario.teste.atualizado@residuum.com.

DO $$
DECLARE
  base_password text;
BEGIN
  SELECT senha_hash
  INTO base_password
  FROM usuario
  WHERE email = 'usuario.teste.atualizado@residuum.com'
  LIMIT 1;

  IF base_password IS NULL THEN
    RAISE EXCEPTION 'Usuario base usuario.teste.atualizado@residuum.com nao encontrado ou sem senha_hash.';
  END IF;

  -- Admin
  IF EXISTS (SELECT 1 FROM usuario WHERE email = 'admin.teste@residuum.com') THEN
    UPDATE usuario
    SET
      nome = 'Administrador QA 2B',
      telefone = '92999990001',
      senha_hash = base_password,
      role = 'admin'
    WHERE email = 'admin.teste@residuum.com';
  ELSE
    INSERT INTO usuario (
      nome,
      email,
      telefone,
      senha_hash,
      role
    )
    VALUES (
      'Administrador QA 2B',
      'admin.teste@residuum.com',
      '92999990001',
      base_password,
      'admin'
    );
  END IF;

  -- Cooperativa
  IF EXISTS (SELECT 1 FROM usuario WHERE email = 'cooperativa.teste@residuum.com') THEN
    UPDATE usuario
    SET
      nome = 'Cooperativa QA 2B',
      telefone = '92999990002',
      senha_hash = base_password,
      role = 'cooperativa'
    WHERE email = 'cooperativa.teste@residuum.com';
  ELSE
    INSERT INTO usuario (
      nome,
      email,
      telefone,
      senha_hash,
      role
    )
    VALUES (
      'Cooperativa QA 2B',
      'cooperativa.teste@residuum.com',
      '92999990002',
      base_password,
      'cooperativa'
    );
  END IF;

  -- Morador
  IF EXISTS (SELECT 1 FROM usuario WHERE email = 'morador.teste@residuum.com') THEN
    UPDATE usuario
    SET
      nome = 'Morador QA 2B',
      telefone = '92999990003',
      senha_hash = base_password,
      role = 'usuario'
    WHERE email = 'morador.teste@residuum.com';
  ELSE
    INSERT INTO usuario (
      nome,
      email,
      telefone,
      senha_hash,
      role
    )
    VALUES (
      'Morador QA 2B',
      'morador.teste@residuum.com',
      '92999990003',
      base_password,
      'usuario'
    );
  END IF;
END $$;

-- Validacao
SELECT id, nome, email, telefone, role
FROM usuario
WHERE email IN (
  'admin.teste@residuum.com',
  'cooperativa.teste@residuum.com',
  'morador.teste@residuum.com'
)
ORDER BY email;
