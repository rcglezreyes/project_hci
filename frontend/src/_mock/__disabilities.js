import { gql, useQuery } from '@apollo/client';

const GET_ALL_DISABILITIES = gql`
  {
    disabilities {
      createdTime
      description
      id
      lastModifiedTime
      name
      isActive
    }
  }
`;

export const useDisabilitiesQuery = () => {
  const { loading, error, data, refetch } = useQuery(GET_ALL_DISABILITIES, {
    context: {
      clientName: 'Main',
    },
  });

  const items = data?.disabilities || [];

  return { loading, error, data: items, refetch };
};
