// Importa React y los demás módulos necesarios
import React, { useState } from 'react';
import Modal from 'react-modal';
import ProductsForms from './ProductsForms';
import '../assets/css/Navbar.css';
import { searchPeliculas } from '../api/peliculasApi';

// Configura el elemento raíz para el modal
Modal.setAppElement('#root');

// Componente NavBar
function NavBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPeliculas, setFilteredPeliculas] = useState([]);
  const [selectedPelicula, setSelectedPelicula] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Maneja el cambio en el campo de búsqueda
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Realiza la búsqueda de películas
  const performSearch = async () => {
    try {
      // Utiliza la función de búsqueda
      const result = await searchPeliculas(searchTerm);

      // Establece los resultados de la búsqueda
      setFilteredPeliculas(result);

      // Si hay resultados, abre el modal con el primero
      if (result.length > 0) {
        openModal(result[0]);
      }
    } catch (error) {
      // Maneja errores en la búsqueda
      console.error('Error al buscar películas:', error);
    }
  };

  // Abre el modal con la película seleccionada
  const openModal = (pelicula) => {
    setSelectedPelicula(pelicula);
  };

  // Cierra el modal
  const closeModal = () => {
    setSelectedPelicula(null);
  };

  // Maneja la acción de agregar opción
  const handleAddOption = () => {
    setIsModalOpen(true);
  };

  // Renderiza el componente NavBar
  return (
    <div className="navbar">
      <div className="logo">
        <img src="src\assets\img\SenPelis.png" alt="SenPelis" />
        <h1>SenPelis</h1>
      </div>
      <div className="search">
        {/* Input para la búsqueda */}
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        {/* Botón para realizar la búsqueda */}
        <button onClick={performSearch}>Search</button>
      </div>

      {/* Resultados de la búsqueda */}
      <div className="search-results">
        {filteredPeliculas.map((pelicula) => (
          <div key={pelicula.id} onClick={() => openModal(pelicula)}>
            {pelicula.nombre}
          </div>
        ))}
      </div>

      {/* Modal de la película seleccionada */}
      {selectedPelicula && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <img
                src={selectedPelicula.logo}
                alt={selectedPelicula.nombre}
                style={{ width: '200px' }}
              />
              <h2>{selectedPelicula.nombre}</h2>
            </div>
            <p>{selectedPelicula.Descripcion}</p>
            <p>Año: {selectedPelicula.año}</p>
            <button onClick={closeModal}>Cerrar</button>
          </div>
        </div>
      )}

      {/* Renderiza el componente ProductsForms con las propiedades necesarias */}
      <ProductsForms
        isModalOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
      />
    </div>
  );
}

// Exporta el componente NavBar
export default NavBar;
