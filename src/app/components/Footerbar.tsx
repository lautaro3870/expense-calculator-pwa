'use client';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';
import TableChartIcon from '@mui/icons-material/TableChart';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import { useRouter } from 'next/navigation';
import CategoryIcon from '@mui/icons-material/Category';

export default function Footerbar() {
  const router = useRouter();
  return (
    <footer
      style={{
        position: 'fixed',
        left: 0,
        bottom: 0,
        width: '100%',
      }}
    >
      <BottomNavigation showLabels sx={{ backgroundColor: '#b7b7b7ff' }}>
        <BottomNavigationAction
          label="Gastos"
          icon={<TableChartIcon />}
          onClick={() => {
            router.push('/');
          }}
        />
        <BottomNavigationAction
          label="Reporte"
          icon={<RestoreIcon />}
          onClick={() => {
            router.push('/report');
          }}
        />
        <BottomNavigationAction
          label="Gráfico"
          icon={<SignalCellularAltIcon />}
          onClick={() => {
            router.push('/graphic');
          }}
        />
        <BottomNavigationAction
          label="Categorias"
          icon={<CategoryIcon />}
          onClick={() => {
            router.push('/categories');
          }}
        />
      </BottomNavigation>
    </footer>
  );
}
