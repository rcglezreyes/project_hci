import { gql, useQuery } from '@apollo/client';

const GET_ALL_DIAGNOSES = gql`
  {
    diagnoses {
      createdTime
      description
      id
      lastModifiedTime
      name
      isActive
    }
  }
`;

export const useDiagnosesQuery = () => {
  const { loading, error, data, refetch } = useQuery(GET_ALL_DIAGNOSES, {
    context: {
      clientName: 'Main',
    },
  });

  const items = data?.diagnoses || [];

  return { loading, error, data: items, refetch };
};
