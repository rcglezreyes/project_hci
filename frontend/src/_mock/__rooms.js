import { gql, useQuery } from '@apollo/client';

const GET_ALL_ROOMS = gql`
  {
    rooms {
      createdTime
      description
      id
      lastModifiedTime
      name
      isActive
    }
  }
`;

export const useRoomsQuery = () => {
  const { loading, error, data, refetch } = useQuery(GET_ALL_ROOMS, {
    context: {
      clientName: 'Main',
    },
  });

  const items = data?.rooms || [];

  return { loading, error, data: items, refetch };
};
