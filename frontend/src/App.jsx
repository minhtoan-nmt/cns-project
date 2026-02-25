import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Homepage from './component/homepage/Homepage'
import ProductPage from './component/product_page/ProductPage'
import ProductDetail from './component/product_page/ProductDetail'
import CollectionPage from './component/collectionpage/CollectionPage'
import AboutUsPage from './component/about_us/AboutUsPage'
import SupportPage from './component/support_page/SupportPage'
import LoginPage from './component/login/LoginPage'
import SuccessPage from './component/login/successpage/SuccessPage'
import CartPage from './component/cart/CartPage'
import ARTryOnPage from './component/ai-ar/try-on-page/ARTryOnPage'
import AIAR from './component/ai-ar/AIAR'
import RegisterPage from './component/register/RegisterPage'
import CheckoutPage from './component/cart/checkout/CheckoutPage'
import ChativeChat from './component/chat/ChativeChat'

function App() {
  return (
    <BrowserRouter>
      <ChativeChat />
      <Routes>
        <Route path='/' element={<Homepage />}/>
        <Route path='/product' element={<ProductPage />} />
        <Route path='/product-detail/:id' element={<ProductDetail />} />
        <Route path='/collection' element={<CollectionPage />} />
        <Route path='/about-us' element={<AboutUsPage />} />
        <Route path='/support' element={<SupportPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/profile' element={<SuccessPage />} />
        <Route path='/cart' element={<CartPage />} />
        <Route path='/checkout' element={<CheckoutPage />} />
        {/* <Route path='/ar-ai' element={<AIAR />} />
        <Route path='/ar-ai/try-on' element={<ARTryOnPage />} /> */}
      </Routes>
    </BrowserRouter>
  )
}

export default App
