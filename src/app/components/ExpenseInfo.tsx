'use client';
import { Box, TextField, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { Expense } from '../interaface';

type ExpenseInfoProps = {
  expenses: Expense[];
};

export default function ExpenseInfo({ expenses }: ExpenseInfoProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [totalSpent, setTotalSpent] = useState(0);
  const [amountToSpend, setAmountToSpend] = useState('');
  const [isInput, setIsInput] = useState(false);
  const [difference, setDifference] = useState('');

  const getDaysOfTheMonth = () => {
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    return new Date(year, month, 0).getDate();
  };

  const getTotalSpent = () => {
    const total = expenses.reduce(
      (accumulator: number, currentValue: Expense) =>
        accumulator + currentValue.amount,
      0
    );
    setTotalSpent(total);
  };

  const activeInput = (state: boolean) => {
    setIsInput(state);
    if (!state) {
      window.localStorage.setItem('amountToSpend', amountToSpend)
    }
  };

  const calculateTotalExpensesAllowed = (): number => {
    const date = new Date();
    const days = getDaysOfTheMonth();
    const perDayExpenses = parseFloat(amountToSpend) / days;
    const totalAllowedToExpenseValue = perDayExpenses * date.getDate();
    return totalAllowedToExpenseValue;
  };

  const calculateDifference = (): string => {
    const allowedExpense = calculateTotalExpensesAllowed();
    const differenceValue = allowedExpense - totalSpent;
    return differenceValue.toFixed(2);
  };

  useEffect(() => {
    if (isInput) {
      inputRef.current?.focus();
    }
    const difference = calculateDifference();
    setDifference(difference);
  }, [isInput, totalSpent, expenses]);

  useEffect(() => {
    getDaysOfTheMonth();
    getTotalSpent();
    const amountToSpend = window.localStorage.getItem('amountToSpend') || 0;
    setAmountToSpend(amountToSpend.toString())
  }, [expenses]);

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <Box
        sx={{ display: 'flex', justifyContent: 'space-between', width: 250 }}
      >
        <Typography variant="body1">Gastado: </Typography>
        <Typography>${totalSpent.toFixed(2)}</Typography>
      </Box>
      <Box
        sx={{ display: 'flex', justifyContent: 'space-between', width: 250 }}
      >
        <Typography variant="body1">Total a gastar: </Typography>
        {isInput ? (
          <TextField
            id="input-amount-to-spend"
            size="small"
            inputRef={inputRef}
            type="number"
            value={amountToSpend}
            onBlur={() => activeInput(false)}
            onChange={(e) => setAmountToSpend(e.target.value)}
          />
        ) : (
          <Typography onClick={() => activeInput(true)}>
            ${amountToSpend || 0}
          </Typography>
        )}
      </Box>
      <Box
        sx={{ display: 'flex', justifyContent: 'space-between', width: 250 }}
      >
        <Typography variant="body1">Restante a gastar: </Typography>
        <Typography
          color={parseFloat(difference) > 0 ? 'primary' : 'error'}
        >
          $ {difference || 0}
        </Typography>
      </Box>
    </Box>
  );
}
