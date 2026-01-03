export interface Category {
  id: string;
  category: string;
}

export interface Expense {
  id: string;
  amount: number;
  date: string;
  categoryId: string;
  categoryName: string;
  timestamp: number;
}

export interface MonthlyCategoryReport {
  month: string; // '2025-01'
  categories: {
    categoryId: string;
    categoryName: string;
    total: number;
  }[];
};

export type CategoryTotal = {
  categoryName: string;
  total: number;
};
