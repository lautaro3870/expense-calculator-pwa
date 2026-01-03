'use client';
import { Button, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import DeleteIcon from '@mui/icons-material/Delete';
import { Category } from '../interaface';
import { v4 as uuidv4 } from 'uuid';
import { useEffect, useState } from 'react';

export default function Categories() {
  const [inputValue, setInputValue] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);

  const createCategory = (e: any) => {
    e.preventDefault();
    if (!inputValue) return;
    const categoryExsists = categories.some(
      (c: Category) => c.category === inputValue.trim()
    );
    if (categoryExsists) return;
    const category: Category = {
      id: uuidv4(),
      category: inputValue.trim(),
    };
    const listOfCategories: Category[] = categories.concat(category);
    setCategories(listOfCategories);
    window.localStorage.setItem('categories', JSON.stringify(listOfCategories));
    setInputValue('');
  };

  const getCategories = () => {
    const listOfCategories = window.localStorage.getItem('categories');
    const categoriesConverted = listOfCategories
      ? JSON.parse(listOfCategories)
      : [];
    setCategories(categoriesConverted);
  };

  const deleteCategory = (id: string) => {
    const newList = categories.filter((c: Category) => c.id !== id);
    setCategories(newList);
    window.localStorage.setItem('categories', JSON.stringify(newList));
  }

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        boxSizing: 'border-box',
      }}
    >
      <form
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 10,
          marginTop: '3rem',
          marginBottom: '3rem',
        }}
        onSubmit={createCategory}
      >
        <TextField
          label="Categoria"
          size="small"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <Button variant="contained" type="submit">
          <AddIcon />
        </Button>
      </form>
      <TableContainer
        component={Paper}
        sx={{ height: '100%', overflow: 'auto' }}
      >
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Categoria</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category: Category) => (
              <TableRow
                key={category.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {category.category}
                </TableCell>
                <TableCell align="right">
                  <Button color="error" variant="contained" onClick={() => deleteCategory(category.id)}>
                    <DeleteIcon />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
