import React from 'react';
import type { User } from '../global';

interface UsersProps {
  users: Array<User>;
  onSelect: (user: User) => void;
}
const Users: React.FC<UsersProps> = ({ users, onSelect }) => {
  return (
    <div>
      <div>
        <h3>Users</h3>
        <ul>
          {users.map((user) => (
            <li key={user.userID} onClick={() => onSelect(user)}>
              <p>{JSON.stringify(user)}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Users;
