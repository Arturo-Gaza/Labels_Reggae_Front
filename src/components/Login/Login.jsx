import React from "react";
import { useNavigate } from "react-router-dom";
import {
    Paper,
    Button,
    Box,
    Grid,
    Typography,
    TextField,
} from "@mui/material";


const Login = () => {

    console.log("pagian login cargada")
    return (
        <Box
            sx={{
                width: '30vw',
                height: '70vh',
                backgroundColor: "#000000ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "solid black",
                borderRadius: 3,
                ml: {
                    md: 65
                },
                mt: {
                    md: 0
                }
            }}
        >

            <Typography
                sx={{
                    mt: {
                        md:-40
                    }
                }}
            >
                Login
            </Typography>

            <TextField
                sx={{
                    background: "white"
                }}
            >

            </TextField>

        </Box>
    )
}

export default Login;