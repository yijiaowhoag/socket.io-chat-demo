import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:8080');

const Chat = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit('message:create', { message });
  };

  return (
    <div>
      <h1>Chat Connected: {isConnected}</h1>
      <form onSubmit={handleSubmit}>
        <textarea value={message} onChange={handleChange} />
        <button type="submit">Send Message</button>
      </form>
    </div>
  );
};

export default Chat;
