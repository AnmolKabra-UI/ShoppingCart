// src/common/api.js

export const fetchCart = async () => {
  const res = await fetch('http://127.0.0.1:3000/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `query { cart { items { productId quantity product { name shortDescription } } total } }`
    })
  });
  return res.json();
};

export const fetchCartCount = async () => {
  const res = await fetch('http://127.0.0.1:3000/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: `query { cartCount }` })
  });
  return res.json();
};

export const addToCart = async (productId, quantity) => {
  const res = await fetch('http://127.0.0.1:3000/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `mutation($productId: ID!, $quantity: Int!) { addToCart(productId: $productId, quantity: $quantity) { id } }`,
      variables: { productId, quantity: Number(quantity) }
    })
  });
  return res.json();
};

export const removeFromCart = async (itemId) => {
  const res = await fetch('http://127.0.0.1:3000/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `mutation($itemId: ID!) { removeFromCart(itemId: $itemId) }`,
      variables: { itemId }
    })
  });
  return res.json();
};

export const clearCart = async () => {
  const res = await fetch('http://127.0.0.1:3000/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: `mutation { clearCart }` })
  });
  return res.json();
};

export const fetchProducts = async () => {
  const res = await fetch('http://127.0.0.1:3000/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `query { products { id name shortDescription longDescription price imageUrl rating } cartCount }`
    })
  });
  return res.json();
};

export const fetchProduct = async (productId) => {
  const res = await fetch('http://127.0.0.1:3000/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `query($id: ID!) { product(id: $id) { id name shortDescription longDescription price imageUrl rating } cart { items { productId quantity } } }`,
      variables: { id: productId }
    })
  });
  return res.json();
};
