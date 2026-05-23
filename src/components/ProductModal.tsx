import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface Props {
  product: Product;
  onClose: () => void;
}

const ProductModal = ({ product, onClose }: Props) => {
  const { add } = useCart();

  return (
  <div className="modal-backdrop" role="dialog" aria-modal="true">
    <div className="modal-panel">
      <img className="modal-image" src={product.image} alt={product.name} />
      <div className="modal-content">
        <header>
          <span className="tag">{product.category}</span>
          <h2>{product.name}</h2>
          <div className="tag-row">
            <span className="tag">{product.condition}</span>
            <span className="tag">{product.location}</span>
          </div>
        </header>
        <div className="modal-meta">
          <div className="meta-row">
            <span>Seller</span>
            <span>{product.sellerName}</span>
          </div>
          <div className="meta-row">
            <span>Type</span>
            <span>{product.sellerType}</span>
          </div>
          <div className="meta-row">
            <span>Price</span>
            <span>GHS {product.price.toLocaleString()}</span>
          </div>
          <div className="meta-row">
            <span>Listed</span>
            <span>{new Date(product.listedAt).toLocaleDateString()}</span>
          </div>
        </div>
        <p>{product.description}</p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
          <button className="btn" type="button" onClick={() => add(product)}>Add to cart</button>
          <button className="btn" type="button">Contact Seller</button>
          <button
            className="btn"
            type="button"
            style={{ background: '#e5e7eb', color: '#111827' }}
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
  );
};

export default ProductModal;
