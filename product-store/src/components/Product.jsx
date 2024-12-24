import React from 'react';
import './Product.css';

const Product = ({ product }) => {
  const formatCurrency = (value, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en');
  };

  return (
    <div className="product-card">
      <h3 className="product-name">{product.name}</h3>

      <div className="product-prices">
        <div className="price-group">
          <span className="price-label">USD:</span>
          <span className="price-value">{formatCurrency(product.price_usd, 'USD')}</span>
        </div>

        <div className="price-group">
          <span className="price-label">BRL:</span>
          <span className="price-value">{formatCurrency(product.price_brl, 'BRL')}</span>
        </div>

        <div className="price-group">
          <span className="price-label">EUR:</span>
          <span className="price-value">{formatCurrency(product.price_eur, 'EUR')}</span>
        </div>

        <div className="price-group">
          <span className="price-label">GBP:</span>
          <span className="price-value">{formatCurrency(product.price_gbp, 'GBP')}</span>
        </div>

        <div className="price-group">
          <span className="price-label">JPY:</span>
          <span className="price-value">{formatCurrency(product.price_jpy, 'JPY')}</span>
        </div>
      </div>

      <div className="product-expiration">
        <span className="expiration-label">Expiration Date:</span>
        <span className="expiration-value">{formatDate(product.expiration_date)}</span>
      </div>
    </div>
  );
};

export default Product;