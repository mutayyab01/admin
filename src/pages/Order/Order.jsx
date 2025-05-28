import React, { useEffect, useState } from "react";
import MasterLayout from "../../masterLayout/MasterLayout";
import Breadcrumb from "../../components/Breadcrumb";
import $ from 'jquery';
import 'datatables.net-dt/js/dataTables.dataTables.js';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderStatuses, setOrderStatuses] = useState({});
  const [warehouses, setWarehouses] = useState({});

  // Define the API URL
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
  const getOrderUrl = `${API_URL}/order/`;
  const getCustomerUrl = `${API_URL}/customers/`;
  const getOrderStatusUrl = `${API_URL}/orderStatuses/`;
  const getWarehouseUrl = `${API_URL}/warehouses/`;

  const [customers, setCustomers] = useState({});
// Order status mapping
const ORDER_STATUS = {
  1: { label: 'Pending', class: 'warning' },
  2: { label: 'Shipped', class: 'info' },
  3: { label: 'Delivered', class: 'info' },
  4: { label: 'Cancelled', class: 'danger' },
  6: { label: 'Completed', class: 'success' },
};


  const fetchCustomerName = async (customerId) => {
    try {
      const response = await axios.get(`${getCustomerUrl}${customerId}`);
      if (response.data) {
        setCustomers(prev => ({
          ...prev,
          [customerId]: response.data.first_name+ " "+ response.data.last_name
        }));
      }
    } catch (error) {
      console.error(`Error fetching customer ${customerId}:`, error);
    }
  };

  const fetchOrderStatus = async (statusId) => {
    try {
      const response = await axios.get(`${getOrderStatusUrl}${statusId}`);
      if (response.data) {
        setOrderStatuses(prev => ({
          ...prev,
          [statusId]: response.data.status_name
        }));
      }
    } catch (error) {
      console.error(`Error fetching order status ${statusId}:`, error);
    }
  };

  const fetchWarehouseName = async (warehouseId) => {
    try {
      const response = await axios.get(`${getWarehouseUrl}${warehouseId}`);
      if (response.data) {
        setWarehouses(prev => ({
          ...prev,
          [warehouseId]: response.data.warehouse_name
        }));
      }
    } catch (error) {
      console.error(`Error fetching warehouse ${warehouseId}:`, error);
    }
  };

  const fetchOrders = async () => {
    try {
      const adminUser = JSON.parse(localStorage.getItem('adminUser'));
      if (!adminUser || !adminUser.MerchantID) {
        throw new Error('Merchant ID not found');
      }

      const response = await axios.get(`${getOrderUrl}getOrdersByMerchantId/${adminUser.MerchantID}`);
      setOrders(response.data);

      // Fetch merchant, customer, order status, and warehouse names for each order
      const uniqueCustomerIds = [...new Set(response.data.map(order => order.customer_id))];
      const uniqueStatusIds = [...new Set(response.data.map(order => order.status_id))];
      const uniqueWarehouseIds = [...new Set(response.data.map(order => order.warehouse_id))];

      uniqueCustomerIds.forEach(customerId => {
        if (customerId && !customers[customerId]) {
          fetchCustomerName(customerId);
        }
      });

      uniqueStatusIds.forEach(statusId => {
        if (statusId && !orderStatuses[statusId]) {
          fetchOrderStatus(statusId);
        }
      });

      uniqueWarehouseIds.forEach(warehouseId => {
        if (warehouseId && !warehouses[warehouseId]) {
          fetchWarehouseName(warehouseId);
        }
      });

      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (!loading) {
      const table = $('#orderTable').DataTable({
        pageLength: 10,
        destroy: true
      });
      return () => {
        table.destroy(true);
      };
    }
  }, [loading, orders]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <MasterLayout>
      <Breadcrumb title='Orders' />
      
      <div className="card basic-data-table">
        <div className="card-header">
          <h5 className="card-title mb-0">All Orders</h5>
        </div>
        <div className="card-body">
          <table
            className="table bordered-table mb-0"
            id="orderTable"
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
                <th scope="col">Order ID</th>
                <th scope="col">Customer</th>
                <th scope="col">Warehouse</th>
                <th scope="col">Order Date</th>
                <th scope="col">Total Amount</th>
                <th scope="col">Status</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={order.order_id}>
                  <td>
                    <div className="form-check style-check d-flex align-items-center">
                      <input className="form-check-input" type="checkbox" />
                      <label className="form-check-label">{index+1}</label>
                    </div>
                  </td>
                  <td>
                      #{order.order_id}
                  </td>
                  <td>{customers[order.customer_id] || 'Loading...'}</td>
                  <td>{warehouses[order.warehouse_id] || 'Loading...'}</td>
                  <td>{new Date(order.order_date).toLocaleDateString()}</td>
                  <td>${order.total_price}</td>
                  <td>
                    {ORDER_STATUS[order.status_id] ? (
                      <span className={`bg-${ORDER_STATUS[order.status_id].class}-focus text-${ORDER_STATUS[order.status_id].class}-main px-24 py-4 rounded-pill fw-medium text-sm`}>
                        {ORDER_STATUS[order.status_id].label}
                      </span>
                    ) : (
                      <span className="bg-warning-focus text-warning-main px-24 py-4 rounded-pill fw-medium text-sm">
                        {orderStatuses[order.status_id]}
                      </span>
                    )}
                  </td>
                  <td>
                    <Link
                      to={`/ViewOrder/${order.order_id}`}
                      className="w-32-px h-32-px me-8 bg-primary-light text-primary-600 rounded-circle d-inline-flex align-items-center justify-content-center"
                    >
                      <Icon icon="iconamoon:eye-light" />
                    </Link>
                    <Link
                      to={`/EditOrder/${order.order_id}`}
                      className="w-32-px h-32-px me-8 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center"
                    >
                      <Icon icon="lucide:edit" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </MasterLayout>
  );
};

export default Order;