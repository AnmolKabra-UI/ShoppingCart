import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import { fetchCart, fetchCartCount, removeFromCart as removeFromCartApi, clearCart as clearCartApi } from '../common/api';

const Cart = ({ setCartCount }) => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    fetchCart().then(data => {
      setCartItems(data.data.cart.items);
      setTotal(data.data.cart.total);
      setLoading(false);
      console.log('Cart items:', data.data.cart.items); // Debug: log cart items structure
    });
  }, []);

  const handleRemoveFromCart = (productId) => {
    removeFromCartApi(productId)
      .then((data) => {
        console.log('removeFromCart response:', data);
        // Refetch cart data
        fetchCart().then(data => {
          setCartItems(data.data.cart.items);
          setTotal(data.data.cart.total);
        });
        // Refetch cart count
        fetchCartCount().then(data => {
          if (setCartCount) setCartCount(data.data.cartCount);
        });
      });
  };

  const handleClearCart = async () => {
    await clearCartApi();
    // Refetch cart data
    fetchCart().then(data => {
      setCartItems(data.data.cart.items);
      setTotal(data.data.cart.total);
    });
    // Refetch cart count
    fetchCartCount().then(data => {
      if (setCartCount) setCartCount(data.data.cartCount);
    });
  };

  const handleGoBackHome = async () => {
    await clearCartApi();
    fetchCart().then(data => {
      setCartItems(data.data.cart.items);
      setTotal(data.data.cart.total);
    });
    fetchCartCount().then(data => {
      if (setCartCount) setCartCount(data.data.cartCount);
    });
    window.location.href = '/';
  };

  if (loading) return <Box sx={{ p: 4, textAlign: 'center' }}><Typography>Loading...</Typography></Box>;

  if (!cartItems.length && !openModal) return <Box sx={{ p: 4, textAlign: 'center' }}><Typography>No items in cart.</Typography></Box>;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', mt: 6}}>
      <Box sx={{  width: 600, display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Typography variant="body2" sx={{ cursor: 'pointer'}} onClick={handleClearCart}>
          Clear the cart
        </Typography>
      </Box>
      {cartItems.map(item => (
        <Card key={item.productId} sx={{ width: 600, mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h6">{item.product.name}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {item.product.shortDescription}
                </Typography>
              </Box>
              <Box>
                <IconButton onClick={() => handleRemoveFromCart(item.productId)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
          </CardContent>
          <CardActions sx={{ justifyContent: 'flex-start' }}>
            <Typography variant="body2" sx={{ml: 1, mb: 1}}>Quantity: {item.quantity}</Typography>
          </CardActions>
        </Card>
      ))}
      <Box sx={{ width: 600, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Total: {Number(total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} EUR
        </Typography>
        <Box>
          <button
            style={{ padding: '10px 32px', fontSize: '1rem', borderRadius: 6, background: '#1976d2', color: 'white', border: 'none', cursor: cartItems.length > 0 ? 'pointer' : 'not-allowed', opacity: cartItems.length > 0 ? 1 : 0.5 }}
            disabled={cartItems.length === 0}
            onClick={() => setOpenModal(true)}
          >
            Purchase
          </button>
        </Box>
      </Box>
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper', boxShadow: 24, p: 2, borderRadius: 2, width: 450}}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>Purchase Complete</Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Thank you for your purchase! Your order has been successfully placed. A confirmation email has been sent to your inbox with the details of your order. We hope to serve you again soon!
          </Typography>
          <Button color="primary" sx={{ alignSelf: 'flex-end' }} onClick={handleGoBackHome}>
            GO BACK HOME
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}

export default Cart;