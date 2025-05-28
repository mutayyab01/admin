import React, { useEffect, useState } from "react";
import MasterLayout from "../../masterLayout/MasterLayout";
import Breadcrumb from "../../components/Breadcrumb";
import $ from 'jquery';
import 'datatables.net-dt/js/dataTables.dataTables.js';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { deleteImageFromCloudinary } from "../../hook/cloudnary-helper";

const Products = () => {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFinalConfirmation, setShowFinalConfirmation] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState({});
  const [merchants, setMerchants] = useState({});
  const [warehouses, setWarehouses] = useState({});
  const [loading, setLoading] = useState(true);

  // Define the API URL
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
  const getAllProducts = `${API_URL}/products/`;
  const getAllProductByMerchantId = `${API_URL}/products/getProductByMerchantId/`;
  const getCategoryUrl = `${API_URL}/productCategories/`;
  const getMerchantUrl = `${API_URL}/merchants/`;
  const getWarehouseUrl = `${API_URL}/warehouses/`;

  const fetchCategoryName = async (categoryId) => {
    try {
      const response = await axios.get(`${getCategoryUrl}${categoryId}`);
      if (response.data) {
        setCategories(prev => ({
          ...prev,
          [categoryId]: response.data.name || response.data.category_name
        }));
      }
    } catch (error) {
      console.error(`Error fetching category ${categoryId}:`, error);
    }
  };

  const fetchMerchantName = async (merchantId) => {
    try {
      const response = await axios.get(`${getMerchantUrl}${merchantId}`);
      if (response.data) {
        setMerchants(prev => ({
          ...prev,
          [merchantId]: response.data.name || response.data.merchant_name
        }));
      }
    } catch (error) {
      console.error(`Error fetching merchant ${merchantId}:`, error);
    }
  };

  const fetchWarehouseName = async (warehouseId) => {
    try {
      const response = await axios.get(`${getWarehouseUrl}${warehouseId}`);
      if (response.data) {
        setWarehouses(prev => ({
          ...prev,
          [warehouseId]: response.data.name || response.data.warehouse_name
        }));
      }
    } catch (error) {
      console.error(`Error fetching warehouse ${warehouseId}:`, error);
    }
  };

  const fetchProducts = async () => {
    try {
      let response
      const adminUser = JSON.parse(localStorage.getItem('adminUser'))
      console.log(adminUser.MerchantID)
      if (adminUser.Role == 'merchant') {
        response = await axios.get(`${getAllProductByMerchantId}${adminUser.MerchantID}`);
      } else {
        response = await axios.get(getAllProducts);
      }
      if (response.data) {
        setProducts(response.data);

        // Fetch categories for each unique category ID
        const uniqueCategoryIds = [...new Set(response.data.map(product => product.category_id))];
        uniqueCategoryIds.forEach(categoryId => {
          if (categoryId && !categories[categoryId]) {
            fetchCategoryName(categoryId);
          }
        });

        // Fetch merchants for each unique merchant ID
        const uniqueMerchantIds = [...new Set(response.data.map(product => product.merchant_id))];
        uniqueMerchantIds.forEach(merchantId => {
          if (merchantId && !merchants[merchantId]) {
            fetchMerchantName(merchantId);
          }
        });

        // Fetch warehouses for each unique warehouse ID
        const uniqueWarehouseIds = [...new Set(response.data.map(product => product.warehouse_id))];
        uniqueWarehouseIds.forEach(warehouseId => {
          if (warehouseId && !warehouses[warehouseId]) {
            fetchWarehouseName(warehouseId);
          }
        });
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (!loading) {
      const table = $('#dataTable').DataTable({
        pageLength: 10,
        destroy: true
      });
      return () => {
        table.destroy(true);
      };
    }
  }, [loading, products]);

  const handleDelete = (product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setShowFinalConfirmation(true);
  };

  const finalDeleteConfirmation = async () => {
    try {
      console.log(selectedProduct.product_id)
      await axios.delete(`${process.env.REACT_APP_API_URL}/products/${selectedProduct.product_id}`);
      await deleteImageFromCloudinary(selectedProduct.ImageURL);
      fetchProducts(); // Refresh the products list
      setShowDeleteModal(false);
      setShowFinalConfirmation(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setShowFinalConfirmation(false);
    setSelectedProduct(null);
  };

  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title='Products' />
        {/* <button type="button" class="btn btn-primary-600 radius-8 px-20 py-11 d-flex align-items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--mingcute text-xl" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path d="M24 0v24H0V0zM12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"></path><path fill="currentColor" d="M6 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3zM5 6a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1zm8.707 3.879L11.586 12l2.121 2.121a1 1 0 0 1-1.414 1.415l-2.828-2.829a1 1 0 0 1 0-1.414l2.828-2.829a1 1 0 1 1 1.414 1.415"></path></g></svg> Left Icon</button> */}
        <button
          type="button"
          className="btn btn-primary-600 radius-8 px-20 py-11 d-flex align-items-center gap-2"
          onClick={() => navigate('/AddProduct')}
        >
          <Icon
            icon="mingcute:square-arrow-left-line"
            className="text-xl"
          />{" "}
          Add Products
        </button>
        {/* BlankPageLayer */}
        <div className="card basic-data-table">
          <div className="card-header">
            <h5 className="card-title mb-0">All Products </h5>
          </div>
          <div className="card-body">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 text-muted">Loading products...</p>
              </div>
            ) : (
              <table
                className="table bordered-table mb-0"
                id="dataTable"
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
                    <th scope="col">Name</th>
                    <th scope="col">Image</th>
                    <th scope="col">Category</th>
                    <th scope="col">Brand</th>
                    <th scope="col" className='dt-orderable-asc dt-orderable-desc'>Price</th>
                    <th scope="col">Stock</th>
                    <th scope="col">Merchant</th>
                    <th scope="col">Warehouse</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr key={product.product_id}>
                      <td>
                        <div className="form-check style-check d-flex align-items-center">
                          <input className="form-check-input" type="checkbox" />
                          <label className="form-check-label">{index + 1}</label>
                        </div>
                      </td>
                      <td>
                        <Link to="#" className="text-primary-600">
                          {product.product_name}
                        </Link>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <img
                            src={product.ImageURL || "assets/images/user-list/user-list1.png"}
                            alt={product.product_name}
                            width={90}
                            height={70}
                            className="flex-shrink-0 me-12 radius-8"
                          />
                        </div>
                      </td>
                      <td>{categories[product.category_id] || 'Loading...'}</td>
                      <td>{product.brand}</td>
                      <td>{product.price}</td>
                      <td>{product.stock_quantity}</td>
                      <td>{merchants[product.merchant_id] || 'Loading...'}</td>
                      <td>{warehouses[product.warehouse_id] || 'Loading...'}</td>
                      {/* <td>
                        <span className={`bg-${product.status === 'active' ? 'success' : 'warning'}-focus text-${product.status === 'active' ? 'success' : 'warning'}-main px-24 py-4 rounded-pill fw-medium text-sm`}>
                          {product.status || 'Active'}
                        </span>
                      </td> */}
                      <td className="">
                        <Link
                          to={`/ViewProduct/${product.product_id}`}
                          className="w-32-px h-32-px me-8 bg-primary-light text-primary-600 rounded-circle d-inline-flex align-items-center justify-content-center"
                        >
                          <Icon icon="iconamoon:eye-light" />
                        </Link>
                        <Link
                          to={`/EditProduct/${product.product_id}`}
                          className="w-32-px h-32-px me-8 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center"
                        >
                          <Icon icon="lucide:edit" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product)}
                          className="w-32-px h-32-px me-8 -mb-9	 bg-danger-focus text-danger-main rounded-circle d-inline-flex align-items-center justify-content-center border-0"
                        >
                          <Icon icon="mingcute:delete-2-line" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>




















      </MasterLayout>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Delete Product</h5>
                <button type="button" className="btn-close" onClick={cancelDelete}></button>
              </div>
              <div className="modal-body">
                <div className="text-center mb-4">
                  <img
                    src={selectedProduct?.ImageURL}
                    alt={selectedProduct?.product_name}
                    className="img-fluid radius-8 mb-3"
                    style={{ maxWidth: '200px' }}
                  />
                </div>
                <div className="table-responsive">
                  <table className="table table-borderless">
                    <tbody>
                      <tr>
                        <th width="150">Product ID:</th>
                        <td>{selectedProduct?.product_id}</td>
                      </tr>
                      <tr>
                        <th>Product Name:</th>
                        <td>{selectedProduct?.product_name}</td>
                      </tr>
                      <tr>
                        <th>Category:</th>
                        <td>{categories[selectedProduct?.category_id] || 'Loading...'}</td>
                      </tr>
                      <tr>
                        <th>Price:</th>
                        <td>{selectedProduct?.price}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                {!showFinalConfirmation ? (
                  <div className="alert alert-warning">
                    <Icon icon="mingcute:warning-fill" className="me-2" />
                    Are you sure you want to delete this product?
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

export default Products;
