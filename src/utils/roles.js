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
  if (normalizedRole === "cooperativa") return "Cooperativa";
  if (normalizedRole === "parceiro") return "Parceiro";
  if (normalizedRole === "morador") return "Morador";
  if (normalizedRole === "usuario") return "Morador";

  return "Perfil nao identificado";
};

export const getRoleDescription = (role) => {
  const normalizedRole = normalizeRole(role);

  if (normalizedRole === "admin") {
    return "Voce esta gerenciando usuarios, pontos e campanhas.";
  }
  if (normalizedRole === "cooperativa" || normalizedRole === "parceiro") {
    return "Voce esta acompanhando pontos, agenda e coletas.";
  }
  if (normalizedRole === "usuario" || normalizedRole === "morador") {
    return "Voce esta no fluxo de descarte, estoque e recompensas.";
  }

  return "Seu perfil sera direcionado para o inicio do morador ate ser revisado.";
};

export const canAccessRole = (role, allowedRoles = []) => {
  const normalizedRole = normalizeRole(role);
  return allowedRoles.map(normalizeRole).includes(normalizedRole);
};
