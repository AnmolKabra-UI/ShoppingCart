import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Rating from "@mui/material/Rating";
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Modal from '@mui/material/Modal';
import { fetchProduct } from '../common/api';

export default function Details({ productId, onAddToCart }) {
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [prevQuantity, setPrevQuantity] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchProduct(productId)
      .then(data => {
        setProduct(data.data.product);
        setSelectedImage(data.data.product.imageUrl); // default to main image
        // Find cart item for this product
        const cartItems = data.data.cart?.items || [];
        const cartItem = cartItems.find(item => item.productId === productId);
        setQuantity(cartItem ? cartItem.quantity : 0);
        setPrevQuantity(cartItem ? cartItem.quantity : 0);
        setLoading(false);
      });
  }, [productId]);

  const handleQuantityChange = (e) => setQuantity(Number(e.target.value));

  const handleAddToCart = () => {
    const diff = quantity - prevQuantity;
    if (diff !== 0) {
      onAddToCart(product.id, diff);
      setPrevQuantity(quantity);
    }
  };

  if (loading || !product) return <Box sx={{p: 4}}><Typography>Loading...</Typography></Box>;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", pl: 0, pr: 0 }}>
      {/* Top 50%: Product details */}
      <Box
        sx={{
          minHeight: "50vh",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
          pl: 20,
          pr: 20,
          pb: 10,
          backgroundColor: '#fff'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            width: 400,
            height: 320,
            position: 'relative',
            overflow: 'hidden',
            background: '#fff',
          }}
        >
          {/* Thumbnails on the left, stretched to main image height */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mr: 2, height: 320, justifyContent: 'space-between' }}>
            {[product.imageUrl, product.imageUrl, product.imageUrl].map((img, idx) => (
              <Box
                key={idx}
                sx={{
                  borderRadius: 1,
                  width: 96,
                  height: 96, // 320/3
                  overflow: 'hidden',
                  background: '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}
                onClick={() => {
                  setSelectedImage(img);
                  setZoom(1.5); // Zoom in when thumbnail is clicked
                  setTimeout(() => setZoom(1), 800); // Reset zoom after 0.8s
                }}
              >
                <img src={img} alt={product.name + ' thumb'} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s', transform: selectedImage === img && zoom > 1 ? `scale(${zoom})` : 'scale(1)' }} />
                <ZoomInIcon style={{ position: 'absolute', bottom: 4, right: 4, fontSize: 20 }} />
              </Box>
            ))}
          </Box>
          {/* Main image and zoom controls */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', flex: 1 }}>
            <img
              src={selectedImage}
              alt={product.name}
              style={{
                width: 320 * zoom,
                height: 320 * zoom,
                objectFit: "contain",
                transition: "0.3s",
                cursor: 'pointer'
              }}
              onClick={() => setOpenModal(true)}
            />
            <Modal open={openModal} onClose={() => setOpenModal(false)}>
              <Box 
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
                onClick={e => {
                  if (e.target === e.currentTarget) setOpenModal(false);
                }}
              >
                <img src={selectedImage} alt={product.name} style={{ height: '70vh', width: 'auto', padding: 20, background: '#fff' }} />
              </Box>
            </Modal>
            <Box sx={{ position: 'absolute', right: 16, bottom: 16, display: 'flex', gap: 1 }}>
              <div onClick={() => setZoom(z => Math.max(z - 0.2, 1))} style={{ cursor: 'pointer', padding: 4 }}>
                <ZoomOutIcon />
              </div>
              <div onClick={() => setZoom(z => Math.min(z + 0.2, 2))} style={{ cursor: 'pointer', padding: 4 }}>
                <ZoomInIcon />
              </div>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "flex-start",
            height: 320
          }}
        >
          <Box>
            <Typography variant="h6">{product.name}</Typography>
            <Typography variant="body2" gutterBottom>
              {product.shortDescription}
            </Typography>
            <Rating
              name="read-only"
              value={product.rating}
              precision={0.5}
              readOnly
            />
            <Typography variant="body2" sx={{ mt: 2 }}>
              {product.price} EUR
            </Typography>
            <Typography variant="body2">all prices incl. 10% taxes</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "flex-end", mt: 2 }}>
            <input
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              min={0}
              style={{
                width: 50,
                height: 35,
                marginRight: "10px",
                textAlign: "center",
              }}
            />
            <Button variant="contained" onClick={handleAddToCart}>
              <ShoppingCartIcon sx={{ mr: 1 }} />
              ADD TO CART
            </Button>
          </Box>
        </Box>
      </Box>
      {/* Bottom 50%: Product description */}
      <Box
        sx={{
          minHeight: "50vh",
          bgcolor: "#f5f5f5",
          pt: 4,
          pb: 4,
          pl: 20,
          pr: 20,
          overflowY: "auto",
        }}
      >
        <Typography variant="h8" gutterBottom>
          DESCRIPTION
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 1 }}>{product.longDescription}</Typography>
      </Box>
    </Box>
  );
}
