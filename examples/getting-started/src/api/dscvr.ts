import { Client, cacheExchange, fetchExchange } from '@urql/core';
import { graphql } from 'gql.tada';

const getDataQuery = graphql(`
  query getData($id: String!, $contentId: String!, $hasContent: Boolean!) {
    user(id: $id) {
      id
      username
      bio
      numFollowers
      numFollowing
      numPosts
      activeStreak
      iconUrl
    }
    content(id: $contentId) @include(if: $hasContent) {
      id
      owner {
        username
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
  return result.data;
};
