import { gql, useQuery } from '@apollo/client';

const GET_ALL_MEDICAL_STAFF = gql`
  {
    medicalStaffs {
      createdTime
      department
      graduatedDate
      id
      lastModifiedTime
      specialty
      user
      isActive
    }
  }
`;

const GET_MEDICAL_STAFF_BY_ID = gql`
  query GetById($id: String!) {
    medicalStaffs {
      createdTime
      department
      graduatedDate
      id
      lastModifiedTime
      specialty
      user
      isActive
    }
  }
`;

export const useMedicalStaffsQuery = () => {
  const { loading, error, data, refetch } = useQuery(GET_ALL_MEDICAL_STAFF, {
    context: {
      clientName: 'Main',
    },
  });

  const items = data?.medicalStaffs || [];

  return { loading, error, data: items, refetch };
};

export const useMedicalStaffByIdQuery = (id) => {
  const { loading, error, data, refetch } = useQuery(GET_MEDICAL_STAFF_BY_ID, {
    context: {
      clientName: 'Main',
    },
    variables: { id },
    skip: !id,
  });

  const item = data?.medicalStaffs || {};

  return { loading, error, data: item, refetch };
};
