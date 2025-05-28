import React, { useState, useEffect } from "react";
import MasterLayout from "../../masterLayout/MasterLayout";
import Breadcrumb from "../../components/Breadcrumb";
import { useNavigate } from "react-router-dom";
import { Icon } from '@iconify/react/dist/iconify.js';
import axios from 'axios';
import ImageUpload from "./ImageUpload"; // Import the ImageUpload component
import {uploadImageToCloudinary} from "../../hook/cloudnary-helper";

const AddProduct = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        product_name: '',
        category_id: '',
        brand: '',
        price: '',
        stock_quantity: '',
        merchant_id: localStorage.getItem('adminUser') ? JSON.parse(localStorage.getItem('adminUser')).MerchantID : '',
        warehouse_id: '',
        ImageURL: '' // Add ImageURL to formData
    });
    const [categories, setCategories] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [imageFile, setImageFile] = useState(null); // State to store the selected image file
    const [successMessage, setSuccessMessage] = useState(null); // State to store success message
    const [imageError, setImageError] = useState(null); // State to store image validation error

    // Define the API URL
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

    // Fetch categories and warehouses on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const categoriesResponse = await axios.get(`${API_URL}/productCategories`);
                setCategories(categoriesResponse.data);

                const warehousesResponse = await axios.get(`${API_URL}/warehouses`);
                setWarehouses(warehousesResponse.data);
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

    // Handle image file selection from ImageUpload component
    const handleImageFileChange = (file) => {
        setImageFile(file);
        setImageError(null); // Clear image error when a file is selected
    };

    const resetImageUpload = () => {
        document.getElementById('clearImage').click()
    };
   

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        // Validate that an image is selected
        if (!imageFile) {
            setImageError("Please select an image to upload.");
            setLoading(false);
            return;
        }

        try {
            let imageUrl = '';

            // Upload image to Cloudinary if a file is selected
            if (imageFile) {
                imageUrl = await uploadImageToCloudinary(imageFile,"products");
                setFormData((prevData) => ({
                    ...prevData,
                    ImageURL: imageUrl
                }));
            }

            // Submit the form data to your backend API
            const response = await axios.post(`${API_URL}/products/`, {
                ...formData,
                ImageURL: imageUrl // Ensure ImageURL is included in the request
            });

            if (response.status === 201) {
                setSuccessMessage("The product has been added successfully!"); // Set success message

                // Clear the form data and image file
                setFormData({
                    product_name: '',
                    category_id: '',
                    brand: '',
                    price: '',
                    stock_quantity: '',
                    merchant_id: localStorage.getItem('adminUser') ? JSON.parse(localStorage.getItem('adminUser')).MerchantID : '',
                    warehouse_id: '',
                    ImageURL: ''
                });
                setImageFile(null);
                resetImageUpload()
                // Clear the success message after 5 seconds
                setTimeout(() => {
                    setSuccessMessage(null);
                }, 5000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error adding product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <MasterLayout>
            <Breadcrumb title="Add Product" />
            <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="card-title">Add New Product</h5>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => navigate("/products")}
                    >
                        <Icon icon="mingcute:back-line" className="me-2" />
                        Back to Products
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
                                    <label htmlFor="product_name" className="form-label">Product Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="product_name"
                                        name="product_name"
                                        value={formData.product_name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="category_id" className="form-label">Category</label>
                                    <select
                                        className="form-control"
                                        id="category_id"
                                        name="category_id"
                                        value={formData.category_id}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select a category</option>
                                        {categories.map((category) => (
                                            <option key={category.category_id} value={category.category_id}>
                                                {category.category_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="brand" className="form-label">Brand</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="brand"
                                        name="brand"
                                        value={formData.brand}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="price" className="form-label">Price</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="price"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label htmlFor="stock_quantity" className="form-label">Stock Quantity</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="stock_quantity"
                                        name="stock_quantity"
                                        value={formData.stock_quantity}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="warehouse_id" className="form-label">Warehouse</label>
                                    <select
                                        className="form-control"
                                        id="warehouse_id"
                                        name="warehouse_id"
                                        value={formData.warehouse_id}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select a warehouse</option>
                                        {warehouses.map((warehouse) => (
                                            <option key={warehouse.warehouse_id} value={warehouse.warehouse_id}>
                                                {warehouse.warehouse_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {/* Image Upload Section */}
                                <div className="ml-8 flex items-center justify-center">
                                    <ImageUpload onFileChange={handleImageFileChange} />
                                    {imageError && (
                                        <div className="text-danger mt-2">
                                            {imageError}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="mt-4">
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? (
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                ) : (
                                    'Add Product'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </MasterLayout>
    );
};

export default AddProduct;