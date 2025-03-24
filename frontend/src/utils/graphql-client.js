import { split, HttpLink, ApolloClient, InMemoryCache } from '@apollo/client';

import { paths } from 'src/routes/paths';

const httpLinkMain = new HttpLink({
  uri: paths.backend.graphql.main.baseUrl,
});

const httpLinkUsers = new HttpLink({
  uri: paths.backend.graphql.users.baseUrl,
});

const splitLink = split(
  (operation) => operation.getContext().clientName === 'Main',
  httpLinkMain,
  httpLinkUsers
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

export default client;
