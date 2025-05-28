import React, { useState } from "react";
import MasterLayout from "../../masterLayout/MasterLayout";
import Breadcrumb from "../../components/Breadcrumb";
import { useNavigate } from "react-router-dom";
import { Icon } from '@iconify/react/dist/iconify.js';
import axios from 'axios';

const AddOrderStatus = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        status_name: '',
        status_description: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // Define the API URL
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            // Submit the form data to the OrderStatuses API
            const response = await axios.post(`${API_URL}/OrderStatuses/`, formData);

            if (response.status === 201) {
                setSuccessMessage("The order status has been added successfully!"); // Set success message

                // Clear the form data
                setFormData({
                    status_name: '',
                    status_description: ''
                });

                // Clear the success message after 5 seconds
                setTimeout(() => {
                    setSuccessMessage(null);
                }, 5000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error adding order status');
        } finally {
            setLoading(false);
        }
    };

    return (
        <MasterLayout>
            <Breadcrumb title="Manage Order Statuses" />
            <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="card-title">Add New Order Status</h5>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => navigate("/OrderStatus")}
                    >
                        <Icon icon="mingcute:back-line" className="me-2" />
                        Back to Order Statuses
                    </button>
                </div>
                <div className="card-body">
                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}
                    {successMessage && (
                        <div
                            className="alert alert-success bg-success-100 text-success-600 border-success-600 border-start-width-4-px border-top-0 border-end-0 border-bottom-0 px-24 py-13 mb-0 fw-semibold text-lg radius-4 d-flex align-items-center justify-content-between"
                            role="alert"
                        >
                            <div className="d-flex align-items-center gap-2">
                                <Icon
                                    icon="akar-icons:double-check"
                                    className="icon text-xl"
                                />
                                {successMessage}
                            </div>
                            <button
                                className="remove-button text-success-600 text-xxl line-height-1"
                                onClick={() => setSuccessMessage(null)} // Clear success message
                            >
                                <Icon icon="iconamoon:sign-times-light" className="icon" />
                            </button>
                        </div>
                    )}
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            {/* Left Column */}
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label htmlFor="status_name" className="form-label">Status Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="status_name"
                                        name="status_name"
                                        value={formData.status_name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="status_description" className="form-label">Status Description</label>
                                    <textarea
                                        className="form-control"
                                        id="status_description"
                                        name="status_description"
                                        value={formData.status_description}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="mt-4">
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? (
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                ) : (
                                    'Add Order Status'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </MasterLayout>
    );
};

export default AddOrderStatus;