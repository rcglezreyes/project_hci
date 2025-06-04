import { gql, useQuery } from '@apollo/client';

const GET_ALL_TRACKS = gql`
  {
    trackings {
      action
      createdTime
      id
      managedData
      userReporter
    }
  }
`;

export const useTrackingQuery = () => {
  const { loading, error, data, refetch } = useQuery(GET_ALL_TRACKS, {
    context: {
      clientName: 'Main',
    },
  });

  const tracks = data?.trackings || [];

  return { loading, error, data: tracks, refetch };
};
