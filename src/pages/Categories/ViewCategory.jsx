import React, { useState, useEffect } from "react";
import MasterLayout from "../../masterLayout/MasterLayout";
import Breadcrumb from "../../components/Breadcrumb";
import { useNavigate, useParams } from "react-router-dom";
import { Icon } from '@iconify/react/dist/iconify.js';
import axios from 'axios';

const ViewCategory = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Get the category ID from the URL
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Define the API URL
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

    useEffect(() => {
        const fetchCategoryDetails = async () => {
            try {
                // Fetch the category data by ID
                const response = await axios.get(`${API_URL}/ProductCategories/${id}`);
                setCategory(response.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Error fetching category details');
            } finally {
                setLoading(false);
            }
        };

        fetchCategoryDetails();
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
                            onClick={() => navigate("/categories")}
                        >
                            <Icon icon="mingcute:back-line" className="me-2" />
                            Back to Categories
                        </button>
                    </div>
                </div>
            </MasterLayout>
        );
    }

    return (
        <MasterLayout>
            <Breadcrumb title="View Category" />
            <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="card-title">Category Details</h5>
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
                    <div className="row">
                        <div className="col-md-4">
                            <img
                                src={category?.ImageURL || '/assets/images/default-category.png'}
                                alt={category?.category_name}
                                className="img-fluid radius-8 mb-3"
                                style={{ maxWidth: '100%' }}
                            />
                        </div>
                        <div className="col-md-8">
                            <div className="card">
                                <div className="card-header">
                                    <h5 className="card-title mb-0">Category Information</h5>
                                </div>
                                <div className="card-body">
                                    <div className="table-responsive">
                                        <table className="table table-bordered basic-table">
                                            <tbody>
                                                <tr>
                                                    <th scope="col">Category ID</th>
                                                    <td>{category?.category_id}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="col">Category Name</th>
                                                    <td>{category?.category_name}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="col">Category Description</th>
                                                    <td>{category?.category_description}</td>
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

export default ViewCategory;