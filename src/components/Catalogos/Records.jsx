import React, { useEffect, useState } from 'react';
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
    TablePagination,
    Typography
} from "@mui/material";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useSnackbar } from "../../components/context/SnackbarProvider";
import { RECORD_GETALL, CREATE_RECORD, UPDATE_RECORD } from "../../constants/Apis";
import LoadingScreen from "../../components/LoadingScreen";
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import TextField from '@mui/material/TextField';
import AlbumIcon from '@mui/icons-material/Album';
import { useNavigate } from "react-router-dom";
import { Backdrop, CircularProgress } from "@mui/material";

const Records = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const { showSnackbar } = useSnackbar();
    const [open, setOpen] = useState(false);

    //Metodo para crear un nuevo registro
    const [nuevoSello, setNuevoSello] = useState({
        id_record: "",
        nombre_record: "",
        descripcion_record: "",
        img_record: "",
    });

    const getRecords = async () => {
        setLoading(true);
        try {
            const response = await axios.get(RECORD_GETALL);
            setRecords(response.data.data);
            //showSnackbar(response.data.message, "success");
            setLoading(false);
        } catch (error) {
            console.error("Error al cargar sellos:", error);
        }

    };



    useEffect(() => {
        getRecords();
    }, []);


    const handlOpen = () => setOpen(true);

    const handlClose = () => {
        setOpen(false);
        setNuevoSello({
            id_record: "",
            nombre_record: "",
            descripcion_record: "",
            img_record: "",
        });
        getRecords();
    };

    const handleChange = (e) => {
        setNuevoSello({ ...nuevoSello, [e.target.name]: e.target.value });
    };

    //Funcion para guardar un nuevo registro
    const handleGuardar = () => {
        setLoading(true);
        axios.post(CREATE_RECORD, nuevoSello)
            .then((response) => {
                setRecords([...records, response.data.data]);
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
                setLoading(false);
            });
    };

    const handlerActualizar = () => {
        setLoading(true);
        const selloActualizado = {
            ...nuevoSello,
            updated_at: new Date().toISOString(),  
        };
        console.log("actualizar",selloActualizado )
        axios
            .put(UPDATE_RECORD + nuevoSello.id_record + "/", selloActualizado)
            .then((response) => {
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
                setLoading(false);
            });
    };


    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setNuevoSello({ ...nuevoSello, img_record: reader.result, fileName: file.name });
        };
        if (file) reader.readAsDataURL(file);
    };

    //cambio de pagina
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    //Seleccion de paginas
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handlerEditar = (record) => {
        console.log("el id traido", record.id_record);
        setNuevoSello({
            id_record: record.id_record,
            nombre_record: record.nombre_record,
            descripcion_record: record.descripcion_record,
            img_record: record.img_record,

        })
        setOpen(true);
    }


    return (
        <Box sx={{
            px: { xs: 2, sm: 3, md: 4 },
            py: 4,
            width: "100vw",
            boxSizing: "border-box",
            overflowX: "hidden"
        }}>
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
                <DialogTitle>
                    {nuevoSello.id_record ? "Editar Registro" : "Crear Nuevo Registro"}
                </DialogTitle>
                <DialogContent sx={{ p: 3, mt: 2 }}>
                    <FormControl fullWidth sx={{ mb: 2, mt: 2 }}>
                        <InputLabel>Nombre</InputLabel>
                        <OutlinedInput
                            name="nombre_record"
                            value={nuevoSello.nombre_record}
                            onChange={handleChange} label="Nombre" />
                    </FormControl>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Descripción</InputLabel>
                        <OutlinedInput
                            name="descripcion_record"
                            value={nuevoSello.descripcion_record}
                            onChange={handleChange}
                            multiline rows={4}
                            label="Descripción" />
                    </FormControl>
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
                        {nuevoSello.img_record && (
                            <Box sx={{
                                position: "relative",
                                display: "inline-block"
                            }}>
                                <img
                                    src={nuevoSello.img_record}
                                    alt="Vista previa"
                                    style={{ maxWidth: "100px", maxHeight: "60px" }} />
                                <Button
                                    onClick={() => setNuevoSello({ ...nuevoSello, img_record: "", fileName: "" })}
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
                    <Button className='btn-cancelar' onClick={handlClose}>Cancelar</Button>
                    {nuevoSello.id_record ? (
                        <Button
                            className='btn-aceptar'
                            onClick={handlerActualizar}
                            variant="contained"
                        >
                            Actualizar</Button>
                    ) : (
                        <Button
                            className='btn-aceptar'
                            onClick={handleGuardar}
                            variant="contained"
                        >
                            Guardar
                        </Button>
                    )}

                </DialogActions>
            </Dialog>
            <LoadingScreen open={loading} />
            <TableContainer
                component={Paper}
                sx={{
                    width: "100%",
                    overflowX: "auto",
                }}>
                <Table size="medium">
                    <TableHead>
                        <TableRow className="encabezadoTabla">
                            <TableCell className="label">Record</TableCell>
                            <TableCell className="label">Descripción</TableCell>
                            <TableCell className="label">Logo</TableCell>
                            <TableCell className="label" align="center">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {records
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((record) => (
                                <TableRow key={record.id_record}>
                                    <TableCell>{record.nombre_record}</TableCell>
                                    <TableCell>{record.descripcion_record}</TableCell>
                                    <TableCell>
                                        <img
                                            src={record.img_record}
                                            alt="Sello"
                                            style={{ width: 80, height: 80, objectFit: "contain" }}
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Box sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            gap: 1
                                        }}>
                                            <IconButton onClick={() => handlerEditar(record)}>
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
                count={records.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50]}
            />
        </Box>
    );
};

export default Records;
