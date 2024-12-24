import React from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import UploadPage from "./pages/UploadPage";
import ProductsPage from "./pages/ProductsPage";
import "./App.css";

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <nav className="nav-bar">
          <div className="nav-content">
            <div className="nav-brand">
              Product Store
            </div>
            <div className="nav-links">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''}`
                }
              >
                Upload
              </NavLink>
              <NavLink
                to="/products"
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''}`
                }
              >
                Products
              </NavLink>
            </div>
          </div>
        </nav>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<UploadPage />} />
            <Route path="/products" element={<ProductsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
