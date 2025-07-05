import React, { createContext, useContext, useState } from "react";
import { Snackbar, Alert } from "@mui/material";

// Crear el contexto
const SnackbarContext = createContext();

// Hook para usar el contexto
export const useSnackbar = () => useContext(SnackbarContext);

// Componente proveedor
export const SnackbarProvider = ({ children }) => {
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const showSnackbar = (message, severity = "success") => {
        setSnackbar({ open: true, message, severity });
    };

    const handleClose = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    return (
        <SnackbarContext.Provider value={{ showSnackbar }}>
            {children}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={handleClose}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}

            >
                <Alert onClose={handleClose} severity={snackbar.severity} sx={{
                    width: "100%",
                    backgroundColor:
                        snackbar.severity === "success"
                            ? "#4caf50" // verde
                            : snackbar.severity === "error"
                                ? "#f44336" // rojo
                                : snackbar.severity === "warning"
                                    ? "#ff9800" // naranja
                                    : "#2196f3", // info (azul)
                    color: "white", // texto blanco
                }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </SnackbarContext.Provider>
    );
};
