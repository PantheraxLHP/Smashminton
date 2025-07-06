'use client';

import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface WebSocketContextType {
    isConnected: boolean;
    lastMessage: any;
    sendMessage: ((event: string, data?: any) => void) | null;
}

const WebSocketContext = createContext<WebSocketContextType>({
    isConnected: false,
    lastMessage: null,
    sendMessage: null,
});

export const useWebSocketContext = () => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error('useWebSocketContext must be used within a WebSocketProvider');
    }
    return context;
};

interface WebSocketProviderProps {
    children: ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
    const wsNamespace = '/app';
    const server = process.env.NEXT_PUBLIC_SERVER || 'http://localhost:8000';
    const { isConnected, lastMessage, sendMessage } = useWebSocket(server, wsNamespace);
    const { user } = useAuth();

    useEffect(() => {
        if (!isConnected || !sendMessage || !user || !user.role) return;

        // Notifications nội bộ dành cho nhân viên, không dành cho khách hàng
        const employeeRoles = ['employee', 'wh_manager', 'hr_manager', 'admin'];

        if (employeeRoles.includes(user.role)) {
            sendMessage('subscribe_global', {
                userRole: user.role,
            });
            sendMessage(`subscribe_all_${user.role}`, {
                userRole: user.role,
            })
        }
    }, [isConnected, sendMessage, user]);

    // Xử lý notifications
    useEffect(() => {
        if (!lastMessage) return;

        const formatObjectToString = (obj: any): string => {
            if (!obj || typeof obj !== 'object') {
                return String(obj);
            }

            let resultString = Object.entries(obj)
                .map(([zone, courts]) => {
                    if (Array.isArray(courts)) {
                        return `${zone}: ${courts.join(', ')}`;
                    }
                    return `${zone}: ${courts}`;
                })
                .join(' | ');

            if (resultString) {
                return resultString + ' | sắp hết giờ, hỏi khách hàng có muốn gia hạn không';
            }
            return resultString;
        };


        const { type, data } = lastMessage;

        switch (type) {
            case 'regular_court_booking_check':
                toast.warning(formatObjectToString(data.zoneCourtObj), {
                    duration: 30000,
                    actionButtonStyle: { backgroundColor: 'transparent' },
                    action: {
                        label: (
                            <div className="bg-primary rounded-lg px-2 py-1 hover:bg-primary-600">
                                Xem chi tiết
                            </div>
                        ),
                        onClick: () => {
                            window.location.href = '/booking-detail';
                        },
                    }
                });
                break;
            case 'test_notification_global':
                toast.info(data.message, {
                    duration: 5000,
                });
                break;
            case 'test_notification_all_employee':
                toast.warning(formatObjectToString(data.zoneCourtObj), {
                    duration: 5000,
                    actionButtonStyle: { backgroundColor: 'transparent' },
                    action: {
                        label: (
                            <div className="bg-primary rounded-lg px-2 py-1 hover:bg-primary-600">
                                Xem chi tiết
                            </div>
                        ),
                        onClick: () => {
                            window.location.href = '/booking-detail';
                        },
                    }
                });
                break;
            default:
                break;
        }
    }, [lastMessage]);

    const value = {
        isConnected,
        lastMessage,
        sendMessage,
    };

    return (
        <WebSocketContext.Provider value={value}>
            {children}
        </WebSocketContext.Provider>
    );
};
