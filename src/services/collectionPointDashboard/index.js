import { listCollectionPoints } from "../collectionPoints";
import { getPendingDiscards } from "../discards";
import { CHART_DATA, MATERIAL_DATA } from "../../constants/dashboard";

const formatKg = (value) =>
  `${Number(value || 0).toLocaleString("pt-BR", {
    maximumFractionDigits: 1,
  })} kg`;

export const getCollectionPointDashboard = async () => {
  const [points, pendingDiscards] = await Promise.all([
    listCollectionPoints({ incluir_inativos: true }).catch(() => []),
    getPendingDiscards().catch(() => []),
  ]);

  const totalCollected = points.reduce(
    (sum, point) => sum + Number(point.total_inventario || 0),
    0,
  );
  const uniqueUsers = new Set(
    pendingDiscards.map((discard) => discard.usuario_id).filter(Boolean),
  ).size;
  const pointsActive = points.filter(
    (point) => point.status_calculado === "ativo",
  ).length;
  const criticalPoints = points.filter(
    (point) => Number(point.percentual_ocupacao || 0) >= 90,
  ).length;
  const primaryPoint = points[0];

  return {
    statCards: [
      {
        id: "total",
        title: "Total Coletado",
        value: formatKg(totalCollected),
        trend: `${points.length} ponto(s) monitorado(s)`,
        iconBg: "bg-green-100",
        iconColor: "text-green-500",
        icon: "Recycle",
      },
      {
        id: "users",
        title: "Usuários Atendidos",
        value: String(uniqueUsers),
        trend: `${pendingDiscards.length} coleta(s) pendente(s)`,
        iconBg: "bg-blue-100",
        iconColor: "text-blue-400",
        icon: "User",
      },
      {
        id: "coletas",
        title: "Pontos Vinculados",
        value: String(points.length),
        trend: `${pointsActive} ativo(s) agora`,
        iconBg: "bg-slate-800",
        iconColor: "text-white",
        icon: "Truck",
      },
      {
        id: "status",
        title: "Status do Sistema",
        value: criticalPoints > 0 ? "Atenção" : "Ativo",
        trend:
          criticalPoints > 0
            ? `${criticalPoints} ponto(s) crítico(s)`
            : "Operação estável",
        iconBg: "bg-yellow-100",
        iconColor: "text-yellow-500",
        icon: "Activity",
        valueClass: criticalPoints > 0 ? "text-amber-500" : "text-green-500",
      },
    ],
    chartData: CHART_DATA,
    materialData: MATERIAL_DATA,
    points,
    primaryPoint,
  };
};
