// Axios
import axios from 'axios';

const peliculasApi = axios.create({
    baseURL: 'http://localhost:3000/peliculas'
});


export const getPeliculas = async () => {
    const res = await peliculasApi.get('./');
    return res.data;
}

export const createPelicula = (pelicula) => {
    peliculasApi.post('/', pelicula);
}

export const deletePelicula = (id) => peliculasApi.delete(`/${id}`);

export const updatePelicula = (pelicula) => peliculasApi.put(`/${pelicula.id}`, pelicula);

// función para buscar películas por título
export const searchPeliculas = async (titulo) => {
    const res = await peliculasApi.get(`?nombre=${titulo}`);
    return res.data;
}
