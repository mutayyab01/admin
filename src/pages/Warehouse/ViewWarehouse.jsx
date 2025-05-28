import React, { useState, useEffect } from "react";
import MasterLayout from "../../masterLayout/MasterLayout";
import Breadcrumb from "../../components/Breadcrumb";
import { useNavigate, useParams } from "react-router-dom";
import { Icon } from '@iconify/react/dist/iconify.js';
import axios from 'axios';

const ViewWarehouse = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Get the warehouse ID from the URL
    const [warehouse, setWarehouse] = useState(null);
    const [city, setCity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Define the API URL
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

    useEffect(() => {
        const fetchWarehouseDetails = async () => {
            try {
                // Fetch the warehouse data by ID
                const warehouseResponse = await axios.get(`${API_URL}/warehouses/${id}`);
                setWarehouse(warehouseResponse.data);

                // Fetch the associated city details
                const cityResponse = await axios.get(`${API_URL}/Cities/${warehouseResponse.data.city_id}`);
                setCity(cityResponse.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Error fetching warehouse details');
            } finally {
                setLoading(false);
            }
        };

        fetchWarehouseDetails();
    }, [id, API_URL]);

    if (loading) {
        return (
            <MasterLayout>
                <div className="card">
                    <div className="card-body text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>
            </MasterLayout>
        );
    }

    if (error) {
        return (
            <MasterLayout>
                <div className="card">
                    <div className="card-body text-center">
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => navigate("/warehouses")}
                        >
                            <Icon icon="mingcute:back-line" className="me-2" />
                            Back to Warehouses
                        </button>
                    </div>
                </div>
            </MasterLayout>
        );
    }

    return (
        <MasterLayout>
            <Breadcrumb title="View Warehouse" />
            <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="card-title">Warehouse Details</h5>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => navigate("/warehouses")}
                    >
                        <Icon icon="mingcute:back-line" className="me-2" />
                        Back to Warehouses
                    </button>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-8">
                            <div className="card">
                                <div className="card-header">
                                    <h5 className="card-title mb-0">Warehouse Information</h5>
                                </div>
                                <div className="card-body">
                                    <div className="table-responsive">
                                        <table className="table table-bordered basic-table">
                                            <tbody>
                                                <tr>
                                                    <th scope="col">Warehouse ID</th>
                                                    <td>{warehouse?.warehouse_id}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="col">Warehouse Name</th>
                                                    <td>{warehouse?.warehouse_name}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="col">Location Address</th>
                                                    <td>{warehouse?.location_address}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="col">Postal Code</th>
                                                    <td>{warehouse?.postal_code}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="col">City ID</th>
                                                    <td>{warehouse?.city_id}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                            <div className="mt-4">
                                <h6 className="mb-3">City Information</h6>
                                <div className="table-responsive">
                                    <table className="table table-bordered basic-table">
                                        <tbody>
                                            <tr>
                                                <th>City Name</th>
                                                <td>{city?.city_name}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </MasterLayout>
    );
};

export default ViewWarehouse;