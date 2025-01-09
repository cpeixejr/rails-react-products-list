import React, { useState, useEffect } from "react";
import axios from "axios";
import Product from "../components/Product";
import "./ProductsPage.css";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    sort: "",
    min_price: "",
    max_price: "",
    min_expiration: "",
    max_expiration: ""
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/api/v1/products", {
        params: filters
      });
      setProducts(response.data);
    } catch (error) {
      console.error("An error happened while trying to fetch the products:", error);
      alert("An error happened while trying to fetch the products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const renderContent = () => {
    if (loading) {
      return <p className="loading-message">Loading...</p>;
    }

    if (!products.length) {
      return (
        <div className="empty-message">
          <p>No products found.</p>
          {(filters.search || filters.min_price || filters.max_price || filters.min_expiration || filters.max_expiration) &&
            <p>Try to change the filters and try again.</p>
          }
        </div>
      );
    }

    return (
      <div className="products-grid">
        {products.map((product) => (
          <Product key={product.id} product={product} />
        ))}
      </div>
    );
  };

  return (
    <div className="products-page">
      <h1>Products</h1>
      <div className="filters">
        <div className="filter-group">
          <label>
            Search by name:
          </label>
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Enter the search text..."
          />
        </div>

        <div className="filter-group price-range">
          <label>Price range (USD):</label>
          <div className="range-inputs">
            <input
              type="number"
              name="min_price"
              value={filters.min_price}
              onChange={handleFilterChange}
              placeholder="Min"
              min="0"
              step="0.01"
            />
            <span>to</span>
            <input
              type="number"
              name="max_price"
              value={filters.max_price}
              onChange={handleFilterChange}
              placeholder="Max"
              min="0"
              step="0.01"
            />
          </div>
        </div>

        <div className="filter-group date-range">
          <label>Expiration date range:</label>
          <div className="range-inputs">
            <input
              type="date"
              name="min_expiration"
              value={filters.min_expiration}
              onChange={handleFilterChange}
            />
            <span>to</span>
            <input
              type="date"
              name="max_expiration"
              value={filters.max_expiration}
              onChange={handleFilterChange}
            />
          </div>
        </div>

        <div className="filter-group">
          <label>
            Order by:
            <select name="sort" value={filters.sort} onChange={handleFilterChange}>
              <option value="">Select...</option>
              <option value="name">Name (ASC)</option>
              <option value="-name">Name (DESC)</option>
              <option value="price">Price (ASC)</option>
              <option value="-price">Price (DESC)</option>
              <option value="expiration_date">Expiration Date (ASC)</option>
              <option value="-expiration_date">Expiration Date (DESC)</option>
            </select>
          </label>
        </div>
      </div>
      {renderContent()}
    </div>
  );
};

export default ProductsPage;
