import { Client, cacheExchange, fetchExchange } from '@urql/core';
import { initGraphQLTada } from 'gql.tada';
import { introspection } from '../graphql-env';

export const graphql = initGraphQLTada<{
  introspection: introspection;
  scalars: {
    DscvrId: string;
  };
}>();

const getDataQuery = graphql(`
  query getData($id: DscvrId!) {
    user(id: $id) {
      id
      username
    }
  }
`);

export const dscvrApiUrl = 'https://api.dscvr.one/graphql';

export const getData = async (id: string) => {
  try {
    const client = new Client({
      url: dscvrApiUrl,
      exchanges: [cacheExchange, fetchExchange],
    });

    const result = await client.query(getDataQuery, { id }).toPromise();
    return result.data;
  } catch (error) {
    throw new Error('Error fetching data: ' + (error as Error).message);
  }
};
