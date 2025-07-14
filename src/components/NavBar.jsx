import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

const drawerWidth = 240;

const Navbar = () => {
    const [open, setOpen] = React.useState(false);
    const location = useLocation();
    const isLoginPage = location.pathname === "/login";


    const toggleDrawer = () => {
        setOpen(!open);
    };

    return (
        <>
            <AppBar
                position="fixed"
                sx={{
                    top: 0,
                    left: 0,
                    right: 0,
                    boder: "solid red",
                    background: "black",
                    zIndex: (theme) => theme.zIndex.drawer + 1
                }}
            >
                <Toolbar>
                    {!isLoginPage && (
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                            onClick={toggleDrawer}
                        >
                            <MenuIcon />
                        </IconButton>

                    )}
                    {!isLoginPage && (
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            Menú
                        </Typography>
                    )}
                    <Button
                        color="inherit"
                        component={Link}
                        to="/login"
                    >Login</Button>
                </Toolbar>
            </AppBar>
            <Toolbar />

            {/* Drawer lateral */}
            <Drawer
                variant="persistent"
                anchor="left"
                open={open}
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto' }}>
                    <List>
                        {[
                            { label: "Records", to: "/Record" },
                            { label: "Sellos", to: "/sellos" },
                            { label: "Otra", to: "/otra" }
                        ].map(({ label, to }) => (
                            <ListItem key={label} disablePadding>
                                <Button
                                    color="inherit"
                                    component={Link}
                                    to={to}
                                    onClick={() => setOpen(false)}
                                    sx={{ width: '100%', justifyContent: 'flex-start', textTransform: 'none', padding: 2 }}
                                >
                                    {label}
                                </Button>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>

            {/* Contenido principal ajustado */}
            <Box
                component="main"
                sx={{
                    marginLeft: open ? `${drawerWidth}px` : 0,
                    padding: 3,
                    transition: (theme) =>
                        theme.transitions.create('margin', {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.leavingScreen,
                        }),
                }}
            >

            </Box>
        </>
    );
};

export default Navbar;
