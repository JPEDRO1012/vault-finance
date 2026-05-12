export type TransactionType = "income" | "expense";

export type Transaction = {
  id: string;
  title: string;
  amount: number;
  category: string;
  type: TransactionType;
  date: string;
};

export type InvestmentRisk = "Baixo" | "Médio" | "Alto";

export type Investment = {
  id: string;
  name: string;
  type: string;
  amount: number;
  profitability: number;
  monthlyReturn: number;
  risk: InvestmentRisk;
  date: string;
};

export type Goal = {
  id: string;
  title: string;
  target: number;
  current: number;
  deadline: string;
};

export type PatrimonyMonth = {
  month: string;
  patrimony: number;
  invested: number;
};

export type RevenueExpenseMonth = {
  month: string;
  revenue: number;
  expenses: number;
};

export type ExpenseCategory = {
  name: string;
  value: number;
};

export type PortfolioItem = {
  name: string;
  value: number;
};