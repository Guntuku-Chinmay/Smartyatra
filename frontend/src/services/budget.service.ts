import api from "./api";

export interface Budget {
  id: number;
  estimated_cost: number;
  actual_cost: number;
  remaining_budget: number;
  trip_id: number;
}

export interface BudgetUpdateInput {
  estimated_cost?: number;
  actual_cost?: number;
  remaining_budget?: number;
}

export async function getBudgets(): Promise<Budget[]> {
  const response = await api.get("/budgets/");
  return response.data;
}

export async function createBudget(data: {
  estimated_cost: number;
  actual_cost: number;
  remaining_budget: number;
  trip_id: number;
}): Promise<Budget> {
  const response = await api.post("/budgets/", data);
  return response.data;
}

export async function updateBudget(id: number, data: BudgetUpdateInput): Promise<Budget> {
  const response = await api.put(`/budgets/${id}`, data);
  return response.data;
}