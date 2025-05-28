import React, { useState, useEffect } from "react";
import MasterLayout from "../../masterLayout/MasterLayout";
import Breadcrumb from "../../components/Breadcrumb";
import { useNavigate, useParams } from "react-router-dom";
import { Icon } from '@iconify/react/dist/iconify.js';
import axios from 'axios';
import ImageUpload from "../Products/ImageUpload"; // Import the ImageUpload component
import { deleteImageFromCloudinary } from "../../hook/cloudnary-helper";
import { uploadImageToCloudinary } from "../../hook/cloudnary-helper";

const EditCategory = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Get the category ID from the URL

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

    // Fetch category data on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch category data
                const categoryResponse = await axios.get(`${API_URL}/productCategories/${id}`);
                setFormData(categoryResponse.data);
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

    // Handle image file selection from ImageUpload component
    const handleImageFileChange = (file) => {
        setImageFile(file);
        setImageError(null); // Clear image error when a file is selected
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            let imageUrl = formData.ImageURL;

            // If a new image is selected, delete the old image and upload the new one
            if (imageFile) {
                // Delete the old image from Cloudinary
                if (formData.ImageURL) {
                    await deleteImageFromCloudinary(formData.ImageURL);
                }

                // Upload the new image to Cloudinary
                imageUrl = await uploadImageToCloudinary(imageFile, "categories");
            }

            // Submit the updated form data to your backend API
            const response = await axios.put(`${API_URL}/productCategories/${id}`, {
                ...formData,
                ImageURL: imageUrl // Ensure ImageURL is included in the request
            });

            if (response.status === 200) {
                setSuccessMessage("The category has been updated successfully!"); // Set success message

                // Clear the success message after 5 seconds
                setTimeout(() => {
                    setSuccessMessage(null);
                }, 5000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error updating category');
        } finally {
            setLoading(false);
        }
    };

    return (
        <MasterLayout>
            <Breadcrumb title="Edit Category" />
            <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="card-title">Edit Category Details</h5>
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
                                    <span className="text-red">Leave blank If you don't want to update the picture</span>
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
                                    'Update Category'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </MasterLayout>
    );
};

export default EditCategory;