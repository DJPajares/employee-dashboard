import { ColorModeContext } from '@/config/themes';
import {
  AppBar,
  Box,
  IconButton,
  InputBase,
  Toolbar,
  alpha,
  styled,
  useTheme
} from '@mui/material';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import SearchIcon from '@mui/icons-material/Search';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import { useContext } from 'react';
import { useProSidebar } from 'react-pro-sidebar';

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    color: theme.palette.text.primary,
    // vertical padding + font size from searchIcon
    paddingLeft: '1em',
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch'
      }
    }
  }
}));

const TopBar = () => {
  const theme = useTheme();
  const colors = theme.palette;
  const colorMode = useContext(ColorModeContext);
  const { broken, toggleSidebar } = useProSidebar();

  return (
    <AppBar position="sticky" elevation={0}>
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          backgroundColor: colors.background.default,
          px: 2
        }}
        disableGutters
      >
        {broken && (
          <IconButton onClick={() => toggleSidebar()}>
            <MenuOutlinedIcon />
          </IconButton>
        )}

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            borderRadius: 0.5,
            backgroundColor: colors.background.paper,
            '&:hover': {
              backgroundColor: alpha(colors.background.paper, 0.5)
            }
          }}
        >
          <StyledInputBase
            placeholder="Search…"
            inputProps={{ 'aria-label': 'search' }}
          />
          <IconButton>
            <SearchIcon />
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={colorMode.toggleColorMode}>
            {theme.palette.mode === 'dark' ? (
              <LightModeOutlinedIcon />
            ) : (
              <DarkModeOutlinedIcon />
            )}
          </IconButton>
          <IconButton>
            <PersonOutlinedIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
