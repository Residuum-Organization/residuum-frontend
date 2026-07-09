import { listCollectionPoints } from "../collectionPoints";
import { getPendingDiscards } from "../discards";
import { getApiErrorMessage } from "../http/getApiErrorMessage";

export const getCollectionPointDashboard = async () => {
  try {
    const [points, pendingDiscards] = await Promise.all([
      listCollectionPoints({ incluir_inativos: true }),
      getPendingDiscards(),
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
      hasOperationalData: points.length > 0 || pendingDiscards.length > 0,
    };
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Não foi possível carregar os dados do dashboard operacional."));
  }
};
