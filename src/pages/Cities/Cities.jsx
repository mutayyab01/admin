import React, { useEffect, useState } from "react";
import MasterLayout from "../../masterLayout/MasterLayout";
import Breadcrumb from "../../components/Breadcrumb";
import $ from 'jquery';
import 'datatables.net-dt/js/dataTables.dataTables.js';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Cities = () => {
  const navigate = useNavigate();
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFinalConfirmation, setShowFinalConfirmation] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);

  // Define the API URL
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
  const getCitiesUrl = `${API_URL}/Cities/`;

  // Fetch cities from the API
  const fetchCities = async () => {
    try {
      const response = await axios.get(getCitiesUrl);
      if (response.data) {
        setCities(response.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cities:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  useEffect(() => {
    if (!loading) {
      const table = $('#citiesTable').DataTable({
        pageLength: 10,
        destroy: true
      });
      return () => {
        table.destroy(true);
      };
    }
  }, [loading, cities]);

  // Handle delete button click
  const handleDelete = (city) => {
    setSelectedCity(city);
    setShowDeleteModal(true);
  };

  // First step of delete confirmation
  const confirmDelete = () => {
    setShowFinalConfirmation(true);
  };

  // Final step of delete confirmation
  const finalDeleteConfirmation = async () => {
    try {
      await axios.delete(`${API_URL}/Cities/${selectedCity.city_id}`);
      fetchCities(); // Refresh the cities list
      setShowDeleteModal(false);
      setShowFinalConfirmation(false);
      setSelectedCity(null);
    } catch (error) {
      console.error('Error deleting city:', error);
    }
  };

  // Cancel deletion
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setShowFinalConfirmation(false);
    setSelectedCity(null);
  };

  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title='Cities' />

        {/* Button to add a new city */}
        <button
          type="button"
          className="btn btn-primary-600 radius-8 px-20 py-11 d-flex align-items-center gap-2"
          onClick={() => navigate('/AddCity')}
        >
          <Icon
            icon="mingcute:square-arrow-left-line"
            className="text-xl"
          />{" "}
          Add City
        </button>

        {/* Table to display cities */}
        <div className="card basic-data-table">
          <div className="card-header">
            <h5 className="card-title mb-0">All Cities</h5>
          </div>
          <div className="card-body">
            <table
              className="table bordered-table mb-0"
              id="citiesTable"
              data-page-length={10}
            >
              <thead>
                <tr>
                  <th scope="col">S.N</th>
                  <th scope="col">City Name</th>
                  <th scope="col">State</th>
                  <th scope="col">Country</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {cities.map((city, index) => (
                  <tr key={city.city_id}>
                    <td>{index + 1}</td>
                    <td>
                      <Link to="#" className="text-primary-600">
                        {city.city_name}
                      </Link>
                    </td>
                    <td>{city.state}</td>
                    <td>{city.country}</td>
                    <td>
                      {/* View Button */}
                      <Link
                        to={`/ViewCity/${city.city_id}`}
                        className="w-32-px h-32-px me-8 bg-primary-light text-primary-600 rounded-circle d-inline-flex align-items-center justify-content-center"
                      >
                        <Icon icon="iconamoon:eye-light" />
                      </Link>
                      {/* Edit Button */}
                      <Link
                        to={`/EditCity/${city.city_id}`}
                        className="w-32-px h-32-px me-8 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center"
                      >
                        <Icon icon="lucide:edit" />
                      </Link>
                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(city)}
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
                <h5 className="modal-title">Delete City</h5>
                <button type="button" className="btn-close" onClick={cancelDelete}></button>
              </div>
              <div className="modal-body">
                <div className="table-responsive">
                  <table className="table table-borderless">
                    <tbody>
                      <tr>
                        <th width="150">City ID:</th>
                        <td>{selectedCity?.city_id}</td>
                      </tr>
                      <tr>
                        <th>City Name:</th>
                        <td>{selectedCity?.city_name}</td>
                      </tr>
                      <tr>
                        <th>State:</th>
                        <td>{selectedCity?.state}</td>
                      </tr>
                      <tr>
                        <th>Country:</th>
                        <td>{selectedCity?.country}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                {!showFinalConfirmation ? (
                  <div className="alert alert-warning">
                    <Icon icon="mingcute:warning-fill" className="me-2" />
                    Are you sure you want to delete this city?
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

export default Cities;