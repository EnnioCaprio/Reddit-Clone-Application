import { ApolloClient, InMemoryCache, HttpLink, split } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';

const wsLink = new WebSocketLink({
    uri: process.env.REACT_APP_APOLLO_URL,
    options: {
        reconnect: true
    }
  });
  
  const httpLink = new HttpLink({
    uri: process.env.REACT_APP_URL,
    credentials: 'include'
  });
  
  const link = split(
    ({query}) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
        );
    },
    wsLink,
    httpLink
  );
  
  const client = new ApolloClient({
    link,
    cache: new InMemoryCache()
  });

  export {client as default}