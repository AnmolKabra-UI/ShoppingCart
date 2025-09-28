import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Import apollo client here for connecting to backend
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import './index.css'
import App from './App.jsx'

// Initialize Apollo Client - This code creates an instance of Apollo Client, which is used to connect your React app to a GraphQL backend.
const client = new ApolloClient({
  link: new HttpLink({ uri: "http://127.0.0.1:3000/graphql" }),
  cache: new InMemoryCache(),
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <ApolloProvider client={client}> is a React context provider from Apollo Client. It makes the Apollo Client instance (client) available to all React components inside it, so they can use GraphQL queries and mutations. */}
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </StrictMode>,
)


