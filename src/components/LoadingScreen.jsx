import React from "react";
import { Backdrop, CircularProgress, Typography } from "@mui/material";

const LoadingScreen = ({ open, size = 80, thickness = 5, fullHeight = true }) => {
    return (
        <Backdrop
            open={open}
            sx={{
                color: "#fff",
                zIndex: (theme) => theme.zIndex.modal + 2,
                height: fullHeight ? "100vh" : "auto",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <CircularProgress
                color="inherit"
                size={size}
                thickness={thickness}
            />
            <Typography>
                    Cargando ........
            </Typography>
        </Backdrop>
    );
};

export default LoadingScreen;
