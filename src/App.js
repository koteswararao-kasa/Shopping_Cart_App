import { useState, useEffect } from "react";
import "./App.css";

const PRODUCTS = [
  { id: 1, name: "Laptop", price: 500 },
  { id: 2, name: "Smartphone", price: 300 },
  { id: 3, name: "Headphones", price: 100 },
  { id: 4, name: "Smartwatch", price: 150 },
];

const FREE_GIFT = { id: 99, name: "Wireless Mouse", price: 0 };
const THRESHOLD = 1000;

export default function ShoppingCart() {
  const [cart, setCart] = useState([]);
  const [quantities, setQuantities] = useState([]);
  const [showGiftMsg, setShowGiftMsg] = useState(false);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      const quantity = quantities[product.id] || 1;
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity }];
      }
    });
  };

  const updateCart = (id, delta) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0);
    });
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const isGiftInCart = cart.some((item) => item.id === FREE_GIFT.id);

  useEffect(() => {
    if (subtotal >= THRESHOLD && !isGiftInCart) {
      setCart((prev) => [...prev, { ...FREE_GIFT, quantity: 1 }]);
      setShowGiftMsg(true);
    }
    if (subtotal < THRESHOLD && isGiftInCart) {
      setCart((prev) => prev.filter((item) => item.id !== FREE_GIFT.id));
    }
  }, [subtotal]);

  return (
    <div className="container">
      <h1 className="title">Shopping Cart</h1>
      <h2 className="sub-title">Products</h2>
      <div className="products-grid">
        {PRODUCTS.map((each) => (
          <div key={each.id} className="product-card">
            <h3>{each.name}</h3>
            <p>₹{each.price}</p>
            <button
              type="button"
              className="add-to-cart"
              onClick={() => addToCart(each)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <h2>Cart Summary</h2>
        <div className="amount">
          <p>Subtotal:</p>
          <span>₹{subtotal}</span>
        </div>
        <div className="progress-bar">
          <div
            className="progress"
            style={{ width: `${Math.min((subtotal / THRESHOLD) * 100, 100)}%` }}
          ></div>
        </div>
        {subtotal >= THRESHOLD && (
          <p className="gift-message">You got a free Wireless Mouse!</p>
        )}
      </div>
      <div className="cart-items">
        <h2>Cart Items</h2>
        {cart.length === 0 ? (
          <div>
            <h4>Your cart is empty</h4>
            <p>Add some products to see them here!</p>
          </div>
        ) : (
          <ul>
            {cart.map((item) => (
              <li key={item.id} className="cart-item">
                <div>
                  <p>{item.name}</p>
                  <p>
                    ₹{item.price} x {item.quantity} = ₹
                    {item.price * item.quantity}
                  </p>
                </div>
                <div className="cart-actions">
                  {item.id !== FREE_GIFT.id && (
                    <>
                      <button
                        onClick={() => updateCart(item.id, -1)}
                        className="decrement"
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => updateCart(item.id, 1)}
                        className="increment"
                      >
                        +
                      </button>
                    </>
                  )}
                  {item.id === FREE_GIFT.id && (
                    <span className="free-gift">FREE GIFT</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
