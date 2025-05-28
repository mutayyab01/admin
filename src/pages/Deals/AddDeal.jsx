import React, { useState, useEffect } from "react";
import MasterLayout from "../../masterLayout/MasterLayout";
import Breadcrumb from "../../components/Breadcrumb";
import { useNavigate } from "react-router-dom";
import { Icon } from '@iconify/react/dist/iconify.js';
import axios from 'axios';

const AddDeal = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        deal_name: '',
        description: '',
        start_date: '',
        end_date: '',
        discount_percentage: '',
        product_id: ''
    });
    const [products, setProducts] = useState([]); // State to store products
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // Define the API URL
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

    // Fetch products on component mount
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${API_URL}/Products`);
                setProducts(response.data);
            } catch (err) {
                setError('Error fetching products');
            }
        };

        fetchProducts();
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
            // Submit the form data to the Deals API
            const response = await axios.post(`${API_URL}/Deals/`, formData);

            if (response.status === 201) {
                setSuccessMessage("The deal has been added successfully!"); // Set success message

                // Clear the form data
                setFormData({
                    deal_name: '',
                    description: '',
                    start_date: '',
                    end_date: '',
                    discount_percentage: '',
                    product_id: ''
                });

                // Clear the success message after 5 seconds
                setTimeout(() => {
                    setSuccessMessage(null);
                }, 5000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error adding deal');
        } finally {
            setLoading(false);
        }
    };

    return (
        <MasterLayout>
            <Breadcrumb title="Manage Deals" />
            <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="card-title">Add New Deal</h5>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => navigate("/deals")}
                    >
                        <Icon icon="mingcute:back-line" className="me-2" />
                        Back to Deals
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
                                    <label htmlFor="deal_name" className="form-label">Deal Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="deal_name"
                                        name="deal_name"
                                        value={formData.deal_name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">Description</label>
                                    <textarea
                                        className="form-control"
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="start_date" className="form-label">Start Date</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="start_date"
                                        name="start_date"
                                        value={formData.start_date}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label htmlFor="end_date" className="form-label">End Date</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="end_date"
                                        name="end_date"
                                        value={formData.end_date}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="discount_percentage" className="form-label">Discount Percentage</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="discount_percentage"
                                        name="discount_percentage"
                                        value={formData.discount_percentage}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="product_id" className="form-label">Product</label>
                                    <select
                                        className="form-control"
                                        id="product_id"
                                        name="product_id"
                                        value={formData.product_id}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select a product</option>
                                        {products.map((product) => (
                                            <option key={product.product_id} value={product.product_id}>
                                                {product.product_name}
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
                                    'Add Deal'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </MasterLayout>
    );
};

export default AddDeal;