import React, { useEffect, useState } from "react";
import MasterLayout from "../../masterLayout/MasterLayout";
import Breadcrumb from "../../components/Breadcrumb";
import $ from 'jquery';
import 'datatables.net-dt/js/dataTables.dataTables.js';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Categories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFinalConfirmation, setShowFinalConfirmation] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Define the API URL
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
  const getCategoriesUrl = `${API_URL}/productCategories/`;

  // Fetch categories from the API
  const fetchCategories = async () => {
    try {
      const response = await axios.get(getCategoriesUrl);
      if (response.data) {
        setCategories(response.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!loading) {
      const table = $('#categoriesTable').DataTable({
        pageLength: 10,
        destroy: true
      });
      return () => {
        table.destroy(true);
      };
    }
  }, [loading, categories]);

  // Handle delete button click
  const handleDelete = (category) => {
    setSelectedCategory(category);
    setShowDeleteModal(true);
  };

  // First step of delete confirmation
  const confirmDelete = () => {
    setShowFinalConfirmation(true);
  };

  // Final step of delete confirmation
  const finalDeleteConfirmation = async () => {
    try {
      await axios.delete(`${API_URL}/productCategories/${selectedCategory.category_id}`);
      fetchCategories(); // Refresh the categories list
      setShowDeleteModal(false);
      setShowFinalConfirmation(false);
      setSelectedCategory(null);
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  // Cancel deletion
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setShowFinalConfirmation(false);
    setSelectedCategory(null);
  };

  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title='Product Categories' />

        {/* Button to add a new category */}
        <button
          type="button"
          className="btn btn-primary-600 radius-8 px-20 py-11 d-flex align-items-center gap-2"
          onClick={() => navigate('/AddCategory')}
        >
          <Icon
            icon="mingcute:square-arrow-left-line"
            className="text-xl"
          />{" "}
          Add Category
        </button>

        {/* Table to display categories */}
        <div className="card basic-data-table">
          <div className="card-header">
            <h5 className="card-title mb-0">All Product Categories</h5>
          </div>
          <div className="card-body">
            <table
              className="table bordered-table mb-0"
              id="categoriesTable"
              data-page-length={10}
            >
              <thead>
                <tr>
                  <th scope="col">S.N</th>
                  <th scope="col">Category Name</th>
                  <th scope="col">Image</th>
                  <th scope="col">Description</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category, index) => (
                  <tr key={category.category_id}>
                    <td>{index + 1}</td>
                    <td>
                      <Link to="#" className="text-primary-600">
                        {category.category_name}
                      </Link>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <img
                          src={category.ImageURL || "assets/images/default-category.png"}
                          alt={category.category_name}
                          className="flex-shrink-0 me-12 radius-8"
                          style={{ width: '50px', height: '50px' }}
                        />
                      </div>
                    </td>
                    <td>{category.category_description}</td>
                    <td>
                      {/* View Button */}
                      <Link
                        to={`/ViewCategory/${category.category_id}`}
                        className="w-32-px h-32-px me-8 bg-primary-light text-primary-600 rounded-circle d-inline-flex align-items-center justify-content-center"
                      >
                        <Icon icon="iconamoon:eye-light" />
                      </Link>
                      {/* Edit Button */}
                      <Link
                        to={`/EditCategory/${category.category_id}`}
                        className="w-32-px h-32-px me-8 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center"
                      >
                        <Icon icon="lucide:edit" />
                      </Link>
                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(category)}
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
                <h5 className="modal-title">Delete Category</h5>
                <button type="button" className="btn-close" onClick={cancelDelete}></button>
              </div>
              <div className="modal-body">
                <div className="text-center mb-4">
                  <img
                    src={selectedCategory?.ImageURL || "assets/images/default-category.png"}
                    alt={selectedCategory?.category_name}
                    className="img-fluid radius-8 mb-3"
                    style={{ maxWidth: '200px' }}
                  />
                </div>
                <div className="table-responsive">
                  <table className="table table-borderless">
                    <tbody>
                      <tr>
                        <th width="150">Category ID:</th>
                        <td>{selectedCategory?.category_id}</td>
                      </tr>
                      <tr>
                        <th>Category Name:</th>
                        <td>{selectedCategory?.category_name}</td>
                      </tr>
                      <tr>
                        <th>Description:</th>
                        <td>{selectedCategory?.category_description}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                {!showFinalConfirmation ? (
                  <div className="alert alert-warning">
                    <Icon icon="mingcute:warning-fill" className="me-2" />
                    Are you sure you want to delete this category?
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

export default Categories;