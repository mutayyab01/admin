import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MasterLayout from "../../masterLayout/MasterLayout";
import Breadcrumb from "../../components/Breadcrumb";
import axios from 'axios';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Link } from 'react-router-dom';

const ViewSale = () => {
  const { id } = useParams();
  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [product, setProduct] = useState(null);
  const [city, setCity] = useState(null);
  const [category, setCategory] = useState(null);

  // Define the API URL
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
  const getSaleUrl = `${API_URL}/sale/getSaleById/${id}`;
  const getCustomerUrl = `${API_URL}/customers/`;
  const getProductUrl = `${API_URL}/products/`;
  const getCityUrl = `${API_URL}/Cities/`;
  const getCategoryUrl = `${API_URL}/productCategories/`;

  const fetchSaleDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(getSaleUrl);
      const saleData = response.data.sales;
      setSale(saleData);
      console.log(sale)
      
      // Fetch related data
      if (saleData.customer_id) {
        const customerResponse = await axios.get(`${getCustomerUrl}${saleData.customer_id}`);
        setCustomer(customerResponse.data);
      }

      if (saleData.product_id) {
        const productResponse = await axios.get(`${getProductUrl}${saleData.product_id}`);
        setProduct(productResponse.data);
      }

      if (saleData.city_id) {
        const cityResponse = await axios.get(`${getCityUrl}${saleData.city_id}`);
        setCity(cityResponse.data);
      }

      if (saleData.category_id) {
        const categoryResponse = await axios.get(`${getCategoryUrl}${saleData.category_id}`);
        setCategory(categoryResponse.data);
      }

      setLoading(false);
    } catch (err) {
      console.error('Error fetching sale details:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaleDetails();
  }, [id]);

  if (loading) return (
    <MasterLayout>
      <Breadcrumb title='View Sale' />
      <div className="card">
        <div className="card-body d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <span className="ms-3">Loading sale details...</span>
        </div>
      </div>
    </MasterLayout>
  );

  if (error) return (
    <MasterLayout>
      <Breadcrumb title='View Sale' />
      <div className="card">
        <div className="card-body">
          <div className="alert alert-danger" role="alert">
            Error: {error}
          </div>
        </div>
      </div>
    </MasterLayout>
  );

  if (!sale) return (
    <MasterLayout>
      <Breadcrumb title='View Sale' />
      <div className="card">
        <div className="card-body">
          <div className="alert alert-warning" role="alert">
            No sale found with the specified ID.
          </div>
        </div>
      </div>
    </MasterLayout>
  );

  return (
    <MasterLayout>
      <Breadcrumb title='View Sale' />

      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">Sale Details</h5>
          <Link
            to="/Sales"
            className="btn btn-primary"
          >
            <Icon icon="lucide:arrow-left" className="me-2" />
            Back to Sales
          </Link>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <div className="mb-4">
                <h6 className="text-muted mb-2">Sale Information</h6>
                <div className="table-responsive">
                  <table className="table table-borderless">
                    <tbody>
                      <tr>
                        <th width="200">Sale ID</th>
                        <td>#{sale.sales_id}</td>
                      </tr>
                      <tr>
                        <th>Order ID</th>
                        <td>#{sale.order_id}</td>
                      </tr>
                      <tr>
                        <th>Quantity</th>
                        <td>{sale.quantity}</td>
                      </tr>
                      <tr>
                        <th>Amount</th>
                        <td>${sale.sales_amount}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-4">
                <h6 className="text-muted mb-2">Related Information</h6>
                <div className="table-responsive">
                  <table className="table table-borderless">
                    <tbody>
                      <tr>
                        <th width="200">Customer</th>
                        <td>{customer ? `${customer.first_name} ${customer.last_name}` : 'N/A'}</td>
                      </tr>
                      <tr>
                        <th>Product</th>
                        <td>{product ? product.product_name : 'N/A'}</td>
                      </tr>
                      <tr>
                        <th>City</th>
                        <td>{city ? city.city_name : 'N/A'}</td>
                      </tr>
                      <tr>
                        <th>Category</th>
                        <td>{category ? category.category_name : 'N/A'}</td>
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

export default ViewSale;