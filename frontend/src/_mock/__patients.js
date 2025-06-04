import { gql, useQuery } from '@apollo/client';

const GET_ALL_PATIENTS = gql`
  {
    patients {
      createdTime
      disabilities
      id
      lastModifiedTime
      user
      isActive
      birthDate
    }
  }
`;

const GET_PATIENT_BY_ID = gql`
  query GetById($id: String!) {
    patients {
      createdTime
      disabilities
      id
      lastModifiedTime
      user
      isActive
      birthDate
    }
  }
`;

export const usePatientsQuery = () => {
  const { loading, error, data, refetch } = useQuery(GET_ALL_PATIENTS, {
    context: {
      clientName: 'Main',
    },
  });

  const items = data?.patients || [];

  return { loading, error, data: items, refetch };
};

export const usePatientByIdQuery = (id) => {
  const { loading, error, data, refetch } = useQuery(GET_PATIENT_BY_ID, {
    context: {
      clientName: 'Main',
    },
    variables: { id },
    skip: !id,
  });

  const item = data?.patients || {};

  return { loading, error, data: item, refetch };
};
