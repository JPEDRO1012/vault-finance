import {
  ExpenseCategory,
  Goal,
  Investment,
  PatrimonyMonth,
  PortfolioItem,
  RevenueExpenseMonth,
  Transaction,
} from "@/types/finance";

export const transactions: Transaction[] = [
  {
    id: "1",
    title: "Salário",
    amount: 3200,
    category: "Trabalho",
    type: "income",
    date: "2026-05-01",
  },
  {
    id: "2",
    title: "Freelancer",
    amount: 850,
    category: "Renda extra",
    type: "income",
    date: "2026-05-04",
  },
  {
    id: "3",
    title: "Mercado",
    amount: 420,
    category: "Alimentação",
    type: "expense",
    date: "2026-05-05",
  },
  {
    id: "4",
    title: "Academia",
    amount: 120,
    category: "Saúde",
    type: "expense",
    date: "2026-05-07",
  },
  {
    id: "5",
    title: "Cartão de crédito",
    amount: 780,
    category: "Cartão",
    type: "expense",
    date: "2026-05-09",
  },
  {
    id: "6",
    title: "Curso online",
    amount: 97,
    category: "Estudos",
    type: "expense",
    date: "2026-05-10",
  },
];

export const patrimonyData: PatrimonyMonth[] = [
  { month: "Jan", patrimony: 8200, invested: 4200 },
  { month: "Fev", patrimony: 9300, invested: 5100 },
  { month: "Mar", patrimony: 10800, invested: 6200 },
  { month: "Abr", patrimony: 12400, invested: 7400 },
  { month: "Mai", patrimony: 14150, invested: 8400 },
];

export const revenueExpenseData: RevenueExpenseMonth[] = [
  { month: "Jan", revenue: 2800, expenses: 2100 },
  { month: "Fev", revenue: 3100, expenses: 2300 },
  { month: "Mar", revenue: 3500, expenses: 2600 },
  { month: "Abr", revenue: 3900, expenses: 2700 },
  { month: "Mai", revenue: 4050, expenses: 1417 },
];

export const expenseCategories: ExpenseCategory[] = [
  { name: "Cartão", value: 780 },
  { name: "Alimentação", value: 420 },
  { name: "Saúde", value: 120 },
  { name: "Estudos", value: 97 },
];

export const investments: Investment[] = [
  {
    id: "1",
    name: "CDB Banco Premium",
    type: "CDB",
    amount: 2500,
    profitability: 1.05,
    monthlyReturn: 26.25,
    risk: "Baixo",
    date: "2026-01-15",
  },
  {
    id: "2",
    name: "Tesouro Selic 2029",
    type: "Tesouro Direto",
    amount: 1800,
    profitability: 0.92,
    monthlyReturn: 16.56,
    risk: "Baixo",
    date: "2026-02-02",
  },
  {
    id: "3",
    name: "MXRF11",
    type: "Fundos Imobiliários",
    amount: 1200,
    profitability: 1.2,
    monthlyReturn: 14.4,
    risk: "Médio",
    date: "2026-03-12",
  },
  {
    id: "4",
    name: "IVVB11",
    type: "ETF",
    amount: 1600,
    profitability: 2.1,
    monthlyReturn: 33.6,
    risk: "Médio",
    date: "2026-04-01",
  },
  {
    id: "5",
    name: "Bitcoin",
    type: "Criptomoedas",
    amount: 1300,
    profitability: 4.8,
    monthlyReturn: 62.4,
    risk: "Alto",
    date: "2026-04-22",
  },
];

export const goals: Goal[] = [
  {
    id: "1",
    title: "Reserva de emergência",
    target: 12000,
    current: 5300,
    deadline: "Dezembro 2026",
  },
  {
    id: "2",
    title: "Notebook novo",
    target: 5000,
    current: 2100,
    deadline: "Setembro 2026",
  },
  {
    id: "3",
    title: "Entrada do apartamento",
    target: 30000,
    current: 9000,
    deadline: "2030",
  },
];

export const portfolioData: PortfolioItem[] = [
  { name: "CDB", value: 2500 },
  { name: "Tesouro", value: 1800 },
  { name: "FIIs", value: 1200 },
  { name: "ETF", value: 1600 },
  { name: "Cripto", value: 1300 },
];