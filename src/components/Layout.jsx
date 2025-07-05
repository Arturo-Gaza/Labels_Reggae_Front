import React from 'react';
import Navbar from '../components/NavBar';
import { Outlet } from 'react-router-dom';
import { Container } from '@mui/material';

const Layout = () => {

    console.log("Layout cargado");
    return (
        <>
            <Navbar />
            <main>
                <Outlet />
            </main>
        </>
    );
};

export default Layout;
