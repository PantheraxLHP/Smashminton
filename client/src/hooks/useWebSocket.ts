import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

export interface WebSocketMessage {
    type: string;
    data: any;
    timestamp: number;
}

export const useWebSocket = (url: string, namespace?: string) => {
    const [isConnected, setIsConnected] = useState(false);
    const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
    const [error, setError] = useState<string | null>(null);
    const socket = useRef<Socket | null>(null);

    useEffect(() => {
        if (!url) return;
        
        const connectSocket = () => {
            try {
                const socketUrl = namespace ? `${url}${namespace}` : url;

                socket.current = io(socketUrl, {
                    path: '/socket.io/',
                    transports: ['websocket', 'polling'],
                    timeout: 20000,
                    forceNew: true,
                    autoConnect: true,
                    reconnection: true,
                    reconnectionAttempts: 5,
                    reconnectionDelay: 1000,
                });

                socket.current.on('connect', () => {
                    setIsConnected(true);
                    setError(null);
                });

                // Event listener for any event
                socket.current.onAny((eventName: string, data: any) => {
                    setLastMessage({
                        type: eventName,
                        data: data,
                        timestamp: Date.now()
                    });
                });

                socket.current.on('disconnect', (reason) => {
                    setIsConnected(false);
                });

                socket.current.on('connect_error', (error) => {
                    setError(`Connection failed: ${error.message}`);
                    setIsConnected(false);
                });

                socket.current.on('reconnect', (attemptNumber) => {
                    setIsConnected(true);
                    setError(null);
                });

                socket.current.on('reconnect_error', (error) => { });

            } catch (err) {
                setError('Failed to create Socket.IO connection');
            }
        };

        connectSocket();

        return () => {
            if (socket.current) {
                socket.current.disconnect();
            }
        };
    }, [url, namespace]);

    const sendMessage = useCallback((event: string, data: any) => {
        if (socket.current && socket.current.connected) {
            socket.current.emit(event, data);
            return true;
        } else {
            return false;
        }
    }, []);

    return {
        isConnected,
        lastMessage,
        error,
        sendMessage,
        socket: socket.current
    };
};