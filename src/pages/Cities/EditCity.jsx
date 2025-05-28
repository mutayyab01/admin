import React, { useState, useEffect } from "react";
import MasterLayout from "../../masterLayout/MasterLayout";
import Breadcrumb from "../../components/Breadcrumb";
import { useNavigate, useParams } from "react-router-dom";
import { Icon } from '@iconify/react/dist/iconify.js';
import axios from 'axios';

const EditCity = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Get the city ID from the URL

    const [formData, setFormData] = useState({
        city_name: '',
        state: '',
        country: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // Define the API URL
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

    // Fetch city data on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch city data
                const cityResponse = await axios.get(`${API_URL}/Cities/${id}`);
                setFormData(cityResponse.data);
            } catch (err) {
                setError('Error fetching data');
            }
        };

        fetchData();
    }, [id, API_URL]);

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
            // Submit the updated form data to your backend API
            const response = await axios.put(`${API_URL}/Cities/${id}`, formData);

            if (response.status === 200) {
                setSuccessMessage("The city has been updated successfully!"); // Set success message

                // Clear the success message after 5 seconds
                setTimeout(() => {
                    setSuccessMessage(null);
                }, 5000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error updating city');
        } finally {
            setLoading(false);
        }
    };

    return (
        <MasterLayout>
            <Breadcrumb title="Edit City" />
            <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="card-title">Edit City Details</h5>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => navigate("/cities")}
                    >
                        <Icon icon="mingcute:back-line" className="me-2" />
                        Back to Cities
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
                                    <label htmlFor="city_name" className="form-label">City Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="city_name"
                                        name="city_name"
                                        value={formData.city_name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="state" className="form-label">State</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="state"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label htmlFor="country" className="form-label">Country</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="country"
                                        name="country"
                                        value={formData.country}
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
                                    'Update City'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </MasterLayout>
    );
};

export default EditCity;