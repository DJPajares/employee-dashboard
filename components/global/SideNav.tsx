import {
  Sidebar,
  Menu,
  MenuItem,
  SubMenu,
  useProSidebar
} from 'react-pro-sidebar';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import { Box, IconButton, Typography, useTheme } from '@mui/material';
import { useRouter } from 'next/router';
import { Avatar } from '@mui/material';

const SideNav = () => {
  const theme = useTheme();
  const colors = theme.palette;
  const { collapseSidebar, collapsed, toggleSidebar, broken } = useProSidebar();

  const userImage =
    'https://st.depositphotos.com/1898481/3884/i/600/depositphotos_38840419-stock-photo-silhouette.jpg';

  const imageSize = collapsed ? 30 : 100;
  const router = useRouter();

  const Header = () => {
    return (
      <MenuItem>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          {!collapsed && (
            <Box pr={2} onClick={() => router.push('/')}>
              <Typography fontSize={20} fontFamily="Sigmar One">
                HRBoard
              </Typography>
            </Box>
          )}
          <Box>
            <IconButton
              onClick={() => (broken ? toggleSidebar() : collapseSidebar())}
            >
              <MenuOutlinedIcon />
            </IconButton>
          </Box>
        </Box>
      </MenuItem>
    );
  };

  const User = () => {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          py: 1
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            py: 1
          }}
        >
          <Avatar
            src={userImage}
            alt="profile picture"
            sx={{ height: imageSize, width: imageSize }}
          />
        </Box>
        {!collapsed && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              py: 1
            }}
          >
            <Typography variant="h3" color={colors.primary.main}>
              ThisUser
            </Typography>
          </Box>
        )}
      </Box>
    );
  };

  const Dashboard = () => {
    return (
      <MenuItem icon={<HomeOutlinedIcon />} onClick={() => router.push('/')}>
        <Typography variant="subtitle2">Dashboard</Typography>
      </MenuItem>
    );
  };

  const Admin = () => {
    return (
      <SubMenu
        icon={<AdminPanelSettingsOutlinedIcon />}
        label={<Typography variant="subtitle2">Admin</Typography>}
        defaultOpen
      >
        <MenuItem
          style={{ backgroundColor: colors.background.default }}
          onClick={() => router.push('/admin/employees')}
        >
          <Typography variant="subtitle2">Employees</Typography>
        </MenuItem>
      </SubMenu>
    );
  };

  return (
    <Sidebar
      breakPoint="xs"
      collapsedWidth="5rem"
      width="16rem"
      backgroundColor={colors.background.default}
      style={{ minHeight: '100vh', zIndex: 1150 }} // To overlapp MUI AppBar, it has a zIndex of 1100
    >
      <Box py={1}>
        <Menu
          menuItemStyles={{
            button: () => {
              return {
                '&:hover': {
                  backgroundColor: 'transparent',
                  color: colors.primary.main
                }
              };
            }
          }}
        >
          <Header />

          <User />

          <Dashboard />

          <Admin />
        </Menu>
      </Box>
    </Sidebar>
  );
};

export default SideNav;
