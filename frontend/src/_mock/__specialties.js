import { gql, useQuery } from '@apollo/client';

const GET_ALL_SPECIALTIES = gql`
  {
    specialties {
      createdTime
      description
      id
      lastModifiedTime
      name
      isActive
    }
  }
`;

export const useSpecialtiesQuery = () => {
  const { loading, error, data, refetch } = useQuery(GET_ALL_SPECIALTIES, {
    context: {
      clientName: 'Main',
    },
  });

  const items = data?.specialties || [];

  return { loading, error, data: items, refetch };
};
