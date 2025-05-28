import React, { useEffect, useState } from "react";
import MasterLayout from "../../masterLayout/MasterLayout";
import Breadcrumb from "../../components/Breadcrumb";
import $ from 'jquery';
import 'datatables.net-dt/js/dataTables.dataTables.js';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Deals = () => {
  const navigate = useNavigate();
  const [deals, setDeals] = useState([]);
  const [products, setProducts] = useState([]); // State to store products
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFinalConfirmation, setShowFinalConfirmation] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);

  // Define the API URL
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
  const getDealsUrl = `${API_URL}/Deals/`;
  const getProductsUrl = `${API_URL}/Products`; // API endpoint for products

  // Fetch deals from the API
  const fetchDeals = async () => {
    try {
      const response = await axios.get(getDealsUrl);
      if (response.data) {
        setDeals(response.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching deals:', error);
      setLoading(false);
    }
  };

  // Fetch products from the API
  const fetchProducts = async () => {
    try {
      const response = await axios.get(getProductsUrl);
      if (response.data) {
        setProducts(response.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchDeals();
    fetchProducts(); // Fetch products when the component mounts
  }, []);

  useEffect(() => {
    if (!loading) {
      const table = $('#dealsTable').DataTable({
        pageLength: 10,
        destroy: true
      });
      return () => {
        table.destroy(true);
      };
    }
  }, [loading, deals]);

  // Handle delete button click
  const handleDelete = (deal) => {
    setSelectedDeal(deal);
    setShowDeleteModal(true);
  };

  // First step of delete confirmation
  const confirmDelete = () => {
    setShowFinalConfirmation(true);
  };

  // Final step of delete confirmation
  const finalDeleteConfirmation = async () => {
    try {
      await axios.delete(`${API_URL}/Deals/${selectedDeal.deal_id}`);
      fetchDeals(); // Refresh the deals list
      setShowDeleteModal(false);
      setShowFinalConfirmation(false);
      setSelectedDeal(null);
    } catch (error) {
      console.error('Error deleting deal:', error);
    }
  };

  // Cancel deletion
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setShowFinalConfirmation(false);
    setSelectedDeal(null);
  };

  // Function to get product name by product ID
  const getProductNameById = (productId) => {
    const product = products.find(product => product.product_id === productId);
    return product ? product.product_name : 'Unknown Product';
  };

  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title='Deals' />

        {/* Button to add a new deal */}
        <button
          type="button"
          className="btn btn-primary-600 radius-8 px-20 py-11 d-flex align-items-center gap-2"
          onClick={() => navigate('/AddDeal')}
        >
          <Icon
            icon="mingcute:square-arrow-left-line"
            className="text-xl"
          />{" "}
          Add Deal
        </button>

        {/* Table to display deals */}
        <div className="card basic-data-table">
          <div className="card-header">
            <h5 className="card-title mb-0">All Deals</h5>
          </div>
          <div className="card-body">
            <table
              className="table bordered-table mb-0"
              id="dealsTable"
              data-page-length={10}
            >
              <thead>
                <tr>
                  <th scope="col">S.N</th>
                  <th scope="col">Deal Name</th>
                  <th scope="col">Description</th>
                  <th scope="col">Start Date</th>
                  <th scope="col">End Date</th>
                  <th scope="col">Discount (%)</th>
                  <th scope="col">Product</th> {/* Changed from Product ID to Product */}
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {deals.map((deal, index) => (
                  <tr key={deal.deal_id}>
                    <td>{index + 1}</td>
                    <td>
                      <Link to="#" className="text-primary-600">
                        {deal.deal_name}
                      </Link>
                    </td>
                    <td>{deal.description}</td>
                    <td>{new Date(deal.start_date).toLocaleDateString()}</td>
                    <td>{new Date(deal.end_date).toLocaleDateString()}</td>
                    <td>{deal.discount_percentage}%</td>
                    <td>{getProductNameById(deal.product_id)}</td> {/* Display product name */}
                    <td>
                      {/* View Button */}
                      <Link
                        to={`/ViewDeal/${deal.deal_id}`}
                        className="w-32-px h-32-px me-8 bg-primary-light text-primary-600 rounded-circle d-inline-flex align-items-center justify-content-center"
                      >
                        <Icon icon="iconamoon:eye-light" />
                      </Link>
                      {/* Edit Button */}
                      <Link
                        to={`/EditDeal/${deal.deal_id}`}
                        className="w-32-px h-32-px me-8 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center"
                      >
                        <Icon icon="lucide:edit" />
                      </Link>
                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(deal)}
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
                <h5 className="modal-title">Delete Deal</h5>
                <button type="button" className="btn-close" onClick={cancelDelete}></button>
              </div>
              <div className="modal-body">
                <div className="table-responsive">
                  <table className="table table-borderless">
                    <tbody>
                      <tr>
                        <th width="150">Deal ID:</th>
                        <td>{selectedDeal?.deal_id}</td>
                      </tr>
                      <tr>
                        <th>Deal Name:</th>
                        <td>{selectedDeal?.deal_name}</td>
                      </tr>
                      <tr>
                        <th>Description:</th>
                        <td>{selectedDeal?.description}</td>
                      </tr>
                      <tr>
                        <th>Start Date:</th>
                        <td>{new Date(selectedDeal?.start_date).toLocaleDateString()}</td>
                      </tr>
                      <tr>
                        <th>End Date:</th>
                        <td>{new Date(selectedDeal?.end_date).toLocaleDateString()}</td>
                      </tr>
                      <tr>
                        <th>Discount (%):</th>
                        <td>{selectedDeal?.discount_percentage}%</td>
                      </tr>
                      <tr>
                        <th>Product:</th>
                        <td>{getProductNameById(selectedDeal?.product_id)}</td> {/* Display product name */}
                      </tr>
                    </tbody>
                  </table>
                </div>
                {!showFinalConfirmation ? (
                  <div className="alert alert-warning">
                    <Icon icon="mingcute:warning-fill" className="me-2" />
                    Are you sure you want to delete this deal?
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

export default Deals;