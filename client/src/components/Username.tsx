import React, { useState, FormEventHandler } from 'react';
import Button from '@/components/Button';

interface UsernameFormProps {
  onUsernameSelected: FormEventHandler;
}

const UsernameForm: React.FC<UsernameFormProps> = ({ onUsernameSelected }) => {
  const [username, setUsername] = useState('');

  return (
    <form action="" onSubmit={onUsernameSelected}>
      <h2>Choose username</h2>
      <div className="flex my-4">
        <input
          name="username"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="flex-1 border-0 border-b-2 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
        />
      </div>
      <Button type="submit">Submit</Button>
    </form>
  );
};

export default UsernameForm;
