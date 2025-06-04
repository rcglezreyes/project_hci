import { gql, useQuery } from '@apollo/client';

const GET_ALL_USERS = gql`
  {
    allLoginUsers {
      address
      avatarUrl
      createdTime
      email
      firstName
      gender
      id
      lastLogin
      lastModifiedTime
      lastName
      phoneNumber
      token
      userRole
      username
      isActive
      address
    }
  }
`;

export const useUsersQuery = () => {
  const { loading, error, data, startPolling, stopPolling, refetch } = useQuery(GET_ALL_USERS, {
    context: {
      clientName: 'Users',
    },
  });

  // useEffect(() => {
  //   startPolling(CONFIG.pollingInterval * 3);
  //   return () => {
  //     stopPolling();
  //   };
  // }, [startPolling, stopPolling]);

  const users = data?.allLoginUsers || [];

  return { loading, error, data: users, refetch };
};

export const USER_STATUS_OPTIONS = [
  { value: 'active', label: 'Active', color: 'success.main' },
  { value: 'inactive', label: 'Inactive', color: 'error.main' },
];
