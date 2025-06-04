import { gql, useQuery } from '@apollo/client';

const GET_ALL_DEPARTMENTS = gql`
  {
    departments {
      createdTime
      description
      id
      lastModifiedTime
      name
      isActive
    }
  }
`;

export const useDepartmentsQuery = () => {
  const { loading, error, data, refetch } = useQuery(GET_ALL_DEPARTMENTS, {
    context: {
      clientName: 'Main',
    },
  });

  const items = data?.departments || [];

  return { loading, error, data: items, refetch };
};
