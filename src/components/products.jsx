import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPeliculas, deletePelicula, updatePelicula } from '../api/peliculasApi';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Swal from 'sweetalert2';

function Products() {
    const queryClient = useQueryClient();
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [displayEditModal, setDisplayEditModal] = useState(false);
    const [displayDetailsModal, setDisplayDetailsModal] = useState(false);

    // Agrega un estado para los campos de edición
    const [editFields, setEditFields] = useState({
        nombre: '',
        Descripcion: '',
        año: '',
    });

    const { isLoading, data: products, isError, error } = useQuery({
        queryKey: ['peliculas'],
        queryFn: getPeliculas,
        select: (peliculas) => peliculas.sort((a, b) => b.id - a.id),
    });

    const deleteProduct = (product) => {
        deletePelicula(product.id)
            .then(() => {
                queryClient.invalidateQueries('peliculas');
                Swal.fire('Pelicula eliminada', '', 'success');
            })
            .catch((error) => {
                Swal.fire('Error al eliminar la Pelicula', error.message, 'error');
            });
    };

    const updateProductMutation = useMutation({
        mutationFn: updatePelicula,
        onSuccess: () => {
            queryClient.invalidateQueries('peliculas');
            setDisplayEditModal(false);
        },
    });

    const handleEdit = (product) => {
        setSelectedProduct(product);
        setEditFields({
            nombre: product.nombre,
            Descripcion: product.Descripcion,
            año: product.año,
        });
        setDisplayEditModal(true);
    };

    const handleDelete = (product) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción eliminará esta Pelicula.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteProduct(product);
            }
        });
    };

    const handleViewDetails = (product) => {
        setSelectedProduct(product);
        setDisplayDetailsModal(true);
    };

    const handleCloseEditModal = () => {
        setDisplayEditModal(false);
    };

    const handleCloseDetailsModal = () => {
        setDisplayDetailsModal(false);
    };

    // Maneja los cambios en los campos de edición
    const handleEditFieldChange = (e) => {
        const { name, value } = e.target;
        setEditFields((prevFields) => ({
            ...prevFields,
            [name]: value,
        }));
    };

    const handleSaveChanges = () => {
        // Realiza la lógica para guardar los cambios aquí
        updateProductMutation.mutate({
            ...selectedProduct,
            ...editFields,
        });
    };

    return (
        <div className="card-grid">
            {isLoading ? (
                <div>Loading...</div>
            ) : isError ? (
                <div>Error: {error.message}</div>
            ) : (
                products.map((product) => (
                    <Card
                        key={product.id}
                        className="card"
                        style={{
                            backgroundImage: `url(${product.logo})`,
                            backgroundSize: '100% auto',
                            backgroundPosition: 'center',
                        }}
                    >
                        <div className="card-content">
                            <Card.Body className="card-body">
                                <Card.Title style={{ marginTop: '399px' }}>{product.nombre}</Card.Title>
                                <Card.Text>{product.año}</Card.Text>
                                <Button
                                    variant="primary"
                                    onClick={() => handleViewDetails(product)}
                                    className="btn btn-custom"
                                >
                                    Ver Más
                                </Button>
                                <Button
                                    variant="warning"
                                    onClick={() => handleEdit(product)}
                                    className="btn btn-custom"
                                >
                                    Editar
                                </Button>
                                <Button
                                    variant="danger"
                                    onClick={() => handleDelete(product)}
                                    className="btn btn-custom"
                                >
                                    Eliminar
                                </Button>
                            </Card.Body>
                        </div>
                    </Card>
                ))
            )}

            {displayEditModal && (
                <div className="modal-background">
                    <Modal show={true} onHide={handleCloseEditModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Editar {selectedProduct?.nombre}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Form.Group controlId="editNombre">
                                    <Form.Label>Nombre</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="nombre"
                                        value={editFields.nombre}
                                        onChange={handleEditFieldChange}
                                    />
                                </Form.Group>
                                <Form.Group controlId="editDescripcion">
                                    <Form.Label>Descripción</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        name="Descripcion"
                                        value={editFields.Descripcion}
                                        onChange={handleEditFieldChange}
                                    />
                                </Form.Group>
                                <Form.Group controlId="editAño">
                                    <Form.Label>Año</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="año"
                                        value={editFields.año}
                                        onChange={handleEditFieldChange}
                                    />
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseEditModal}>
                                Cerrar
                            </Button>
                            <Button variant="primary" onClick={handleSaveChanges}>
                                Guardar Cambios
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            )}

            {displayDetailsModal && (
                <div className="modal-background">
                    <Modal show={true} onHide={handleCloseDetailsModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Detalles de {selectedProduct?.nombre}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div>
                                <img
                                    src={selectedProduct?.logo}
                                    alt={selectedProduct?.nombre}
                                    style={{ maxWidth: '40%' }}
                                />
                            </div>
                            <p>{selectedProduct?.Descripcion}</p>
                            <p>Año: {selectedProduct?.año}</p>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseDetailsModal}>
                                Cerrar
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            )}

        </div>
    );
}

export default Products;
