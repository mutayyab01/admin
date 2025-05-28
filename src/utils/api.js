import { useAuth } from '../context/AuthContext';

export const useApi = () => {
    const { getAxiosInstance } = useAuth();
    const api = getAxiosInstance();

    return {
        // User Admin endpoints
        login: (credentials) => api.post('/userAdmins/login', credentials),
        getUsers: () => api.get('/userAdmins'),
        createUser: (userData) => api.post('/userAdmins', userData),
        updateUser: (id, userData) => api.put(`/userAdmins/${id}`, userData),
        deleteUser: (id) => api.delete(`/userAdmins/${id}`),

        // Products endpoints
        getProducts: () => api.get('/products'),
        createProduct: (productData) => api.post('/products', productData),
        updateProduct: (id, productData) => api.put(`/products/${id}`, productData),
        deleteProduct: (id) => api.delete(`/products/${id}`),

        // Categories endpoints
        getCategories: () => api.get('/categories'),
        createCategory: (categoryData) => api.post('/categories', categoryData),
        updateCategory: (id, categoryData) => api.put(`/categories/${id}`, categoryData),
        deleteCategory: (id) => api.delete(`/categories/${id}`),

        // Deals endpoints
        getDeals: () => api.get('/deals'),
        createDeal: (dealData) => api.post('/deals', dealData),
        updateDeal: (id, dealData) => api.put(`/deals/${id}`, dealData),
        deleteDeal: (id) => api.delete(`/deals/${id}`),

        // Cities endpoints
        getCities: () => api.get('/cities'),
        createCity: (cityData) => api.post('/cities', cityData),
        updateCity: (id, cityData) => api.put(`/cities/${id}`, cityData),
        deleteCity: (id) => api.delete(`/cities/${id}`),

        // Order Status endpoints
        getOrderStatuses: () => api.get('/orderStatuses'),
        createOrderStatus: (statusData) => api.post('/orderStatuses', statusData),
        updateOrderStatus: (id, statusData) => api.put(`/orderStatuses/${id}`, statusData),
        deleteOrderStatus: (id) => api.delete(`/orderStatuses/${id}`),

        // Warehouse endpoints
        getWarehouses: () => api.get('/warehouses'),
        createWarehouse: (warehouseData) => api.post('/warehouses', warehouseData),
        updateWarehouse: (id, warehouseData) => api.put(`/warehouses/${id}`, warehouseData),
        deleteWarehouse: (id) => api.delete(`/warehouses/${id}`),

        // Time endpoints
        getTime: () => api.get('/time'),
        updateTime: (timeData) => api.put('/time', timeData)
    };
}; 