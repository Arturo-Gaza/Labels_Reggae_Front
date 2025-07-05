import axios from "axios";

const GETALL_SELLOS = "http://localhost:8000/api/sellosGetAll";

export const getSellos = async () => {
    const response = await axios.get(GETALL_SELLOS);
    return response.data.data;
}