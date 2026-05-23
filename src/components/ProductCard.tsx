import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface Props {
  product: Product;
  onOpen: () => void;
}

const ProductCard = ({ product, onOpen }: Props) => {
  const { add } = useCart();

  return (
    <article className="product-card">
      <img src={product.image} alt={product.name} />
      <div className="product-content">
        <div className="product-meta">
          <span>{product.category}</span>
          <span>{product.condition}</span>
        </div>
        <h3 className="product-title">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="seller-badge">{product.sellerType}</div>
        <div className="product-meta">
          <span>{product.location}</span>
          <span>{product.sellerType}</span>
        </div>
        <div className="product-meta">
          <strong className="product-price">GHS {product.price.toLocaleString()}</strong>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn" type="button" onClick={onOpen}>
              View
            </button>
            <button className="btn" type="button" onClick={() => add(product)}>
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
