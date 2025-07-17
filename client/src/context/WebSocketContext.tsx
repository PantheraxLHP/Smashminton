'use client';

import { useAuth } from '@/context/AuthContext';
import { useWebSocket } from '@/hooks/useWebSocket';
import { getServerUrl } from '@/services/server.service';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
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
    const [server, setServer] = useState<string>('');
    useEffect(() => {
        const getServer = async () => {
            const response = await getServerUrl();
            setServer(response);
        };
        getServer();
    }, []);

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
            });
        }
    }, [isConnected, sendMessage, user]);

    // Xử lý notifications
    useEffect(() => {
        if (!lastMessage) return;

        const formatObjectToJSX = (obj: any): React.ReactNode => {
            if (!obj || typeof obj !== 'object') {
                return <span className="text-gray-700">{String(obj)}</span>;
            }

            const entries = Object.entries(obj);
            if (entries.length === 0) {
                return <span className="text-gray-500 italic">Không có dữ liệu</span>;
            }

            return (
                <div className="space-y-2">
                    {entries.map(([zone, courts], index) => (
                        <div key={index} className="flex flex-col space-y-1">
                            <div className="font-semibold text-blue-600">📍 {zone}:</div>
                            <div className="ml-4 space-y-1">
                                {Array.isArray(courts) ? (
                                    courts.map((court, courtIndex) => (
                                        <div key={courtIndex} className="text-gray-700 flex items-center">
                                            <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                                            {court}
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-gray-700 flex items-center">
                                        <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                                        {String(courts)}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    <div className="mt-3 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-r">
                        <div className="flex items-center">
                            <span className="text-yellow-600 mr-2">⏰</span>
                            <span className="text-yellow-800 font-medium">
                                Sắp hết giờ, hỏi khách hàng có muốn gia hạn không ?
                            </span>
                        </div>
                    </div>
                </div>
            );
        };

        const { type, data } = lastMessage;

        switch (type) {
            case 'regular_court_booking_check':
                toast.warning(formatObjectToJSX(data.zoneCourtObj), {
                    duration: 300000,
                    actionButtonStyle: { backgroundColor: 'transparent' },
                    action: {
                        label: (
                            <div className="bg-primary hover:bg-primary-700 text-white rounded-md px-3 py-1.5 transition-colors">
                                📋 Xem chi tiết
                            </div>
                        ),
                        onClick: () => {
                            window.location.href = '/booking-detail';
                        },
                    },
                    position: 'bottom-left',
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

    return <WebSocketContext.Provider value={value}>{children}</WebSocketContext.Provider>;
};
