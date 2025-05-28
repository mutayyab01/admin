import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import MasterLayout from '../../masterLayout/MasterLayout';
import Breadcrumb from '../../components/Breadcrumb';
import { Icon } from '@iconify/react/dist/iconify.js';

const EditOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState({
    customer_id: '',
    merchant_id: '',
    warehouse_id: '',
    time_id: '',
    total_price: '',
    status_id: ''
  });
  const [customers, setCustomers] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [orderStatuses, setOrderStatuses] = useState([]);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch order data
        const orderResponse = await axios.get(`${API_URL}/order/getOrderById/${id}`);
        setOrder(orderResponse.data);

        // Fetch customers
        const customersResponse = await axios.get(`${API_URL}/customers`);
        setCustomers(customersResponse.data);

        // Fetch warehouses
        const warehousesResponse = await axios.get(`${API_URL}/warehouses`);
        setWarehouses(warehousesResponse.data);

        // Fetch order statuses
        const statusesResponse = await axios.get(`${API_URL}/orderStatuses`);
        setOrderStatuses(statusesResponse.data);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrder(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/order/editOrder/${id}`, order);
      navigate('/order'); 
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <MasterLayout>
      <Breadcrumb title='Edit Order' />

      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">Edit Order #{id}</h5>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate("/order")}
        >
          <Icon icon="mingcute:back-line" className="me-2" />
          Back to Orders
        </button>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Customer</label>
                  <select
                    className="form-select"
                    name="customer_id"
                    value={order.customer_id}
                    onChange={handleChange}
                    required
                    disabled
                  >
                    <option value="">Select Customer</option>
                    {customers.map(customer => (
                      <option key={customer.customer_id} value={customer.customer_id}>
                        {customer.first_name} {customer.last_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Total Price</label>
                  <input
                    type="number"
                    className="form-control"
                    name="total_price"
                    value={order.total_price}
                    onChange={handleChange}
                    step="0.01"
                    required
                    disabled
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Warehouse</label>
                  <select
                    className="form-select"
                    name="warehouse_id"
                    value={order.warehouse_id}
                    onChange={handleChange}
                    required
                    disabled
                  >
                    <option value="">Select Warehouse</option>
                    {warehouses.map(warehouse => (
                      <option key={warehouse.warehouse_id} value={warehouse.warehouse_id}>
                        {warehouse.warehouse_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Order Status</label>
                  <select
                    className="form-select"
                    name="status_id"
                    value={order.status_id}
                    onChange={handleChange}
                    required
                    disabled={
                      orderStatuses.find(
                        status =>
                          status.status_id === order.status_id &&
                          status.status_name.toLowerCase() === "completed"
                      )
                        ? true
                        : false
                    }
                  >
                    <option value="">Select Status</option>
                    {orderStatuses.map(status => (
                      <option key={status.status_id} value={status.status_id}>
                        {status.status_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="d-flex gap-2 mt-3">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={
                  orderStatuses.find(
                    status =>
                      status.status_id === order.status_id &&
                      status.status_name.toLowerCase() === "completed"
                  )
                    ? true
                    : false
                }
                style={
                  orderStatuses.find(
                    status =>
                      status.status_id === order.status_id &&
                      status.status_name.toLowerCase() === "completed"
                  )
                    ? { cursor: "not-allowed" }
                    : {cursor: "pointer"}
                }
              >
                Update Order
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/order')}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </MasterLayout>
  );
};

export default EditOrder;