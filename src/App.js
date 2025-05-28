import { BrowserRouter, Route, Routes } from "react-router-dom";
import AddUserPage from "./pages/AddUserPage";
import AlertPage from "./pages/AlertPage";
import BadgesPage from "./pages/BadgesPage";
import ErrorPage from "./pages/ErrorPage";
import ForgotPasswordPage from "./pages/ForgetPasswrod/ForgotPasswordPage";
import FormLayoutPage from "./pages/FormLayoutPage";
import FormValidationPage from "./pages/FormValidationPage";
import FormPage from "./pages/FormPage";
import PaginationPage from "./pages/PaginationPage";
import PaymentGatewayPage from "./pages/PaymentGatewayPage";
import PricingPage from "./pages/PricingPage";
import ProgressPage from "./pages/ProgressPage";
import SignInPage from "./pages/SignIn/SignInPage";
import SignUpPage from "./pages/SignUp/SignUpPage";
import TableDataPage from "./pages/TableDataPage";
import ThemePage from "./pages/ThemePage";
import TooltipPage from "./pages/TooltipPage";
import TypographyPage from "./pages/TypographyPage";
import UsersGridPage from "./pages/UsersGridPage";
import UsersListPage from "./pages/UsersListPage";
import ViewDetailsPage from "./pages/ViewDetailsPage";
import ViewProfilePage from "./pages/ViewProfilePage";
import RouteScrollToTop from "./helper/RouteScrollToTop";
import HomePageTen from "./pages/HomePageTen";
import AccessDeniedPage from "./pages/AccessDeniedPage";
import BlankPagePage from "./pages/BlankPagePage";
import Products from "./pages/Products/Products";
import AddProduct from "./pages/Products/AddProduct";
import ViewProduct from "./pages/Products/ViewProduct";
import EditProduct from "./pages/Products/EditProduct";
import Categories from "./pages/Categories/Categories";
import AddCategory from "./pages/Categories/AddCategory";
import ViewCategory from "./pages/Categories/ViewCategory";
import EditCategory from "./pages/Categories/EditCategory";
import Deals from "./pages/Deals/Deals";
import AddDeal from "./pages/Deals/AddDeal";
import ViewDeal from "./pages/Deals/ViewDeal";
import EditDeal from "./pages/Deals/EditDeal";
import Cities from "./pages/Cities/Cities";
import AddCity from "./pages/Cities/AddCity";
import ViewCity from "./pages/Cities/ViewCity";
import EditCity from "./pages/Cities/EditCity";
import OrderStatus from "./pages/OrderStatus/OrderStatus";
import AddOrderStatus from "./pages/OrderStatus/AddOrderStatus";
import ViewOrderStatus from "./pages/OrderStatus/ViewOrderStatus";
import EditOrderStatus from "./pages/OrderStatus/EditOrderStatus";
import Warehouse from "./pages/Warehouse/Warehouse";
import AddWarehouse from "./pages/Warehouse/AddWarehouse";
import ViewWarehouse from "./pages/Warehouse/ViewWarehouse";
import EditWarehouse from "./pages/Warehouse/EditWarehouse";
import Time from "./pages/Time/Time";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Order from "./pages/Order/Order";
import EditOrder from "./pages/Order/EditOrder";
import Sales from "./pages/Sale/Sales";
import ViewSale from "./pages/Sale/ViewSale";
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <RouteScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route exact path='/' element={<SignInPage />} />
          <Route exact path='/forgot-password' element={<ForgotPasswordPage />} />
          <Route exact path='/sign-in' element={<SignInPage />} />
          <Route exact path='/sign-up' element={<SignUpPage />} />

          {/* Protected Routes */}
          <Route exact path='/dashboard' element={
            <ProtectedRoute>
              <HomePageTen />
            </ProtectedRoute>
          } />

          {/* Products Routes */}
          <Route exact path='/Products' element={
            <ProtectedRoute allowedRoles={['merchant', 'admin']}>
              <Products />
            </ProtectedRoute>
          } />
          <Route exact path='/AddProduct' element={
            <ProtectedRoute allowedRoles={['merchant', 'admin']}>
              <AddProduct />
            </ProtectedRoute>
          } />
          <Route exact path='/ViewProduct/:id' element={
            <ProtectedRoute allowedRoles={['merchant', 'admin']}>
              <ViewProduct />
            </ProtectedRoute>
          } />
          <Route exact path='/EditProduct/:id' element={
            <ProtectedRoute allowedRoles={['merchant', 'admin']}>
              <EditProduct />
            </ProtectedRoute>
          } />

          {/* Categories Routes */}
          <Route exact path='/Categories' element={
            <ProtectedRoute allowedRoles={['merchant']}>
              <Categories />
            </ProtectedRoute>
          } />
          <Route exact path='/AddCategory' element={
            <ProtectedRoute allowedRoles={['merchant']}>
              <AddCategory />
            </ProtectedRoute>
          } />
          <Route exact path='/EditCategory/:id' element={
            <ProtectedRoute allowedRoles={['merchant']}>
              <EditCategory />
            </ProtectedRoute>
          } />
          <Route exact path='/ViewCategory/:id' element={
            <ProtectedRoute allowedRoles={['merchant']}>
              <ViewCategory />
            </ProtectedRoute>
          } />

          {/* Deals Routes */}
          <Route exact path='/Deals' element={
            <ProtectedRoute allowedRoles={['merchant']}>
              <Deals />
            </ProtectedRoute>
          } />
          <Route exact path='/AddDeal' element={
            <ProtectedRoute allowedRoles={['merchant']}>
              <AddDeal />
            </ProtectedRoute>
          } />
          <Route exact path='/EditDeal/:id' element={
            <ProtectedRoute allowedRoles={['merchant']}>
              <EditDeal />
            </ProtectedRoute>
          } />
          <Route exact path='/ViewDeal/:id' element={
            <ProtectedRoute allowedRoles={['merchant']}>
              <ViewDeal />
            </ProtectedRoute>
          } />

          {/* Order Routes */}
          <Route exact path='/Order' element={
            <ProtectedRoute allowedRoles={['merchant']}>
              <Order />
            </ProtectedRoute>
          } />
          <Route exact path='/EditOrder/:id' element={
            <ProtectedRoute allowedRoles={['merchant']}>
              <EditOrder />
            </ProtectedRoute>
          } />

          {/* Time Route */}
          <Route exact path='/Time' element={
            <ProtectedRoute allowedRoles={['merchant']}>
              <Time />
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          {/* Order Status Routes */}
          <Route exact path='/OrderStatus' element={
            <ProtectedRoute allowedRoles={['admin']}>
              <OrderStatus />
            </ProtectedRoute>
          } />
          <Route exact path='/AddOrderStatus' element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AddOrderStatus />
            </ProtectedRoute>
          } />
          <Route exact path='/EditOrderStatus/:id' element={
            <ProtectedRoute allowedRoles={['admin']}>
              <EditOrderStatus />
            </ProtectedRoute>
          } />
          <Route exact path='/ViewOrderStatus/:id' element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ViewOrderStatus />
            </ProtectedRoute>
          } />

          {/* Sale Routes */}
          <Route exact path='/Sales' element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Sales />
            </ProtectedRoute>
          } />

          <Route exact path='/ViewSale/:id' element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ViewSale />
            </ProtectedRoute>
          } />

          {/* Cities Routes */}
          <Route exact path='/Cities' element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Cities />
            </ProtectedRoute>
          } />
          <Route exact path='/AddCity' element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AddCity />
            </ProtectedRoute>
          } />
          <Route exact path='/EditCity/:id' element={
            <ProtectedRoute allowedRoles={['admin']}>
              <EditCity />
            </ProtectedRoute>
          } />
          <Route exact path='/ViewCity/:id' element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ViewCity />
            </ProtectedRoute>
          } />

          {/* Warehouse Routes */}
          <Route exact path='/Warehouses' element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Warehouse />
            </ProtectedRoute>
          } />
          <Route exact path='/AddWarehouse' element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AddWarehouse />
            </ProtectedRoute>
          } />
          <Route exact path='/EditWarehouse/:id' element={
            <ProtectedRoute allowedRoles={['admin']}>
              <EditWarehouse />
            </ProtectedRoute>
          } />
          <Route exact path='/ViewWarehouse/:id' element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ViewWarehouse />
            </ProtectedRoute>
          } />

          <Route exact path='/add-user' element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AddUserPage />
            </ProtectedRoute>
          } />
          <Route exact path='/alert' element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AlertPage />
            </ProtectedRoute>
          } />
          <Route exact path='/badges' element={
            <ProtectedRoute allowedRoles={['admin']}>
              <BadgesPage />
            </ProtectedRoute>
          } />
          <Route exact path='/form-layout' element={
            <ProtectedRoute allowedRoles={['admin']}>
              <FormLayoutPage />
            </ProtectedRoute>
          } />
          <Route exact path='/form-validation' element={
            <ProtectedRoute allowedRoles={['admin']}>
              <FormValidationPage />
            </ProtectedRoute>
          } />
          <Route exact path='/form' element={
            <ProtectedRoute allowedRoles={['admin']}>
              <FormPage />
            </ProtectedRoute>
          } />
          <Route exact path='/access-denied' element={
            <ProtectedRoute>
              <AccessDeniedPage />
            </ProtectedRoute>
          } />
          <Route exact path='/blank-page' element={
            <ProtectedRoute allowedRoles={['admin']}>
              <BlankPagePage />
            </ProtectedRoute>
          } />
          <Route exact path='/pagination' element={
            <ProtectedRoute allowedRoles={['admin']}>
              <PaginationPage />
            </ProtectedRoute>
          } />
          <Route exact path='/payment-gateway' element={
            <ProtectedRoute allowedRoles={['admin']}>
              <PaymentGatewayPage />
            </ProtectedRoute>
          } />
          <Route exact path='/pricing' element={
            <ProtectedRoute allowedRoles={['admin']}>
              <PricingPage />
            </ProtectedRoute>
          } />
          <Route exact path='/progress' element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ProgressPage />
            </ProtectedRoute>
          } />
          <Route exact path='/table-data' element={
            <ProtectedRoute allowedRoles={['admin']}>
              <TableDataPage />
            </ProtectedRoute>
          } />
          <Route exact path='/theme' element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ThemePage />
            </ProtectedRoute>
          } />
          <Route exact path='/tooltip' element={
            <ProtectedRoute allowedRoles={['admin']}>
              <TooltipPage />
            </ProtectedRoute>
          } />
          <Route exact path='/typography' element={
            <ProtectedRoute allowedRoles={['admin']}>
              <TypographyPage />
            </ProtectedRoute>
          } />
          <Route exact path='/users-grid' element={
            <ProtectedRoute allowedRoles={['admin']}>
              <UsersGridPage />
            </ProtectedRoute>
          } />
          <Route exact path='/users-list' element={
            <ProtectedRoute allowedRoles={['admin']}>
              <UsersListPage />
            </ProtectedRoute>
          } />
          <Route exact path='/view-details' element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ViewDetailsPage />
            </ProtectedRoute>
          } />
          <Route exact path='/view-profile' element={
            <ProtectedRoute allowedRoles={[]}>
              <ViewProfilePage />
            </ProtectedRoute>
          } />

          {/* Error Route */}
          <Route exact path='*' element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
