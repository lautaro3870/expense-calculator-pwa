'use client'
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Category } from '../interaface';
import { useState } from 'react';

type ExpenseFormProps = {
  categories: Category[];
  createExpense: (amount: number, category: Category) => boolean;
  deleteAllExpenses: () => void;
  expenseInputId: string;
};

export default function ExpenseForm({
  categories,
  createExpense,
  deleteAllExpenses,
  expenseInputId,
}: ExpenseFormProps) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category | null>(null);

  const getFormData = (e: React.FormEvent) => {
    e.preventDefault();
    if (category) {
      const result = createExpense(parseFloat(amount), category);
      if (result) {
        setAmount('');
        setCategory(null);
      }
    }
  };

  return (
    <form onSubmit={getFormData}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: 1,
          justifyContent: 'center',
          marginBottom: '1rem',
        }}
      >
        <TextField
          id={expenseInputId}
          size="small"
          label="Gasto"
          sx={{ width: '7rem' }}
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <FormControl size="small" sx={{ width: '7rem' }}>
          <InputLabel id="demo-simple-select-label">Categoria</InputLabel>
          <Select
            id="demo-simple-select"
            label="Categoria"
            value={category ? JSON.stringify(category) : ''}
            labelId="demo-simple-select-label"
            onChange={(e) => {
              const value = e.target.value;
              setCategory(value ? JSON.parse(value) : null);
            }}
          >
            <MenuItem value="">Categoria</MenuItem>
            {categories.map((c: Category) => (
              <MenuItem value={JSON.stringify(c)} key={c.id}>
                {c.category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" type="submit">
          <AddIcon />
        </Button>
        <Button variant="contained" color="error" onClick={deleteAllExpenses}>
          <DeleteIcon />
        </Button>
      </Box>
    </form>
  );
}
