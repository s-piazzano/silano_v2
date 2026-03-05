import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";

const createApolloClient = () => {
  const httpLink = createHttpLink({
    uri: process.env.BASE_URL,
  });

  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: httpLink,
    cache: new InMemoryCache(),
  });
};

export default createApolloClient;