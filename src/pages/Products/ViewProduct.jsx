import React, { useState, useEffect } from "react";
import MasterLayout from "../../masterLayout/MasterLayout";
import Breadcrumb from "../../components/Breadcrumb";
import { useNavigate, useParams } from "react-router-dom";
import { Icon } from '@iconify/react/dist/iconify.js';
import axios from 'axios';


const ViewProduct = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [category, setCategory] = useState(null);
    const [merchant, setMerchant] = useState(null);
    const [warehouse, setWarehouse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Define the API URL
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                // First, fetch the product data
                const productResponse = await axios.get(`${API_URL}/products/${id}`);
                setProduct(productResponse.data);

                // Then fetch the related data using the product's IDs
                const [categoryResponse, merchantResponse, warehouseResponse] = await Promise.all([
                    axios.get(`${API_URL}/productCategories/${productResponse.data.category_id}`),
                    axios.get(`${API_URL}/merchants/${productResponse.data.merchant_id}`),
                    axios.get(`${API_URL}/warehouses/${productResponse.data.warehouse_id}`)
                ]);

                setCategory(categoryResponse.data);
                setMerchant(merchantResponse.data);
                setWarehouse(warehouseResponse.data);

            } catch (err) {
                setError(err.response?.data?.message || 'Error fetching product details');
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetails();
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
                            onClick={() => navigate("/products")}
                        >
                            <Icon icon="mingcute:back-line" className="me-2" />
                            Back to Products
                        </button>
                    </div>
                </div>
            </MasterLayout>
        );
    }

    return (
        <MasterLayout>
            <Breadcrumb title="View Product" />
            <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="card-title">Product Details</h5>
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
                    <div className="row">
                        <div className="col-md-4">
                            <img
                                src={product?.ImageURL || '/assets/images/user-list/user-list1.png'}
                                alt={product?.product_name}
                                className="img-fluid radius-8 mb-3"
                            />
                        </div>
                        <div className="col-md-8">
                            <div className="card">
                                <div className="card-header">
                                    <h5 className="card-title mb-0">Product Information</h5>
                                </div>
                                <div className="card-body">
                                    <div className="table-responsive">
                                        <table className="table table-bordered basic-table">
                                            <tbody>
                                                <tr>
                                                    <th scope="col">Items</th>
                                                    <td >{product?.product_name}</td>

                                                </tr>
                                                <tr>
                                                    <th scope="col">Price</th>
                                                    <td >{product?.price}</td>

                                                </tr>
                                                <tr>
                                                    <th scope="col">Stock</th>
                                                    <td >{product?.stock_quantity}</td>

                                                </tr>
                                                <tr>
                                                    <th scope="col">Brand</th>
                                                    <td >{product?.brand}</td>

                                                </tr>
                                                <tr>
                                                    <th scope="col" >Status</th>
                                                    <td >{product?.status}</td>
                                                </tr>
                                            </tbody>
                                           
                                        </table>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4">
                                <h6 className="mb-3">Category Details</h6>
                                <div className="table-responsive">
                                    <table className="table table-bordered basic-table">
                                        <tbody>
                                            <tr>
                                                <th>Category Name</th>
                                                <td>{category?.category_name}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="mt-4">
                                <h6 className="mb-3">Merchant Details</h6>
                                <div className="table-responsive">
                                    <table className="table table-bordered basic-table">
                                        <tbody>
                                            <tr>
                                                <th>Merchant Name</th>
                                                <td>{merchant?.merchant_name}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="mt-4">
                                <h6 className="mb-3">Warehouse Details</h6>
                                <div className="table-responsive">
                                    <table className="table table-bordered basic-table">
                                        <tbody>
                                            <tr>
                                                <th>Warehouse Name</th>
                                                <td>{warehouse?.warehouse_name}</td>
                                            </tr>

                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MasterLayout>
    );
};

export default ViewProduct; 