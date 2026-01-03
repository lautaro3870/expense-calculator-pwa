'use client';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Category, CategoryTotal, MonthlyCategoryReport } from '../interaface';
import { useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import Swal from 'sweetalert2';
import DownloadIcon from '@mui/icons-material/Download';
import { CSVLink } from 'react-csv';

export default function Report() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [expensesReport, setExpensesReport] = useState<MonthlyCategoryReport[]>(
    []
  );
  const [totalAmountSpent, setTotalAmountSpent] = useState('');
  const [reportData, setReportData] = useState<Record<string, number>[]>([]);
  const stickyColumnWidth = 70;

  const getHeaderAndRowStyle = (zIndex: number = 3) => {
    return {
      position: 'sticky',
      left: 0,
      width: stickyColumnWidth,
      minWidth: stickyColumnWidth,
      maxWidth: stickyColumnWidth,
      backgroundColor: 'background.paper',
      boxShadow: '2px 0 4px rgba(0,0,0,0.1)',
      zIndex,
    };
  };

  const getMonth = (date: string) => {
    const month = date.split('-');
    const months: { [key: string]: string } = {
      '01': 'Enero',
      '02': 'Febrero',
      '03': 'Marzo',
      '04': 'Abril',
      '05': 'Mayo',
      '06': 'Junio',
      '07': 'Julio',
      '08': 'Agosto',
      '09': 'Septiembre',
      '10': 'Octubre',
      '11': 'Noviembre',
      '12': 'Diciembre',
    };
    return months[month[1] as string];
  };

  const getTotalByCategoryFromTable = (
    report: MonthlyCategoryReport[],
    categories: Category[]
  ): CategoryTotal[] => {
    return categories.map((category) => {
      const total = report.reduce((sum, month) => {
        const data = month.categories.find((c) => c.categoryId === category.id);
        return sum + (data?.total ?? 0);
      }, 0);

      return {
        categoryName: category.category,
        total,
      };
    });
  };

  const calculateTotalSpent = (
    report: MonthlyCategoryReport[],
    categories: Category[] | []
  ): number => {
    return report.reduce((acc, month) => {
      const monthTotal = categories.reduce((sum, category) => {
        const categoryData = month.categories.find(
          (c) => c.categoryId === category.id
        );

        return sum + (categoryData?.total ?? 0);
      }, 0);

      return acc + monthTotal;
    }, 0);
  };

  const deleteDataReport = () => {
    Swal.fire({
      title: '¿Eliminar datos del reporte?',
      showDenyButton: true,
      confirmButtonText: 'Confirmar',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Eliminados!', '', 'success');
        localStorage.removeItem('expensesReport');
        setExpensesReport([]);
        setTotalAmountSpent('');
      } else if (result.isDenied) {
        Swal.close();
      }
    });
  };

  const parseReport = (raw: string): MonthlyCategoryReport[] => {
    const parsed = JSON.parse(raw);

    return Object.entries(parsed)
      .map(([month, categories]) => ({
        month,
        categories: Object.values(
          categories as {
            categoryId: string;
            categoryName: string;
            total: number;
          }[]
        ),
      }))
      .sort((a, b) => b.month.localeCompare(a.month));
  };

  const mapTotalsToSingleObjectArray = (
    totals: { categoryName: string; total: number }[]
  ): Array<Record<string, number>> => {
    return [
      totals.reduce((acc, { categoryName, total }) => {
        acc[categoryName] = total;
        return acc;
      }, {} as Record<string, number>),
    ];
  };

  useEffect(() => {
    const listOfCategories = localStorage.getItem('categories');
    setCategories(listOfCategories ? JSON.parse(listOfCategories) : []);
    const raw = localStorage.getItem('expensesReport');
    const result = parseReport(raw || '[]');
    setExpensesReport(raw ? result : []);
    const total = calculateTotalSpent(
      result,
      listOfCategories ? JSON.parse(listOfCategories) : []
    );
    setTotalAmountSpent(total.toFixed(2));
    const report = getTotalByCategoryFromTable(
      result,
      listOfCategories ? JSON.parse(listOfCategories) : []
    );
    setReportData(mapTotalsToSingleObjectArray(report));
  }, []);

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
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          margin: '0 auto',
          marginBottom: '1rem',
        }}
      >
        <Typography>Total gastado: ${totalAmountSpent || 0}</Typography>
        <Box
          sx={{
            marginTop: '1rem',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 1,
          }}
        >
          <Button
            sx={{ width: '2.5rem' }}
            variant="contained"
            color="error"
            onClick={deleteDataReport}
          >
            Limpiar
          </Button>
          <Button variant="contained">
            <CSVLink
              data={reportData}
              filename="categoriasAnual.csv"
              className="btn btn-primary"
            >
              <DownloadIcon sx={{ marginTop: '0.3rem' }} />
            </CSVLink>
          </Button>
        </Box>
      </div>
      <hr style={{ width: '100%', marginBottom: '1rem' }} />
      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflow: 'auto',
        }}
      >
        <TableContainer
          component={Paper}
          sx={{ height: '100%', overflow: 'auto', maxWidth: '100%' }}
        >
          <Table stickyHeader aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell sx={getHeaderAndRowStyle()}>Mes</TableCell>
                {categories.map((category) => (
                  <TableCell key={category.id} align="right">
                    {category.category}
                  </TableCell>
                ))}
                <TableCell align="right">
                  <strong>Total</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {expensesReport.map((expense) => {
                let monthTotal = 0;

                return (
                  <TableRow key={expense.month}>
                    <TableCell
                      sx={getHeaderAndRowStyle(2)}
                      component="th"
                      scope="row"
                    >
                      {getMonth(expense.month)}
                    </TableCell>

                    {categories.map((category) => {
                      const categoryData = expense.categories.find(
                        (c) => c.categoryId === category.id
                      );

                      const value = categoryData ? categoryData.total : 0;
                      monthTotal += value;

                      return (
                        <TableCell key={category.id} align="right">
                          {value}
                        </TableCell>
                      );
                    })}

                    <TableCell align="right">
                      <strong>{monthTotal.toFixed(2)}</strong>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}
