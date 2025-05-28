import React, { useState, useEffect } from "react";
import MasterLayout from "../../masterLayout/MasterLayout";
import Breadcrumb from "../../components/Breadcrumb";
import { useNavigate, useParams } from "react-router-dom";
import { Icon } from '@iconify/react/dist/iconify.js';
import axios from 'axios';

const ViewOrderStatus = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Get the status ID from the URL
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Define the API URL
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

    useEffect(() => {
        const fetchOrderStatusDetails = async () => {
            try {
                // Fetch the order status data by ID
                const response = await axios.get(`${API_URL}/OrderStatuses/${id}`);
                setStatus(response.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Error fetching order status details');
            } finally {
                setLoading(false);
            }
        };

        fetchOrderStatusDetails();
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
                            onClick={() => navigate("/order-statuses")}
                        >
                            <Icon icon="mingcute:back-line" className="me-2" />
                            Back to Order Statuses
                        </button>
                    </div>
                </div>
            </MasterLayout>
        );
    }

    return (
        <MasterLayout>
            <Breadcrumb title="View Order Status" />
            <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="card-title">Order Status Details</h5>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => navigate("/orderstatus")}
                    >
                        <Icon icon="mingcute:back-line" className="me-2" />
                        Back to Order Statuses
                    </button>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-8">
                            <div className="card">
                                <div className="card-header">
                                    <h5 className="card-title mb-0">Order Status Information</h5>
                                </div>
                                <div className="card-body">
                                    <div className="table-responsive">
                                        <table className="table table-bordered basic-table">
                                            <tbody>
                                                <tr>
                                                    <th scope="col">Status ID</th>
                                                    <td>{status?.status_id}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="col">Status Name</th>
                                                    <td>{status?.status_name}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="col">Status Description</th>
                                                    <td>{status?.status_description}</td>
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
        </MasterLayout>
    );
};

export default ViewOrderStatus;