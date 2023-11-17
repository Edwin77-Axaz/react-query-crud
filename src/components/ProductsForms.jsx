import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPelicula } from '../api/peliculasApi';
import Modal from 'react-modal';
import '../assets/css/ProductsForms.css';

Modal.setAppElement('#root');

function ProductsForms() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const addProductMutation = useMutation({
    mutationFn: createPelicula,
    onSuccess: () => {
      console.log('Product ADDED!!');
      queryClient.invalidateQueries('peliculas');
      setIsModalOpen(false);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const pelicula = Object.fromEntries(formData);
    addProductMutation.mutate({
      ...pelicula,
    });
  };

  return (
    <div>
      <button onClick={() => setIsModalOpen(true)}>Agregar Pelicula</button>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Add Product Modal"
        className="custom-modal"
        overlayClassName="custom-overlay"
      >
        <div className="modal-content">
          <h2>Agregar Película</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nombre">Nombre:</label>
              <input type="text" id="nombre" name="nombre" />
            </div>

            <div className="form-group">
              <label htmlFor="Descripcion">Descripción:</label>
              <input type="text" id="Descripcion" name="Descripcion" />
            </div>

            <div className="form-group">
              <label htmlFor="año">Año:</label>
              <input type="number" id="año" name="año" />
            </div>

            <div className="form-group">
              <label htmlFor="logo">URL de la imagen:</label>
              <input type="text" id="logo" name="logo" />
            </div>

            <button type="submit">Agregar Película</button>
          </form>
        </div>

        <button onClick={() => setIsModalOpen(false)}>Cerrar</button>
      </Modal>
    </div>
  );
}

export default ProductsForms;
