import React, { useState, ChangeEventHandler, FormEventHandler } from 'react';
import type { Socket } from 'socket.io-client';
import useTyping from '../hooks/useTyping';

interface ChatFormProps {
  socket: Socket;
}

const ChatForm: React.FC<ChatFormProps> = ({ socket }) => {
  const [message, setMessage] = useState('');
  const [isTyping, register] = useTyping({ timeout: 3000 });

  const handleChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    const content = message.trim();
    if (!content) return;

    socket.emit('message:new', {
      to: 'general',
      content,
    });
    setMessage('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea ref={register} value={message} onChange={handleChange} />
      Typing? {isTyping ? '✅' : '❌'}
      <button type="submit">Send Message</button>
    </form>
  );
};

export default ChatForm;
