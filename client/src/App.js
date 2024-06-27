import About from "./pages/About";
import Contact from "./pages/Contact";
import Homepage from "./pages/Homepage";
import Pagenotfound from "./pages/Pagenotfound";
import Policy from "./pages/Policy";
import {Routes,Route} from 'react-router-dom'
import Register from "./pages/auth/Register";

import 'react-toastify/dist/ReactToastify.css'
import Login from "./pages/auth/Login";

import  Privateroute from "./components/routes/Privateroute";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Adminroute from "./components/routes/Adminroute"
import AdminDasboard from "./pages/admin/AdminDasboard";



import CreateProduct from "./pages/admin/CreateProduct";
import CreateCatogory from "./pages/admin/CreateCatogory";
import Dashboard from "./pages/auth/user/Dashboard";
import Order from "./pages/auth/user/Order";
import Profile from "./pages/auth/user/Profile";
import User from "./pages/admin/User";
import Products from "./pages/admin/Products";
import UpdateProduct from "./pages/admin/UpdateProduct";
import Search from "./pages/Search";
import ProductDetails from "./pages/ProductDetails";
import Categories from "./pages/Categories";
import CategoryProduct from "./pages/CategoryProduct";
import Cart from "./pages/Cart";
import AdminOrder from "./pages/admin/AdminOrder";



function App() {
  return (
    <>
    <Routes>
        <Route path='/' element={<Homepage/>}/>
        <Route path='/search' element={<Search/>}/>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/categories' element={<Categories/>}/>
        <Route path='/category/:slug' element={<CategoryProduct/>}/>
        <Route path='/search' element={<Search/>}/>
        <Route path="/products/:slug" element ={<ProductDetails/>}/>
        <Route path="/dashboard"element={< Privateroute/>}>
             <Route path='user' element={<Dashboard/>}/>
             <Route path="user/orders" element ={<Order/>}/>
             <Route path="user/profile" element ={<Profile/>}/>
            
             
        </Route>
        <Route path="/dashboard" element={<Adminroute/>}>
           <Route path='admin' element={<AdminDasboard/>}/>
           <Route path='admin/orders' element={<AdminOrder/>}/>
           <Route path="admin/create-category" element={<CreateCatogory />} />
           <Route path="admin/create-product" element={<CreateProduct />} />
           <Route path="admin/product/:slug" element={<UpdateProduct />} />
           <Route path="admin/products" element={<Products />} />
           <Route path="admin/users" element={<User/>} />
        </Route>
        <Route path='/register' element={<Register/>}/>
        <Route path='/forgot-password' element={<ForgotPassword/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/contact' element={<Contact/>}/>
        <Route path='/policy' element={<Policy/>}/>
        <Route path='*' element={<Pagenotfound/>}/>
    </Routes>
    </>
  );
}

export default App;
