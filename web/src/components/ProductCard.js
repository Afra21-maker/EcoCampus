import React from 'react';

const ProductCard = ({ product, onDelete }) => {
  return (
    <div style={cardStyle}>
      {/* PDF Madde 2.3: Resim varsa göster */}
      {product.image_url && (
        <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px' }} />
      )}
      <h3 style={{ margin: '0 0 10px 0' }}>{product.name}</h3>
      <p style={{ color: '#7f8c8d', fontSize: '14px' }}>{product.description}</p>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
        {/* PDF Madde 2.2: 0 TL ise Bağış yazdır */}
        <span style={{ fontWeight: 'bold', color: '#27ae60', fontSize: '18px' }}>
          {parseFloat(product.price) === 0 ? '🎁 Bağış' : `${product.price} TL`}
        </span>
        <button onClick={() => onDelete(product.oid)} style={deleteButtonStyle}>Sil</button>
      </div>
    </div>
  );
};

const cardStyle = { border: 'none', padding: '15px', borderRadius: '12px', width: '250px', backgroundColor: '#fff', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' };
const deleteButtonStyle = { backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '5px 12px', borderRadius: '5px', cursor: 'pointer' };

export default ProductCard;