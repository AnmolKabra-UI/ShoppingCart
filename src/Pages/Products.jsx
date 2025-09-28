import { useEffect, useState } from "react";
import Navbar from "../common/Navbar";
import Card from "../common/Card";
import Details from "./Details";
import Cart from "./Cart";
import { fetchProducts, addToCart, fetchCartCount } from "../common/api";

function Products() {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [heading, setHeading] = useState("Products");
  const [cartCount, setCartCount] = useState(0);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    fetchProducts().then(data => {
      setProducts(data.data.products);
      setCartCount(data.data.cartCount);
    });
  }, []);

  const handleAddToCart = (productId, quantity) => {
    if (quantity === 0) return;
    addToCart(productId, quantity)
      .then(() => {
        fetchCartCount().then(data => setCartCount(data.data.cartCount));
      });
  };

  const handleShowDetails = (productId, name) => {
    setSelectedProductId(productId);
    setHeading(name);
  };

  const handleCartClick = () => {
    setShowCart(true);
    setHeading("Cart");
  };

  const handleBack = () => {
    setShowCart(false);
    setSelectedProductId(null);
    setHeading("Products");
  };

  const productsContent = showCart ? (
    <Cart setCartCount={setCartCount} />
  ) : selectedProductId ? (
    <Details productId={selectedProductId} onAddToCart={handleAddToCart} />
  ) : (
    <div className="cards-container">
      {products.map(product => (
        <Card
          key={product.id}
          id={product.id}
          image={product.imageUrl}
          name={product.name}
          price={product.price}
          shortDescription={product.shortDescription}
          longDescription={product.longDescription}
          rating={product.rating}
          onShowDetails={() => handleShowDetails(product.id, product.name)}
          onAddToCart={handleAddToCart}
        />
      ))}
    </div>
  );

  return (
    <>
      <Navbar 
        heading={heading} 
        content={productsContent} 
        cartCount={cartCount} 
        showBackButton={showCart || !!selectedProductId}
        onBack={handleBack}
        onCartClick={handleCartClick}
      />
    </>
  );
}

export default Products;
