import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/system';

type HeaderProps = {
  title: string;
  subtitle: string;
};

const Header = ({ title, subtitle }: HeaderProps) => {
  const theme = useTheme();
  const colors = theme.palette;

  return (
    <Box py={2}>
      <Typography variant="h4" style={{ textTransform: 'uppercase' }}>
        {title}
      </Typography>
      <Typography variant="h6" color={colors.primary.main}>
        {subtitle}
      </Typography>
    </Box>
  );
};

export default Header;
