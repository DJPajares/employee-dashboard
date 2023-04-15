import Head from 'next/head';
import { Box } from '@mui/system';
import Dashboard from './main/dashboard';

export default function Home() {
  return (
    <Box>
      <Head>
        <title>Employee Dashboard</title>
      </Head>
      <Box>
        <Dashboard />
      </Box>
    </Box>
  );
}
