import { useState } from 'react';
import { Drawer, IconButton, Box, List, ListItemButton, ListItemText, AppBar, Toolbar} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';

export default function ResponsiveNav() {
    const [open, setOpen] = useState(false);
    const toggleDrawer = (state) => () => setOpen(state);

    
    const navLinks = [
        { title: 'TRANG CHỦ', path: '/' },
        { title: 'GIỚI THIỆU', path: '/info' },
        { title: 'ĐẶT XE', path: '/book-car' },
        { title: 'THÔNG TIN NHÀ XE', path: '/bus-company' },
        { title: 'BẾN XE', path: '/bus-station' },
        { title: 'TUYẾN ĐƯỜNG', path: '/bus-route' },
        { title: 'KIỂM TRA VÉ', path: '/ticket-check' }
    ];

    return (
        <>
            <AppBar
                sx={{
                    display: { xs: 'flex', lg: 'none' },
                    backgroundColor: 'rgba(255, 255, 255, 0.632)',
                    marginTop: 3.5
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

                <List style={{ marginTop: 20 }}>
                    {navLinks.map((link) => (
                        <ListItemButton
                            key={link.title}
                            component={Link}
                            to={link.path}
                            onClick={toggleDrawer(false)}
                        >
                            <ListItemText primary={link.title} />
                        </ListItemButton>
                    ))}
                </List>
            </Drawer>

            <Toolbar sx={{ display: { xs: 'block', md: 'none' } }} />
        </>
    );
};


