import { listCollectionPoints } from "../collectionPoints";
import { getPendingDiscards } from "../discards";
import api from "../../api/client";
import { getApiErrorMessage } from "../http/getApiErrorMessage";

export const getCollectionPointDashboard = async () => {
  try {
    const [points, pendingDiscards, { data: solicitacoes }] = await Promise.all([
      listCollectionPoints({ incluir_inativos: true }),
      getPendingDiscards(),
      api.get("/cooperativa/solicitacoes-coleta"),
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

    // Build real inventory data
    const inventoryMap = {};
    points.forEach((p) => {
      Object.entries(p.inventario || {}).forEach(([k, v]) => {
        inventoryMap[k] = (inventoryMap[k] || 0) + Number(v);
      });
    });
    
    const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#14b8a6", "#ec4899", "#84cc16"];
    let colorIndex = 0;
    const inventoryChartData = Object.entries(inventoryMap)
      .map(([label, val]) => ({
        label: label.charAt(0).toUpperCase() + label.slice(1),
        val,
        color: colors[colorIndex++ % colors.length]
      }))
      .filter((x) => x.val > 0)
      .sort((a, b) => b.val - a.val);

    // Build real historical volume data (last 6 months)
    const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    const now = new Date();
    const last6Months = Array.from({ length: 6 }).map((_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
      return { year: d.getFullYear(), month: d.getMonth(), label: monthNames[d.getMonth()] };
    });

    const solicitacoesConcluidas = solicitacoes.filter(s => s.status === "concluida" && s.data_conclusao);
    
    const volumeHistoryChartData = last6Months.map(m => {
      const vol = solicitacoesConcluidas.reduce((sum, s) => {
        const d = new Date(s.data_conclusao);
        if (d.getFullYear() === m.year && d.getMonth() === m.month) {
          return sum + (Number(s.quantidade_coletada) || 0);
        }
        return sum;
      }, 0);
      return { month: m.label, val: vol };
    });

    return {
      metrics: {
        totalCollected,
        uniqueUsers,
        totalPoints: points.length,
        pointsActive,
        criticalPoints,
        pendingDiscards: pendingDiscards.length
      },
      points,
      inventoryChartData,
      volumeHistoryChartData,
      hasOperationalData: points.length > 0 || pendingDiscards.length > 0 || solicitacoes.length > 0,
    };
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Não foi possível carregar os dados do dashboard operacional."));
  }
};
