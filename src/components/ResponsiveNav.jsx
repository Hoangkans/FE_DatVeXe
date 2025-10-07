import { useState } from 'react';
import { Drawer, IconButton, Box, List, ListItem, ListItemText, AppBar, Toolbar} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function ResponsiveNav() {
  const [open, setOpen] = useState(false);
  const toggleDrawer = (state) => () => setOpen(state);

  const navLinks = [
    'TRANG CHU',
    'GIOI THIEU',
    'THONG TIN NHA XE',
    'BEN XE',
    'TUYEN DUONG',
    'MUA VE'
  ];

  return (
    <>
        <AppBar
            
            sx={{
                display: { xs: 'flex', md: 'none' },
                backgroundColor: 'white',
                zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
        >
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>   
                <IconButton
                    edge="start"
                    color="info"
                    onClick={toggleDrawer(true)}
                    sx={{ mr: 2 }}
                >
                    <MenuIcon sx={{ width: 42, height: 42 }} />
                </IconButton>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <img src={logo} alt="Logo" style={{ height: 50 }} />
                </Box>
            </Toolbar>
        </AppBar>

        
        <Drawer
            anchor="left"
            open={open}
            onClose={toggleDrawer(false)}
            PaperProps={{
                sx: {
                    width: 250,
                    backgroundColor: '#0e8ed8ff',
                    color: 'white',
                },
            }}
            BackdropProps={{
                sx: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)'
                },
            }}
        >

            <List style={{ marginTop: 70 }}>
                {navLinks.map((text) => (
                    <ListItem
                        button
                        key={text}
                        onClick={toggleDrawer(false)}
                    >
                        <ListItemText primary={text} />
                    </ListItem>
                ))}
            </List>
        </Drawer>

        <Toolbar sx={{ display: { xs: 'block', md: 'none' } }} />
    </>
  );
};


