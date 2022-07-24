import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import Chat from './components/Chat';
import UsernameForm from './components/Username';

const getRandomIntInclusive = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
};
const socket = io(
  ['http://localhost:8080', 'http://localhost:8081', 'http://localhost:8082'][
    getRandomIntInclusive(0, 2)
  ],
  {
    autoConnect: false,
    reconnectionAttempts: 5,
    reconnectionDelay: 5000,
    transports: ['websocket'],
  }
);

const App = () => {
  const [usernameSelected, setUsernameSelected] = useState(false);

  useEffect(() => {
    const sessionID = localStorage.getItem('sessionID');

    if (sessionID) {
      setUsernameSelected(true);
      socket.auth = { sessionID };
      socket.connect();
    }
  }, [usernameSelected]);

  useEffect(() => {
    socket.on('user:connected', (payload) => {
      console.log('user:connected', payload);
    });

    socket.on('user:disconnected', (payload) => {
      console.log('user:disconnected', payload);
    });

    socket.on('session', ({ sessionID, userID }) => {
      // Attach sessionID to the next reconnection attempt
      socket.auth = { sessionID };

      // Store sessionID in localStorage
      localStorage.setItem('sessionID', sessionID);

      // Save userID
      socket.userID = userID;
    });

    socket.on('connect_error', (err) => {
      if (err.message === 'Invalid username') {
        setUsernameSelected(false);
      }
    });

    return () => {
      socket.off('user:connected');
      socket.off('user:disconnected');
      socket.off('session');
      socket.off('connect_error');
    };
  }, []);

  const onUsernameSelected = (e) => {
    e.preventDefault();

    const fd = new FormData(e.currentTarget);
    const username = fd.get('username')?.toString().trim();

    if (!username) return;

    setUsernameSelected(true);
    socket.auth = { username };
    socket.connect();
  };

  return usernameSelected ? (
    <Chat socket={socket} />
  ) : (
    <UsernameForm onUsernameSelected={onUsernameSelected} />
  );
};

export default App;
