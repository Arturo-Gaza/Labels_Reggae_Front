import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    MenuItem,
    IconButton,
    Grid,
    Typography
} from "@mui/material";
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import TextField from '@mui/material/TextField';
import { SELLOS_GETALL, RECORD_GETALL, CREAR_SELLO, PAIS_GETALL } from '../constants/Apis';
import { useSnackbar } from "../components/context/SnackbarProvider";
import AlbumIcon from '@mui/icons-material/Album';
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen";
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import TablePagination from '@mui/material/TablePagination';
import { Backdrop, CircularProgress } from "@mui/material";
import Flag from 'react-world-flags';


const SellosList = () => {
    const [sellos, setSellos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [records, setRecords] = useState([]);
    const { showSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const [page, setPage] = useState(0); // página actual
    const [rowsPerPage, setRowsPerPage] = useState(10); // filas por página
    const [pais, setPais] = useState([]);


    const [nuevoSello, setNuevoSello] = useState({
        nombre_sello: "",
        descripcion_sello: "",
        id_pais: "",
        id_record: "",
        label: "",
    });

    const getSellos = async () => {
        setLoading(true);
        try {
            const response = await axios.get(SELLOS_GETALL);
            setSellos(response.data.data);
            setLoading(false);
            showSnackbar(response.data.message, "success");
        } catch (error) {
            console.error("Error al cargar sellos:", error);
        }finally{
            
        }
    };

    const getRecords = async () => {
        try {
            const response = await axios.get(RECORD_GETALL);
            setRecords(response.data.data);
        } catch (error) {
            console.error("Error al cargar disqueras:", error);
        }
    };

    const getPais = async () => {
        try {
            const response = await axios.get(PAIS_GETALL);
            setPais(response.data.data);
        } catch (error) {
            console.error("Error al cargar disqueras:", error);
        }
    }

    const loadData = async () => {
        await Promise.all([
            getSellos(),
            getRecords(),
            getPais()
        ]);
    };

    useEffect(() => {
        const fetchData = async () => {
            await loadData();
        };

        fetchData();
    }, []);

    //if (loading) return <LoadingScreen />;

    const handlOpen = () => setOpen(true);
    const handlClose = () => {
        setOpen(false);
        setNuevoSello({
            nombre_sello: "",
            descripcion_sello: "",
            id_pais: "",
            id_record: "",
            label: ""
        });
        loadData();
    };

    const handleChange = (e) => {
        setNuevoSello({ ...nuevoSello, [e.target.name]: e.target.value });
    };

    const handleGuardar = () => {
        setLoading(true);
        axios.post(CREAR_SELLO, nuevoSello)
            .then((response) => {
                setSellos([...sellos, response.data.data]);
                showSnackbar(response.data.message, "success");
                handlClose();
            })
            .catch((err) => {
                const response = err.response?.data;
                let message = response?.message || "";
                if (response?.errors) {
                    message += ": " + Object.values(response.errors).flat().join(" | ");
                }
                showSnackbar(message || "Error desconocido al guardar", "error");
                console.error("Error al guardar:", err);
            })
            .finally(() => {
                setLoading(false); // 3. Ocultar pantalla de carga
            });
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setNuevoSello({ ...nuevoSello, label: reader.result, fileName: file.name });
        };
        if (file) reader.readAsDataURL(file);
    };

    const handleVerSellos = () => navigate("/sellosCards");

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // reinicia a la primera página
    };

    const handleEditar = (sello) => {
        const paisEncontrado = pais.find((p) => p.nombre_pais === sello.nombre_pais);
        const recordEncontrado = records.find((r) => r.nombre_record === sello.nombre_record);
        setNuevoSello({
            id_sello: sello.id_sello,
            nombre_sello: sello.nombre_sello,
            descripcion_sello: sello.descripcion_sello,
            id_pais: paisEncontrado?.id_pais || "",
            id_record: recordEncontrado?.id_record || "",
            label: sello.label || "",
        });
        setOpen(true);
    }


    return (
        <Box
            sx={{
                px: { xs: 2, sm: 3, md: 4 },
                py: 4,
                width: "98.9vw",
                boxSizing: "border-box",
                overflowX: "hidden",
                border: "solid",
                p: 1,
                mt: "-6%"
            }}>
            <Grid>
                <Typography variant="h4" sx={{ color: "black" }}>
                    Sellos
                </Typography>
            </Grid>

            <Grid sx={{
                display: "flex",
                justifyContent: "flex-end",
                mb: 2,
                border: "solid "
            }}>
                <Button
                    variant="contained"
                    onClick={handleVerSellos}>Ver Sellos</Button>
            </Grid>
            <Box sx={{
                display: "flex",
                justifyContent: "flex-end",
                mb: 2,
                border: "solid "
            }}>
                <IconButton onClick={handlOpen} sx={{ border: "solid 1px #ccc" }}>
                    <AlbumIcon sx={{ fontSize: 40, color: "black" }} />
                </IconButton>
            </Box>

            <Dialog open={open} onClose={handlClose} maxWidth="sm" fullWidth>
                <DialogTitle>Crear Nuevo Registro</DialogTitle>
                <DialogContent sx={{ p: 3, mt: 2 }}>
                    <FormControl fullWidth sx={{ mb: 2, mt: 2 }}>
                        <InputLabel>Nombre</InputLabel>
                        <OutlinedInput
                            name="nombre_sello"
                            value={nuevoSello.nombre_sello}
                            onChange={handleChange} label="Nombre" />
                    </FormControl>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Descripción</InputLabel>
                        <OutlinedInput
                            name="descripcion_sello"
                            value={nuevoSello.descripcion_sello}
                            onChange={handleChange}
                            multiline rows={4}
                            label="Descripción"
                            inputProps={{ maxLength: 500 }}
                        />
                    </FormControl>
                    <TextField
                        fullWidth select
                        label="Pais Origen"
                        name="id_pais"
                        value={nuevoSello.id_pais}
                        onChange={handleChange}
                        sx={{
                            mb: 2
                        }}
                    >
                        {pais.map((record) => (

                            <MenuItem
                                key={record.id_pais}
                                value={record.id_pais}
                            >
                                {record.nombre_pais}
                            </MenuItem>
                        ))}

                    </TextField>
                    <TextField
                        fullWidth select
                        label="Disquera"
                        name="id_record"
                        value={nuevoSello.id_record}
                        onChange={handleChange} sx={{ mb: 2 }}>
                        {records.map((record) => (
                            <MenuItem
                                key={record.id_record}
                                value={record.id_record}>{record.nombre_record}</MenuItem>
                        ))}
                    </TextField>
                    <Box sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        flexWrap: "wrap"
                    }}>
                        <Button
                            variant="outlined"
                            component="label">
                            Subir Imagen
                            <input
                                type="file"
                                hidden accept="image/*"
                                onChange={handleImageUpload} />
                        </Button>
                        {nuevoSello.label && (
                            <Box sx={{
                                position: "relative",
                                display: "inline-block"
                            }}>
                                <img
                                    src={nuevoSello.label}
                                    alt="Vista previa"
                                    style={{ maxWidth: "100px", maxHeight: "60px" }} />
                                <Button
                                    onClick={() => setNuevoSello({ ...nuevoSello, label: "", fileName: "" })}
                                    sx={{
                                        position: "absolute",
                                        top: 0,
                                        right: 0,
                                        minWidth: "24px",
                                        height: "24px",
                                        borderRadius: "50%",
                                        padding: 0,
                                        fontSize: "1rem",
                                        backgroundColor: "white",
                                        color: "black", '&:hover': { color: "red" }
                                    }}>×</Button>
                            </Box>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button className="btn-cancelar" onClick={handlClose}>Cancelar</Button>
                    <Button className="btn-aceptar" onClick={handleGuardar} variant="contained">Guardar</Button>
                </DialogActions>
            </Dialog>

            <LoadingScreen open={loading} />

            <TableContainer
                component={Paper}
                sx={{
                    width: "100%",
                    overflowX: "auto",
                    border: "solid"
                }}>
                <Table size="medium">
                    <TableHead>
                        <TableRow className="encabezadoTabla">
                            <TableCell className="label">Sello</TableCell>
                            <TableCell className="label">Descripción del Sello</TableCell>
                            <TableCell className="label">Subcidiaria</TableCell>
                            <TableCell className="label">Pais</TableCell>
                            <TableCell className="label">Galleta</TableCell>
                            <TableCell align="center" className="label">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sellos
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((sello) => (
                                <TableRow key={sello.id_sello}>
                                    <TableCell>{sello.nombre_sello}</TableCell>
                                    <TableCell>{sello.descripcion_sello}</TableCell>
                                    <TableCell>{sello.id_record__nombre_record}</TableCell>
                                    <TableCell>{sello.id_pais__nombre_pais}</TableCell>
                                    <TableCell>
                                        {sello.label ? (
                                            <img
                                                src={sello.label}
                                                alt="Sello"
                                                style={{ width: 80, height: 80, objectFit: "contain" }}
                                            />
                                        ) : (
                                            "Sin imagen"
                                        )}
                                    </TableCell>

                                    <TableCell align="center">
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "center",
                                                gap: 1

                                            }}
                                        >
                                            <IconButton onClick={() => handleEditar(sello)}>
                                                <AppRegistrationIcon sx={{ color: "black" }} />
                                            </IconButton>
                                            <IconButton><DeleteForeverIcon sx={{ color: "red" }} /></IconButton>

                                        </Box>

                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                component="div"
                count={sellos.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50]}
            />
        </Box>

    );
};

export default SellosList;
