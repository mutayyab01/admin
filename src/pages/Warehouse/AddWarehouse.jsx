import React, { useState, useEffect } from "react";
import MasterLayout from "../../masterLayout/MasterLayout";
import Breadcrumb from "../../components/Breadcrumb";
import { useNavigate } from "react-router-dom";
import { Icon } from '@iconify/react/dist/iconify.js';
import axios from 'axios';

const AddWarehouse = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        warehouse_name: '',
        location_address: '',
        postal_code: '',
        city_id: ''
    });
    const [cities, setCities] = useState([]); // State to store cities
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // Define the API URL
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

    // Fetch cities and warehouses on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const citiesResponse = await axios.get(`${API_URL}/Cities`);
                setCities(citiesResponse.data);
            } catch (err) {
                setError('Error fetching data');
            }
        };

        fetchData();
    }, [API_URL]);

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
            // Submit the form data to the Warehouses API
            const response = await axios.post(`${API_URL}/warehouses/`, formData);

            if (response.status === 201) {
                setSuccessMessage("The warehouse has been added successfully!"); // Set success message

                // Clear the form data
                setFormData({
                    warehouse_name: '',
                    location_address: '',
                    postal_code: '',
                    city_id: ''
                });

                // Clear the success message after 5 seconds
                setTimeout(() => {
                    setSuccessMessage(null);
                }, 5000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error adding warehouse');
        } finally {
            setLoading(false);
        }
    };

    return (
        <MasterLayout>
            <Breadcrumb title="Manage Warehouses" />
            <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="card-title">Add New Warehouse</h5>
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
                                    <label htmlFor="warehouse_name" className="form-label">Warehouse Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="warehouse_name"
                                        name="warehouse_name"
                                        value={formData.warehouse_name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="location_address" className="form-label">Location Address</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="location_address"
                                        name="location_address"
                                        value={formData.location_address}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label htmlFor="postal_code" className="form-label">Postal Code</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="postal_code"
                                        name="postal_code"
                                        value={formData.postal_code}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="city_id" className="form-label">City</label>
                                    <select
                                        className="form-control"
                                        id="city_id"
                                        name="city_id"
                                        value={formData.city_id}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select a city</option>
                                        {cities.map((city) => (
                                            <option key={city.city_id} value={city.city_id}>
                                                {city.city_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="mt-4">
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? (
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                ) : (
                                    'Add Warehouse'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </MasterLayout>
    );
};

export default AddWarehouse;