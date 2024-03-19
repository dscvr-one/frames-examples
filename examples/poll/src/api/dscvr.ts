import { Client, cacheExchange, fetchExchange } from '@urql/core';
import { graphql } from 'gql.tada';

export const dscvrApiUrl = 'https://api.dscvr.one/graphql';

const getDataQuery = graphql(`
  query getData($id: String!) {
    user(id: $id) {
      id
      username
    }
  }
`);

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
