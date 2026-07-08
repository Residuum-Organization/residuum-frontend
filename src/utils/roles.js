export const ROLE_GROUPS = {
  MORADOR: ["usuario", "morador"],
  OPERACIONAL: ["cooperativa", "parceiro"],
  ADMIN: ["admin"],
};

export const normalizeRole = (role) => String(role || "").trim().toLowerCase();

export const getRoleHome = (role) => {
  const normalizedRole = normalizeRole(role);

  if (normalizedRole === "admin") return "/admin";
  if (normalizedRole === "cooperativa" || normalizedRole === "parceiro") {
    return "/dashboard";
  }
  if (normalizedRole === "usuario" || normalizedRole === "morador") {
    return "/welcome-residuum";
  }

  return "/welcome-residuum";
};

export const getRoleLabel = (role) => {
  const normalizedRole = normalizeRole(role);

  if (normalizedRole === "admin") return "Administrador";
  if (normalizedRole === "cooperativa" || normalizedRole === "parceiro") {
    return "Cooperativa / Empresa de coleta";
  }
  if (normalizedRole === "morador" || normalizedRole === "usuario") {
    return "Morador / Gerador";
  }

  return "Perfil nao identificado";
};

export const getRoleDescription = (role) => {
  const normalizedRole = normalizeRole(role);

  if (normalizedRole === "admin") {
    return "Gerencie usuarios, pontos, campanhas e regras da plataforma.";
  }
  if (normalizedRole === "cooperativa" || normalizedRole === "parceiro") {
    return "Acompanhe pontos, agenda, coletas e confirmacoes operacionais.";
  }
  if (normalizedRole === "usuario" || normalizedRole === "morador") {
    return "Cadastre residuos, valide entregas e acompanhe seu extrato.";
  }

  return "Seu perfil sera direcionado para o inicio do morador ate ser revisado.";
};

export const canAccessRole = (role, allowedRoles = []) => {
  const normalizedRole = normalizeRole(role);
  return allowedRoles.map(normalizeRole).includes(normalizedRole);
};
