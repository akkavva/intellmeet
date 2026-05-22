import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import useAuthStore from '../store/authStore';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

const useSocket = (meetingId?: string) => {
  const socketRef = useRef<Socket | null>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) return;

    socketRef.current = io(SOCKET_URL, {
      auth: { token: user.token }
    });

    socketRef.current.on('connect', () => {
      console.log('Socket connected:', socketRef.current?.id);
      if (meetingId) {
        socketRef.current?.emit('join-meeting', meetingId);
      }
    });

    socketRef.current.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    return () => {
      if (meetingId) {
        socketRef.current?.emit('leave-meeting', meetingId);
      }
      socketRef.current?.disconnect();
    };
  }, [user, meetingId]);

  return socketRef.current;
};

export default useSocket;