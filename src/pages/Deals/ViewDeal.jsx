import React, { useState, useEffect } from "react";
import MasterLayout from "../../masterLayout/MasterLayout";
import Breadcrumb from "../../components/Breadcrumb";
import { useNavigate, useParams } from "react-router-dom";
import { Icon } from '@iconify/react/dist/iconify.js';
import axios from 'axios';

const ViewDeal = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Get the deal ID from the URL
    const [deal, setDeal] = useState(null);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Define the API URL
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

    useEffect(() => {
        const fetchDealDetails = async () => {
            try {
                // Fetch the deal data by ID
                const dealResponse = await axios.get(`${API_URL}/Deals/${id}`);
                setDeal(dealResponse.data);

                // Fetch the associated product details
                const productResponse = await axios.get(`${API_URL}/Products/${dealResponse.data.product_id}`);
                setProduct(productResponse.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Error fetching deal details');
            } finally {
                setLoading(false);
            }
        };

        fetchDealDetails();
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
                            onClick={() => navigate("/deals")}
                        >
                            <Icon icon="mingcute:back-line" className="me-2" />
                            Back to Deals
                        </button>
                    </div>
                </div>
            </MasterLayout>
        );
    }

    return (
        <MasterLayout>
            <Breadcrumb title="View Deal" />
            <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="card-title">Deal Details</h5>
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
                    <div className="row">
                        <div className="col-md-8">
                            <div className="card">
                                <div className="card-header">
                                    <h5 className="card-title mb-0">Deal Information</h5>
                                </div>
                                <div className="card-body">
                                    <div className="table-responsive">
                                        <table className="table table-bordered basic-table">
                                            <tbody>
                                                <tr>
                                                    <th scope="col">Deal Name</th>
                                                    <td>{deal?.deal_name}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="col">Description</th>
                                                    <td>{deal?.description}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="col">Start Date</th>
                                                    <td>{new Date(deal?.start_date).toLocaleDateString()}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="col">End Date</th>
                                                    <td>{new Date(deal?.end_date).toLocaleDateString()}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="col">Discount Percentage</th>
                                                    <td>{deal?.discount_percentage}%</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                            <div className="mt-4">
                                <h6 className="mb-3">Product Information</h6>
                                <div className="table-responsive">
                                    <table className="table table-bordered basic-table">
                                        <tbody>
                                            <tr>
                                                <th>Name</th>
                                                <td>{product?.product_name}</td>
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

export default ViewDeal;