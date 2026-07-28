export const ROLE_GROUPS = {
  MORADOR: ["usuario", "morador"],
  OPERACIONAL: ["cooperativa", "ponto_coleta", "parceiro"],
  ADMIN: ["admin"],
};

export const normalizeRole = (role) =>
  String(role || "")
    .trim()
    .toLowerCase();

export const getRoleHome = (role) => {
  const normalizedRole = normalizeRole(role);

  if (normalizedRole === "admin") return "/admin";
  if (normalizedRole === "ponto_coleta") return "/dashboard";
  if (normalizedRole === "cooperativa" || normalizedRole === "parceiro") {
    return "/dashboard";
  }
  if (normalizedRole === "usuario" || normalizedRole === "morador") {
    return "/inicio";
  }

  return "/inicio";
};

export const getRoleLabel = (role) => {
  const normalizedRole = normalizeRole(role);

  if (normalizedRole === "admin") return "Administrador";
  if (normalizedRole === "cooperativa") return "Cooperativa";
  if (normalizedRole === "ponto_coleta" || normalizedRole === "parceiro") {
    return "Ponto de Coleta";
  }
  if (normalizedRole === "morador" || normalizedRole === "usuario") {
    return "Cidadão";
  }

  return "Perfil não identificado";
};

export const getRoleDescription = (role) => {
  const normalizedRole = normalizeRole(role);

  if (normalizedRole === "admin") {
    return "Gerencie usuários, pontos, campanhas e regras da plataforma.";
  }
  if (normalizedRole === "ponto_coleta") {
    return "Valide o recebimento físico dos resíduos descartados pelos cidadãos.";
  }
  if (normalizedRole === "cooperativa" || normalizedRole === "parceiro") {
    return "Acompanhe locais, agenda, coletas e confirmações operacionais.";
  }
  if (normalizedRole === "usuario" || normalizedRole === "morador") {
    return "Cadastre resíduos, valide entregas e acompanhe seu extrato.";
  }

  return "Seu perfil será direcionado para o início do morador até ser revisado.";
};

export const canAccessRole = (role, allowedRoles = []) => {
  const normalizedRole = normalizeRole(role);
  const normalizedAllowed = allowedRoles.map(normalizeRole);
  return normalizedAllowed.includes(normalizedRole);
};
