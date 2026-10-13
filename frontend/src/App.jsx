import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import { ContentProvider } from './content'
import { RestaurantProvider } from './context'
import { LanguageProvider } from './i18n'
import About from './pages/About'
import Admin from './pages/Admin'
import Home from './pages/Home'
import MenuPage from './pages/MenuPage'
import Reserve from './pages/Reserve'

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <ContentProvider>
          <RestaurantProvider>
            <Routes>
              <Route path="admin" element={<Admin />} />
              <Route element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="menu" element={<MenuPage />} />
                <Route path="reserve" element={<Reserve />} />
                <Route path="about" element={<About />} />
              </Route>
            </Routes>
          </RestaurantProvider>
        </ContentProvider>
      </LanguageProvider>
    </BrowserRouter>
  )
}
