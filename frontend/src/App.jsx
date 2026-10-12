import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import { RestaurantProvider } from './context'
import About from './pages/About'
import Home from './pages/Home'
import MenuPage from './pages/MenuPage'
import Reserve from './pages/Reserve'

export default function App() {
  return (
    <BrowserRouter>
      <RestaurantProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="menu" element={<MenuPage />} />
            <Route path="reserve" element={<Reserve />} />
            <Route path="about" element={<About />} />
          </Route>
        </Routes>
      </RestaurantProvider>
    </BrowserRouter>
  )
}
