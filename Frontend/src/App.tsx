
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { CartProvider } from "./Context/CartContext";
import Loginpage from './Pages/Loginpage.tsx'
import RegisterPage from './Pages/RegistrationPage.tsx'
import Homepage from './Pages/Homepage.tsx'
import AboutPage from './Pages/AboutPage.tsx'
import MenuPage from './Pages/MenuPage.tsx'
import FoodDetailPage from './components/FoodDetail.tsx'
import CartPage from "./Pages/CartPage";
import ContactPage from './components/Contact.tsx';
import CheckoutPage from './components/Checkout.tsx';
import UserProfile from './components/UserProfile.tsx';
import AdminLogin from './Pages/AdminLogin.tsx';
import AdminDashboard from './Pages/AdminDashboard.tsx';
import ProtectedAdminRoute from './Pages/ProtectedAdminRoute.tsx';

function App() {


  return (
    <>
      <Router>
        <CartProvider>
          <Routes>
            <Route path='/' element={<Homepage />} />
            <Route path='/login' element={<Loginpage />} />
            <Route path='/register' element={<RegisterPage />} />
            <Route path='/home' element={<Homepage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path='/about' element={<AboutPage />} />
            <Route path='/menu' element={<MenuPage />} />
            <Route path="/product/:productId" element={<FoodDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path='/contact' element={<ContactPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/userprofile" element={<UserProfile />} />
            <Route path='/adminlogin' element={<AdminLogin />} />
            <Route
              path='/admin/dashboard'
              element={
                <ProtectedAdminRoute>
                  <AdminDashboard />
                </ProtectedAdminRoute>
              } />
          </Routes>
        </CartProvider>
      </Router>
    </>
  )
}

export default App
