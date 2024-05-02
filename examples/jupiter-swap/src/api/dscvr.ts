import { Client, cacheExchange, fetchExchange } from '@urql/core';
import { initGraphQLTada } from 'gql.tada';
import { introspection } from '../graphql-env';

export const graphql = initGraphQLTada<{
  introspection: introspection;
  scalars: {
    DscvrId: string;
    ContentId: string;
  };
}>();

const getDataQuery = graphql(`
  query getData($id: DscvrId!, $contentId: ContentId!, $hasContent: Boolean!) {
    user(id: $id) {
      id
      username
    }
    content(id: $contentId) @include(if: $hasContent) {
      id
      creator {
        username
      }
      contentType
      portal {
        name
        iconUrl
      }
    }
  }
`);

export const dscvrApiUrl = 'https://api.dscvr.one/graphql';

export const getData = async (id: string, contentId?: string) => {
  const client = new Client({
    url: dscvrApiUrl,
    exchanges: [cacheExchange, fetchExchange],
  });

  const result = await client
    .query(getDataQuery, {
      id,
      contentId: contentId || '',
      hasContent: !!contentId,
    })
    .toPromise();
  if (result.error) {
    let message = result.error.message;
    if (result.error.graphQLErrors.length) {
      message = result.error.graphQLErrors
        .map((e) => e.originalError?.message)
        .join(', ');
    }

    throw new Error(message);
  }
  return result.data;
};
