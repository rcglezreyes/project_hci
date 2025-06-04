import { gql, useQuery } from '@apollo/client';

const GET_ALL_ADMISSIONS = gql`
  {
    admissions {
      bed
      createdTime
      date
      daysInAdmission
      diagnoses
      diagnosesNotes
      id
      isSurgical
      isUrgent
      lastModifiedTime
      medicalStaff
      patient
      room
      isActive
    }
  }
`;

const GET_ADMISSIONS_BY_ID = gql`
  query GetById($id: String!) {
    admissions {
      bed
      createdTime
      date
      daysInAdmission
      diagnosis
      diagnosisNotes
      id
      isSurgical
      isUrgent
      lastModifiedTime
      medicalStaff
      patient
      room
      isActive
    }
  }
`;

export const useAdmissionsQuery = () => {
  const { loading, error, data, refetch } = useQuery(GET_ALL_ADMISSIONS, {
    context: {
      clientName: 'Main',
    },
  });

  const items = data?.admissions || [];

  return { loading, error, data: items, refetch };
};

export const useAdmissionByIdQuery = (id) => {
  const { loading, error, data, refetch } = useQuery(GET_ADMISSIONS_BY_ID, {
    context: {
      clientName: 'Main',
    },
    variables: { id },
    skip: !id,
  });

  const item = data?.admission || {};

  return { loading, error, data: item, refetch };
};
