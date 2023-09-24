import React, { useState, useEffect } from 'react';
import socket from '../socket';
import Users from './Users';
import ChatForm from './ChatForm';
import type { User, Message } from '../global';

const Chat = () => {
  const [existingUsers, setExistingUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState<User>();

  const [messages, setMessages] = useState<Array<Message>>([]);

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

  return (
    <div>
      <Users users={existingUsers} onSelect={setSelectedUser} />
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
      <ChatForm socket={socket} />
    </div>
  );
};

export default Chat;
