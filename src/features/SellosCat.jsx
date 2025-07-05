import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Grid,
    Card,
    CardMedia,
    CardContent,
    Typography,
    CircularProgress,
    Container,
    Box,
    Button,
} from "@mui/material";
import LoadingScreen from "../components/LoadingScreen";
import { useNavigate } from "react-router-dom";
import Flag from 'react-world-flags';
import { SELLOS_GETALL } from '../constants/Apis';

<Flag code="jm" style={{ width: 64, height: 40 }} />


const SellosCards = () => {
    const [sellos, setSellos] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
        setLoading(true)
        axios
            .get(SELLOS_GETALL)
            .then((response) => {
                setSellos(response.data.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error al obtener sellos:", error);
                setLoading(false);
            });
    }, []);

    const handleVerSellos = () => {
        navigate("/sellos");
    };

    return (
        <Box
            sx={{
                px: { xs: 2, sm: 3, md: 4 },
                py: 4,
                width: "100vw",
                boxSizing: "border-box",
                overflowX: "hidden",
                mt: "-6%"
            }}>

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                }}>
                <Button variant="contained" onClick={handleVerSellos}>
                    Tabla Sellos
                </Button>
            </Box>
            <LoadingScreen open={loading} />
            <section id="sellos">
                <Container
                    sx={{
                        mt: 10,
                    }}>
                    <Grid
                        container
                        spacing={6}
                        sx={{
                            border: "solid",
                            p: 2
                        }}>
                        {sellos.map((sello) => {
                            const imageSrc = sello.label;

                            return (
                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={4}
                                    key={sello.id_sello}


                                >
                                    <Card
                                        onClick={() => console.log("ID del sello:", sello.id_sello)}
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            padding: 2,
                                            backgroundColor: "white",
                                            boxShadow: 3,
                                            borderRadius: 2,
                                            ml: { sm: 3 },
                                            cursor: "pointer",
                                        }}
                                    >
                                        <CardMedia
                                            component="img"
                                            image={imageSrc}
                                            alt={sello.nombre_sello}
                                            sx={{
                                                width: 200,
                                                height: 200,
                                                objectFit: "contain",
                                                marginBottom: 2,
                                                background: "white",
                                                borderRadius: 2,
                                                padding: 1,
                                            }}
                                        />
                                        <CardContent sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                        }}>
                                            <Typography variant="h6" color="black">
                                                {sello.nombre_sello}
                                            </Typography>
                                            <Typography variant="caption" color="black">
                                                {sello.nombre_record}

                                            </Typography>
                                            <Typography variant="caption" color="black" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                {(sello.id_pais__nombre_pais.toLowerCase() === "jamaica" && (
                                                    <Flag code="jm" style={{ width: 35, height: 17, marginLeft: 6 }} />
                                                )) || (sello.id_pais__nombre_pais.toLowerCase() === "uk" && (
                                                    <Flag code="gb" style={{ width: 35, height: 17, marginLeft: 6 }} />
                                                ))}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            );
                        })}
                    </Grid>
                </Container>
            </section>
        </Box>
    );
};

export default SellosCards;
