import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";

const createApolloClient = () => {
  const httpLink = createHttpLink({
    uri: process.env.BASE_URL,
    headers: {
      authorization: process.env.STRAPI_API_TOKEN
        ? `Bearer ${process.env.STRAPI_API_TOKEN}`
        : "",
    },
  });

  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: httpLink,
    cache: new InMemoryCache(),
  });
};

export default createApolloClient;