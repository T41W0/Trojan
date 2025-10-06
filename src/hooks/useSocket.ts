'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface UseSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  joinOrder: (orderId: string) => void;
  joinUser: (userId: string) => void;
  leaveOrder: (orderId: string) => void;
  leaveUser: (userId: string) => void;
}

export const useSocket = (): UseSocketReturn => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socketInstance = io(process.env.NODE_ENV === 'production' 
      ? process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
      : 'http://localhost:3000'
    );

    socketInstance.on('connect', () => {
      console.log('Connected to WebSocket server');
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
      setIsConnected(false);
    });

    socketRef.current = socketInstance;
    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const joinOrder = (orderId: string) => {
    if (socketRef.current) {
      socketRef.current.emit('join-order', orderId);
    }
  };

  const joinUser = (userId: string) => {
    if (socketRef.current) {
      socketRef.current.emit('join-user', userId);
    }
  };

  const leaveOrder = (orderId: string) => {
    if (socketRef.current) {
      socketRef.current.emit('leave-order', orderId);
    }
  };

  const leaveUser = (userId: string) => {
    if (socketRef.current) {
      socketRef.current.emit('leave-user', userId);
    }
  };

  return {
    socket,
    isConnected,
    joinOrder,
    joinUser,
    leaveOrder,
    leaveUser
  };
};
