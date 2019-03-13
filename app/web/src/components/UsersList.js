import React from 'react';
import styled from 'styled-components';
import Card from './Card';

const H5 = styled.h5`
  display: inline-block;
  padding: .5rem;
  
  a {
    color: ${({ theme }) => theme.primary};
  }
`;

const H4 = styled.h4`
  color: ${({ theme }) => theme.primary};
`;

function UsersList({ title, users = [] }) {
  const usernames = users.map(u => <H5><a href={`/users/${u.id}`}>{u.username}</a></H5>);

  return (
    <Card>
      <h3>{title}</h3>
      {usernames.length > 0 ? (
        { usernames }
      ) : (
        <H4>No Currently Active Users</H4>
      )}
    </Card>
  );
}

export default UsersList;
