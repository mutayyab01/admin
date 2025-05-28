import React, { useEffect, useState } from "react";
import MasterLayout from "../../masterLayout/MasterLayout";
import Breadcrumb from "../../components/Breadcrumb";
import $ from 'jquery';
import 'datatables.net-dt/js/dataTables.dataTables.js';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const OrderStatus = () => {
  const navigate = useNavigate();
  const [orderStatuses, setOrderStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFinalConfirmation, setShowFinalConfirmation] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);

  // Define the API URL
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
  const getOrderStatusesUrl = `${API_URL}/orderStatuses/`;

  // Fetch order statuses from the API
  const fetchOrderStatuses = async () => {
    try {
      const response = await axios.get(getOrderStatusesUrl);
      if (response.data) {
        setOrderStatuses(response.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching order statuses:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderStatuses();
  }, []);

  useEffect(() => {
    if (!loading) {
      const table = $('#orderStatusesTable').DataTable({
        pageLength: 10,
        destroy: true
      });
      return () => {
        table.destroy(true);
      };
    }
  }, [loading, orderStatuses]);

  // Handle delete button click
  const handleDelete = (status) => {
    setSelectedStatus(status);
    setShowDeleteModal(true);
  };

  // First step of delete confirmation
  const confirmDelete = () => {
    setShowFinalConfirmation(true);
  };

  // Final step of delete confirmation
  const finalDeleteConfirmation = async () => {
    try {
      await axios.delete(`${API_URL}/orderStatuses/${selectedStatus.status_id}`);
      fetchOrderStatuses(); // Refresh the order statuses list
      setShowDeleteModal(false);
      setShowFinalConfirmation(false);
      setSelectedStatus(null);
    } catch (error) {
      console.error('Error deleting order status:', error);
    }
  };

  // Cancel deletion
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setShowFinalConfirmation(false);
    setSelectedStatus(null);
  };

  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title='Order Statuses' />

        {/* Button to add a new order status */}
        <button
          type="button"
          className="btn btn-primary-600 radius-8 px-20 py-11 d-flex align-items-center gap-2"
          onClick={() => navigate('/AddOrderStatus')}
        >
          <Icon
            icon="mingcute:square-arrow-left-line"
            className="text-xl"
          />{" "}
          Add Order Status
        </button>

        {/* Table to display order statuses */}
        <div className="card basic-data-table">
          <div className="card-header">
            <h5 className="card-title mb-0">All Order Statuses</h5>
          </div>
          <div className="card-body">
            <table
              className="table bordered-table mb-0"
              id="orderStatusesTable"
              data-page-length={10}
            >
              <thead>
                <tr>
                  <th scope="col">S.N</th>
                  <th scope="col">Status Name</th>
                  <th scope="col">Description</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {orderStatuses.map((status, index) => (
                  <tr key={status.status_id}>
                    <td>{index + 1}</td>
                    <td>
                      <Link to="#" className="text-primary-600">
                        {status.status_name}
                      </Link>
                    </td>
                    <td>{status.status_description}</td>
                    <td>
                      {/* View Button */}
                      <Link
                        to={`/ViewOrderStatus/${status.status_id}`}
                        className="w-32-px h-32-px me-8 bg-primary-light text-primary-600 rounded-circle d-inline-flex align-items-center justify-content-center"
                      >
                        <Icon icon="iconamoon:eye-light" />
                      </Link>
                      {/* Edit Button */}
                      <Link
                        to={`/EditOrderStatus/${status.status_id}`}
                        className="w-32-px h-32-px me-8 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center"
                      >
                        <Icon icon="lucide:edit" />
                      </Link>
                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(status)}
                        className="w-32-px h-32-px me-8 -mb-9 bg-danger-focus text-danger-main rounded-circle d-inline-flex align-items-center justify-content-center border-0"
                      >
                        <Icon icon="mingcute:delete-2-line" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </MasterLayout>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Delete Order Status</h5>
                <button type="button" className="btn-close" onClick={cancelDelete}></button>
              </div>
              <div className="modal-body">
                <div className="table-responsive">
                  <table className="table table-borderless">
                    <tbody>
                      <tr>
                        <th width="150">Status ID:</th>
                        <td>{selectedStatus?.status_id}</td>
                      </tr>
                      <tr>
                        <th>Status Name:</th>
                        <td>{selectedStatus?.status_name}</td>
                      </tr>
                      <tr>
                        <th>Description:</th>
                        <td>{selectedStatus?.status_description}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                {!showFinalConfirmation ? (
                  <div className="alert alert-warning">
                    <Icon icon="mingcute:warning-fill" className="me-2" />
                    Are you sure you want to delete this order status?
                  </div>
                ) : (
                  <div className="alert alert-danger">
                    <Icon icon="mingcute:warning-fill" className="me-2" />
                    Warning: This action cannot be undone. Are you absolutely sure?
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={cancelDelete}>
                  Cancel
                </button>
                {!showFinalConfirmation ? (
                  <button type="button" className="btn btn-danger" onClick={confirmDelete}>
                    Delete
                  </button>
                ) : (
                  <button type="button" className="btn btn-danger" onClick={finalDeleteConfirmation}>
                    Yes, Delete Permanently
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderStatus;