'use client';
import ExpenseTable from './components/ExpenseTable';
import ExpenseForm from './components/ExpenseForm';
import ExpenseInfo from './components/ExpenseInfo';
import { useEffect, useState } from 'react';
import { Category, Expense } from './interaface';
import { v4 as uuidv4 } from 'uuid';
import Swal from 'sweetalert2';

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const expenseInputId = 'expense-input';

  const getExpensesAndCategories = () => {
    const listOfExpenses = window.localStorage.getItem('expenses');
    const listOfCategories = window.localStorage.getItem('categories');
    const expensesConverted = listOfExpenses ? JSON.parse(listOfExpenses) : [];
    const categoriesConverted = listOfCategories
      ? JSON.parse(listOfCategories)
      : [];

    const finalList = expensesConverted.map((expense: Expense) => {
      const category = categoriesConverted.find(
        (c: Category) => c.id === expense.categoryId
      );
      return {
        ...expense,
        categoryName: category ? category.category : 'Sin categoría',
      };
    });
    setExpenses(finalList);
    setCategories(categoriesConverted);
  };

  const buildMonthlyReportFromExpenses = (
    expenses: Expense[]
  ): Record<
    string,
    {
      categoryId: string;
      categoryName: string;
      total: number;
    }
  > => {
    return expenses.reduce((acc, expense) => {
      if (!acc[expense.categoryId]) {
        acc[expense.categoryId] = {
          categoryId: expense.categoryId,
          categoryName: expense.categoryName,
          total: 0,
        };
      }

      acc[expense.categoryId].total += expense.amount;
      return acc;
    }, {} as Record<string, any>);
  };

  const persistMonthlyReport = (expenses: Expense[]) => {
    if (!expenses.length) return;

    const raw = localStorage.getItem('expensesReport');
    const report = raw ? JSON.parse(raw) : {};

    const now = new Date();
    const monthKey = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, '0')}`;

    report[monthKey] = buildMonthlyReportFromExpenses(expenses);

    localStorage.setItem('expensesReport', JSON.stringify(report));
  };

  const createExpense = (amount: number, category: Category): boolean => {
    if (!amount || !category?.id) return false;

    // const now = new Date(2025, 6, 10);
    const now = new Date();

    const newExpense: Expense = {
      id: uuidv4(),
      amount: Number(amount.toFixed(3)),
      date: now.toISOString(),
      categoryId: category.id,
      categoryName: category.category,
      timestamp: now.getTime(),
    };

    setExpenses((prev) => {
      const updatedExpenses = [newExpense, ...prev];
      localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
      return updatedExpenses;
    });
    return true;
  };

  const deleteExpense = (id: string) => {
    const newList = expenses.filter((e: Expense) => e.id !== id);
    setExpenses(newList);
    window.localStorage.setItem('expenses', JSON.stringify(newList));
  };

  const deleteAllExpenses = () => {
    Swal.fire({
      title: '¿Eliminar todos los gastos?',
      showDenyButton: true,
      confirmButtonText: 'Confirmar',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Eliminados!', '', 'success');
        const newList: Expense[] = [];
        setExpenses(newList);
        window.localStorage.setItem('expenses', JSON.stringify(newList));
      } else if (result.isDenied) {
        Swal.close();
      }
    });
  };

  useEffect(() => {
    getExpensesAndCategories();
    document.getElementById(expenseInputId)?.focus();
  }, []);

  useEffect(() => {
    persistMonthlyReport(expenses);
  }, [expenses]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        boxSizing: 'border-box',
        marginTop: '3rem',
      }}
    >
      <ExpenseForm
        categories={categories}
        createExpense={createExpense}
        deleteAllExpenses={deleteAllExpenses}
        expenseInputId={expenseInputId}
      />
      <hr style={{ width: '100%', border: '1px solid' }} />
      <ExpenseInfo expenses={expenses} />
      <hr style={{ width: '100%', border: '1px solid' }} />
      <br />
      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflow: 'auto',
          marginBottom: '3rem',
        }}
      >
        <ExpenseTable
          categories={categories}
          expenses={expenses}
          deleteExpense={deleteExpense}
        />
      </div>
    </div>
  );
}
