import React, { useEffect, useState } from "react";
import MasterLayout from "../../masterLayout/MasterLayout";
import Breadcrumb from "../../components/Breadcrumb";
import $ from 'jquery';
import 'datatables.net-dt/js/dataTables.dataTables.js';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Warehouse = () => {
  const navigate = useNavigate();
  const [warehouses, setWarehouses] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFinalConfirmation, setShowFinalConfirmation] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);

  // Define the API URL
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
  const getWarehousesUrl = `${API_URL}/warehouses/`;
  const getCityUrl = `${API_URL}/Cities`;

  // Fetch warehouses from the API
  const fetchWarehouses = async () => {
    try {
      const response = await axios.get(getWarehousesUrl);
      if (response.data) {
        setWarehouses(response.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching warehouses:', error);
      setLoading(false);
    }
  };

  // Fetch cities from the API
  const fetchCities = async () => {
    try {
      const response = await axios.get(getCityUrl);
      if (response.data) {
        setCities(response.data);
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  useEffect(() => {
    fetchWarehouses();
    fetchCities();
  }, []);

  useEffect(() => {
    if (!loading) {
      const table = $('#warehousesTable').DataTable({
        pageLength: 10,
        destroy: true
      });
      return () => {
        table.destroy(true);
      };
    }
  }, [loading, warehouses]);

  // Handle delete button click
  const handleDelete = (warehouse) => {
    setSelectedWarehouse(warehouse);
    setShowDeleteModal(true);
  };

  // First step of delete confirmation
  const confirmDelete = () => {
    setShowFinalConfirmation(true);
  };

  // Final step of delete confirmation
  const finalDeleteConfirmation = async () => {
    try {
      await axios.delete(`${API_URL}/warehouses/${selectedWarehouse.warehouse_id}`);
      fetchWarehouses(); // Refresh the warehouses list
      setShowDeleteModal(false);
      setShowFinalConfirmation(false);
      setSelectedWarehouse(null);
    } catch (error) {
      console.error('Error deleting warehouse:', error);
    }
  };

  // Cancel deletion
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setShowFinalConfirmation(false);
    setSelectedWarehouse(null);
  };

  // Function to get city name by city ID
  const getCityNameById = (cityId) => {
    const city = cities.find(city => city.city_id === cityId);
    return city ? city.city_name : 'Unknown City';
  };

  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title='Warehouses' />

        {/* Button to add a new warehouse */}
        <button
          type="button"
          className="btn btn-primary-600 radius-8 px-20 py-11 d-flex align-items-center gap-2"
          onClick={() => navigate('/AddWarehouse')}
        >
          <Icon
            icon="mingcute:square-arrow-left-line"
            className="text-xl"
          />{" "}
          Add Warehouse
        </button>

        {/* Table to display warehouses */}
        <div className="card basic-data-table">
          <div className="card-header">
            <h5 className="card-title mb-0">All Warehouses</h5>
          </div>
          <div className="card-body">
            <table
              className="table bordered-table mb-0"
              id="warehousesTable"
              data-page-length={10}
            >
              <thead>
                <tr>
                  <th scope="col">S.N</th>
                  <th scope="col">Warehouse Name</th>
                  <th scope="col">Location Address</th>
                  <th scope="col">Postal Code</th>
                  <th scope="col">City</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {warehouses.map((warehouse, index) => (
                  <tr key={warehouse.warehouse_id}>
                    <td>{index + 1}</td>
                    <td>
                      <Link to="#" className="text-primary-600">
                        {warehouse.warehouse_name}
                      </Link>
                    </td>
                    <td>{warehouse.location_address}</td>
                    <td>{warehouse.postal_code}</td>
                    <td>{getCityNameById(warehouse.city_id)}</td>
                    <td>
                      {/* View Button */}
                      <Link
                        to={`/ViewWarehouse/${warehouse.warehouse_id}`}
                        className="w-32-px h-32-px me-8 bg-primary-light text-primary-600 rounded-circle d-inline-flex align-items-center justify-content-center"
                      >
                        <Icon icon="iconamoon:eye-light" />
                      </Link>
                      {/* Edit Button */}
                      <Link
                        to={`/EditWarehouse/${warehouse.warehouse_id}`}
                        className="w-32-px h-32-px me-8 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center"
                      >
                        <Icon icon="lucide:edit" />
                      </Link>
                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(warehouse)}
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
                <h5 className="modal-title">Delete Warehouse</h5>
                <button type="button" className="btn-close" onClick={cancelDelete}></button>
              </div>
              <div className="modal-body">
                <div className="table-responsive">
                  <table className="table table-borderless">
                    <tbody>
                      <tr>
                        <th width="150">Warehouse ID:</th>
                        <td>{selectedWarehouse?.warehouse_id}</td>
                      </tr>
                      <tr>
                        <th>Warehouse Name:</th>
                        <td>{selectedWarehouse?.warehouse_name}</td>
                      </tr>
                      <tr>
                        <th>Location Address:</th>
                        <td>{selectedWarehouse?.location_address}</td>
                      </tr>
                      <tr>
                        <th>Postal Code:</th>
                        <td>{selectedWarehouse?.postal_code}</td>
                      </tr>
                      <tr>
                        <th>City:</th>
                        <td>{getCityNameById(selectedWarehouse?.city_id)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                {!showFinalConfirmation ? (
                  <div className="alert alert-warning">
                    <Icon icon="mingcute:warning-fill" className="me-2" />
                    Are you sure you want to delete this warehouse?
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

export default Warehouse;