import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import "./Card.css";

export default function MediaCard({ image, name, shortDescription, rating, onShowDetails, onAddToCart, id }) {
  return (
    <Card
      sx={{
        width: "100%",
        height: 450,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardMedia
        component="img"
        image={image}
        title={name}
        sx={{ height: "70%", width: "100%", objectFit: "cover" }}
      />
      <CardContent sx={{ flex: "1 1 auto", pb: 0 }}>
        <Typography variant="h5" component="div">
          {name}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 0 }}>
            {shortDescription}
          </Typography>
          <Rating name="read-only" value={rating} precision={0.5} readOnly />
        </Box>
      </CardContent>
      <CardActions>
        <Button variant="contained" onClick={onShowDetails}>SHOW DETAILS</Button>
        <Button variant="contained" sx={{ backgroundColor: '#e0e0e0', color: '#212121', '&:hover': { backgroundColor: '#bdbdbd' } }} onClick={() => onAddToCart(id, 1)}>ADD TO CART</Button>
      </CardActions>
    </Card>
  );
}
