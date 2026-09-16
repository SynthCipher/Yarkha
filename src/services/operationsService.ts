import { stockRepository } from "@/repositories/stockRepository";
import { staffRepository } from "@/repositories/staffRepository";
import { attendanceRepository } from "@/repositories/attendanceRepository";
import { taskRepository } from "@/repositories/taskRepository";
import { equipmentRepository } from "@/repositories/equipmentRepository";
import { expenseEntryRepository } from "@/repositories/expenseEntryRepository";
import { gardenVisitRepository } from "@/repositories/gardenVisitRepository";
import { orderRepository } from "@/repositories/orderRepository";

export const operationsService = {
  async getDashboardOperationsSummary() {
    const [
      lowStockMaterials,
      activeStaffCount,
      todayStaffOnDuty,
      openTasksCount,
      dueTasks,
      equipmentDueCount,
      equipmentDueList,
      pendingGardenVisits,
      expensesBySection,
      totalExpenses,
      orderMetrics,
    ] = await Promise.all([
      stockRepository.getLowStockItems(),
      staffRepository.countActive(),
      attendanceRepository.getTodayStaffOnDuty(),
      taskRepository.getOpenTasksCount(),
      taskRepository.getDueTasks(4),
      equipmentRepository.getMaintenanceDueCount(),
      equipmentRepository.getEquipmentDueForMaintenance(4),
      gardenVisitRepository.countPending(),
      expenseEntryRepository.getExpensesBySection(),
      expenseEntryRepository.getTotalExpenses(),
      orderRepository.getMetrics(),
    ]);

    return {
      commercial: {
        todayOrders: orderMetrics.todayOrders,
        pendingOrders: orderMetrics.pendingOrders,
        totalRevenue: orderMetrics.totalRevenue,
      },
      physicalOperations: {
        activeStaffCount,
        todayStaffOnDuty,
        openTasksCount,
        dueTasks,
        equipmentDueCount,
        equipmentDueList,
        lowStockMaterialsCount: lowStockMaterials.length,
        lowStockMaterials,
        pendingGardenVisits,
      },
      finances: {
        totalExpenses,
        expensesBySection,
      },
    };
  },
};
