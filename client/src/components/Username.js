import React, { useState } from 'react';

const UsernameForm = ({ onUsernameSelected }) => {
  const [username, setUsername] = useState('');

  return (
    <form action="" onSubmit={onUsernameSelected}>
      <div>
        <label>Username</label>
        <input
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <input type="submit" />
    </form>
  );
};

export default UsernameForm;
