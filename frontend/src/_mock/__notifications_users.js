import { gql, useQuery } from '@apollo/client';

const GET_NOTIFICATIONS = gql`
  query GetNotificationUsers($username: String, $user: String, $page: Int, $pageSize: Int) {
    notificationUsers(username: $username, user: $user, page: $page, pageSize: $pageSize) {
      count
      page
      pageSize
      results {
        createdTime
        id
        notification
        read
        lastModifiedTime
        user
        username
      }
    }
  }
`;

export const useNotificationsQuery = (username, user, page, pageSize) => {
  const { loading, error, data, refetch } = useQuery(GET_NOTIFICATIONS, {
    context: {
      clientName: 'Main',
    },
    variables: { username, user, page, pageSize },
    fetchPolicy: 'network-only',
  });

  return { loading, error, data: data?.notificationUsers?.results || [], refetch };
};
