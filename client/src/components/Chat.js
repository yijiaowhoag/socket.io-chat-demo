import React, { useEffect, useState } from 'react';
import useTyping from '../hooks/useTyping';

const Chat = ({ socket }) => {
  const [existingUsers, setExistingUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const [isTyping, register] = useTyping({ timeout: 3000 });

  useEffect(() => {
    socket.on('users', (users) => setExistingUsers(users));
    socket.on('message:new', (payload) => {
      setMessages([...messages, payload]);
    });

    return () => {
      socket.off('users');
      socket.off('message:new');
    };
  }, []);

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const content = message.trim();
    if (!content) return;

    socket.emit('message:new', {
      to: selectedUser?.userID || 'general',
      content,
    });
    setMessage('');
  };

  return (
    <div>
      <div>
        <h3>Users</h3>
        <ul>
          {existingUsers.map((user) => (
            <li key={user.userID} onClick={() => setSelectedUser(user)}>
              <p>{JSON.stringify(user)}</p>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Recent Messages</h3>
        <ul>
          {messages.map((message, idx) => (
            <li key={idx}>
              <p>{JSON.stringify(message)}</p>
            </li>
          ))}
        </ul>
      </div>
      <form onSubmit={handleSubmit}>
        <textarea ref={register} value={message} onChange={handleChange} />
        Typing? {isTyping ? '✅' : '❌'}
        <button type="submit">Send Message</button>
      </form>
    </div>
  );
};

export default Chat;
