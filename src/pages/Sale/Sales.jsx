import React, { useEffect, useState } from "react";
import MasterLayout from "../../masterLayout/MasterLayout";
import Breadcrumb from "../../components/Breadcrumb";
import $ from 'jquery';
import 'datatables.net-dt/js/dataTables.dataTables.js';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customers, setCustomers] = useState({});
  const [products, setProducts] = useState({});
  const [cities, setCities] = useState({});
  const [categories, setCategories] = useState({});

  // Define the API URL
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
  const getSalesUrl = `${API_URL}/sale/getAllSales`;
  const getCustomerUrl = `${API_URL}/customers/`;
  const getProductUrl = `${API_URL}/products/`;
  const getCityUrl = `${API_URL}/Cities/`;
  const getCategoryUrl = `${API_URL}/productCategories/`;

  const fetchCustomerName = async (customerId) => {
    try {
      const response = await axios.get(`${getCustomerUrl}${customerId}`);
      if (response.data) {
        setCustomers(prev => ({
          ...prev,
          [customerId]: response.data.first_name + " " + response.data.last_name
        }));
      }
    } catch (error) {
      console.error(`Error fetching customer ${customerId}:`, error);
    }
  };

  const fetchProductName = async (productId) => {
    try {
      const response = await axios.get(`${getProductUrl}${productId}`);
      if (response.data) {
        setProducts(prev => ({
          ...prev,
          [productId]: response.data.product_name
        }));
      }
    } catch (error) {
      console.error(`Error fetching product ${productId}:`, error);
    }
  };

  const fetchCityName = async (cityId) => {
    try {
      const response = await axios.get(`${getCityUrl}${cityId}`);
      if (response.data) {
        setCities(prev => ({
          ...prev,
          [cityId]: response.data.city_name
        }));
      }
    } catch (error) {
      console.error(`Error fetching city ${cityId}:`, error);
    }
  };

  const fetchCategoryName = async (categoryId) => {
    try {
      const response = await axios.get(`${getCategoryUrl}${categoryId}`);
      if (response.data) {
        setCategories(prev => ({
          ...prev,
          [categoryId]: response.data.category_name
        }));
      }
    } catch (error) {
      console.error(`Error fetching category ${categoryId}:`, error);
    }
  };

  const fetchSales = async () => {
    try {
      setLoading(true);
      const response = await axios.get(getSalesUrl);
      const salesData = response.data.sales;
      setSales(salesData);

      // Fetch related data for each sale after we have the sales data
      const uniqueCustomerIds = [...new Set(salesData.map(sale => sale.customer_id))];
      const uniqueProductIds = [...new Set(salesData.map(sale => sale.product_id))];
      const uniqueCityIds = [...new Set(salesData.map(sale => sale.city_id))];
      const uniqueCategoryIds = [...new Set(salesData.map(sale => sale.category_id))];

      await Promise.all([
        ...uniqueCustomerIds.map(customerId => {
          if (customerId && !customers[customerId]) {
            return fetchCustomerName(customerId);
          }
          return Promise.resolve();
        }),
        ...uniqueProductIds.map(productId => {
          if (productId && !products[productId]) {
            return fetchProductName(productId);
          }
          return Promise.resolve();
        }),
        ...uniqueCityIds.map(cityId => {
          if (cityId && !cities[cityId]) {
            return fetchCityName(cityId);
          }
          return Promise.resolve();
        }),
        ...uniqueCategoryIds.map(categoryId => {
          if (categoryId && !categories[categoryId]) {
            return fetchCategoryName(categoryId);
          }
          return Promise.resolve();
        })
      ]);

      setLoading(false);
    } catch (err) {
      console.error('Error fetching sales:', err);
      setError(err.message);
      setLoading(false);
      setSales([]); // Ensure sales is always an array
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  useEffect(() => {
    if (!loading && sales.length > 0) {
      // Initialize DataTable only when data is available
      const table = $('#salesTable').DataTable({
        pageLength: 10,
        destroy: true
      });

      return () => {
        table.destroy(true);
      };
    }
  }, [loading, sales]);

  if (loading) return (
    <MasterLayout>
      <Breadcrumb title='Sales' />
      <div className="card basic-data-table">
        <div className="card-body d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <span className="ms-3">Loading sales data...</span>
        </div>
      </div>
    </MasterLayout>
  );
  
  if (error) return (
    <MasterLayout>
      <Breadcrumb title='Sales' />
      <div className="card basic-data-table">
        <div className="card-body">
          <div className="alert alert-danger" role="alert">
            Error: {error}
          </div>
        </div>
      </div>
    </MasterLayout>
  );

  return (
    <MasterLayout>
      <Breadcrumb title='Sales' />

      <div className="card basic-data-table">
        <div className="card-header">
          <h5 className="card-title mb-0">All Sales</h5>
        </div>
        <div className="card-body">
          <table
            className="table bordered-table mb-0"
            id="salesTable"
            data-page-length={10}
          >
            <thead>
              <tr>
                <th scope="col">
                  <div className="form-check style-check d-flex align-items-center">
                    <input className="form-check-input" type="checkbox" />
                    <label className="form-check-label">S.N</label>
                  </div>
                </th>
                <th scope="col">Sale ID</th>
                <th scope="col">Order ID</th>
                <th scope="col">Product</th>
                <th scope="col">Customer</th>
                <th scope="col">City</th>
                <th scope="col">Category</th>
                <th scope="col">Quantity</th>
                <th scope="col">Amount</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {sales && sales.length > 0  ? (
                sales.map((sale, index) => (
                  <tr key={sale.sales_id}>
                    <td>
                      <div className="form-check style-check d-flex align-items-center">
                        <input className="form-check-input" type="checkbox" />
                        <label className="form-check-label">{index + 1}</label>
                      </div>
                    </td>
                    <td>#{sale.sales_id}</td>
                    <td>#{sale.order_id}</td>
                    <td>{products[sale.product_id] || 'Loading...'}</td>
                    <td>{customers[sale.customer_id] || 'Loading...'}</td>
                    <td>{cities[sale.city_id] || 'Loading...'}</td>
                    <td>{categories[sale.category_id] || 'Loading...'}</td>
                    <td>{sale.quantity}</td>
                    <td>${sale.sales_amount}</td>
                    <td>
                      <Link
                        to={`/ViewSale/${sale.sales_id}`}
                        className="w-32-px h-32-px me-8 bg-primary-light text-primary-600 rounded-circle d-inline-flex align-items-center justify-content-center"
                      >
                        <Icon icon="iconamoon:eye-light" />
                      </Link>
                      <Link
                        to={`/EditSale/${sale.sales_id}`}
                        className="w-32-px h-32-px me-8 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center"
                      >
                        <Icon icon="lucide:edit" />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="text-center">No sales data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </MasterLayout>
  );
};

export default Sales;