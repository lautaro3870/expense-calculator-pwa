import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Category, Expense } from '../interaface';
import { Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

type ExpenseTableProps = {
  expenses: Expense[];
  categories: Category[];
  deleteExpense: (id: string) => void;
};

export default function ExpenseTable({
  categories,
  expenses,
  deleteExpense,
}: ExpenseTableProps) {
  return (
    <TableContainer component={Paper} sx={{ height: '100%', overflow: 'auto' }}>
      <Table stickyHeader aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Gasto</TableCell>
            <TableCell align="right">Categoria</TableCell>
            <TableCell align="right">Fecha</TableCell>
            <TableCell align="right">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {expenses.map((expense: Expense) => (
            <TableRow
              key={expense.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                ${expense.amount}
              </TableCell>
              <TableCell align="right">{expense.categoryName}</TableCell>
              <TableCell align="right">{new Date(expense.date).toLocaleDateString('es-AR')}</TableCell>
              <TableCell align="right">
                <Button
                  color="error"
                  variant="contained"
                  onClick={() => deleteExpense(expense.id)}
                >
                  <DeleteIcon />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
