import React, { useState } from "react";
import MasterLayout from "../../masterLayout/MasterLayout";
import Breadcrumb from "../../components/Breadcrumb";
import { useNavigate } from "react-router-dom";
import { Icon } from '@iconify/react/dist/iconify.js';
import axios from 'axios';
import ImageUpload from "../Products/ImageUpload"; // Import the ImageUpload component
import { uploadImageToCloudinary } from "../../hook/cloudnary-helper";

const AddCategory = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        category_name: '',
        category_description: '',
        ImageURL: '' // Add ImageURL to formData
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [imageFile, setImageFile] = useState(null); // State to store the selected image file
    const [successMessage, setSuccessMessage] = useState(null); // State to store success message
    const [imageError, setImageError] = useState(null); // State to store image validation error

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
                imageUrl = await uploadImageToCloudinary(imageFile, "Categories");
                setFormData((prevData) => ({
                    ...prevData,
                    ImageURL: imageUrl
                }));
            }

            // Submit the form data to your backend API
            const response = await axios.post(`${API_URL}/ProductCategories/`, {
                ...formData,
                ImageURL: imageUrl // Ensure ImageURL is included in the request
            });

            if (response.status === 201) {
                setSuccessMessage("The category has been added successfully!"); // Set success message

                // Clear the form data and image file
                setFormData({
                    category_name: '',
                    category_description: '',
                    ImageURL: ''
                });
                setImageFile(null);
                resetImageUpload();
                // Clear the success message after 5 seconds
                setTimeout(() => {
                    setSuccessMessage(null);
                }, 5000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error adding category');
        } finally {
            setLoading(false);
        }
    };

    return (
        <MasterLayout>
            <Breadcrumb title="Manage Categories" />
            <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="card-title">Add New Category</h5>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => navigate("/categories")}
                    >
                        <Icon icon="mingcute:back-line" className="me-2" />
                        Back to Categories
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
                                    <label htmlFor="category_name" className="form-label">Category Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="category_name"
                                        name="category_name"
                                        value={formData.category_name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="category_description" className="form-label">Category Description</label>
                                    <textarea
                                        className="form-control"
                                        id="category_description"
                                        name="category_description"
                                        value={formData.category_description}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="col-md-6">
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
                                    'Add Category'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </MasterLayout>
    );
};

export default AddCategory;