'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useWebSocketContext } from '@/context/WebSocketContext';
import { Button } from '@/components/ui/button';
import { postEnrollFingerprint } from '@/services/fingerprint_enrollment.service';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { parse } from 'path';

type STATUS_VALUE = 'start' | 'loading' | 'success' | 'fail' | 'press_again';

const FingerprintPage = () => {
    const searchParams = useSearchParams();
    const { user } = useAuth();
    const employeeID = searchParams.get('employeeid') || '0';
    const employeeName = searchParams.get('fullname') || '';
    const [status, setStatus] = useState<STATUS_VALUE>('start');
    const [fingerprintId, setFingerprintId] = useState<number | null>(null);

    const { isConnected, lastMessage, sendMessage } = useWebSocketContext();

    // Handle fingerprint-specific messages only
    useEffect(() => {
        if (!lastMessage) {
            return;
        }

        const { type, data } = lastMessage;

        switch (type) {
            case 'enroll_started':
                if (data.employeeID === parseInt(employeeID)) {
                    setStatus('loading');
                    setFingerprintId(data.fingerID);
                }
                break;
            case 'enroll_step':
                if (data.employeeID === parseInt(employeeID)) {
                    if (data.step === 'remove_finger') {
                        setStatus('press_again');
                    } else if (data.step === 'place_again') {
                        setStatus('loading');
                    }
                }
                break;
            case 'enroll_success':
                if (data.employeeID === parseInt(employeeID)) {
                    setStatus('success');
                    setTimeout(() => {
                        setStatus('start');
                        setFingerprintId(null);
                    }, 3000);
                }
                break;
            case 'enroll_failure':
                if (data.employeeID === parseInt(employeeID)) {
                    setStatus('fail');
                    setTimeout(() => {
                        setStatus('start');
                        setFingerprintId(null);
                    }, 5000);
                }
                break;
            default:
                break;
        }
    }, [lastMessage, employeeID]);

    useEffect(() => {
        if (isConnected && sendMessage && user && user.role && user.accountid) {
            sendMessage('subscribe_employee', { roomID: user.accountid });
        }
    }, [isConnected, sendMessage, user]);

    // Start fingerprint enrollmentsssss
    const startEnrollment = async () => {
        if (status !== 'start') return;

        try {
            setStatus('loading');

            // Send enrollment command to ESP8266
            const response = await postEnrollFingerprint({
                roomID: user?.accountid || parseInt(employeeID),
                employeeID: parseInt(employeeID),
            });

            if (!response.ok) {
                throw new Error('Failed to start enrollment');
            }

        } catch (error) {
            toast.error('Đăng ký vân tay thất bại, vui lòng thử lại sau');
            setStatus('fail');
            setTimeout(() => setStatus('start'), 5000);
        }
    };

    const [isUp, setIsUp] = useState(false);
    useEffect(() => {
        const interval = setInterval(() => {
            setIsUp((prev) => !prev);
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    const [parentHeight, setParentHeight] = useState(0);
    const parentRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (parentRef.current) {
            setParentHeight(parentRef.current.offsetHeight);

            const resizeObserver = new ResizeObserver((entries) => {
                setParentHeight((entries[0].target as HTMLElement).offsetHeight);
            });

            resizeObserver.observe(parentRef.current);
            return () => resizeObserver.disconnect();
        }
    }, []);

    const [dots, setDots] = useState('');
    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prev) => {
                if (prev === '') return '.';
                if (prev === '.') return '..';
                if (prev === '..') return '...';
                return '';
            });
        }, 500);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex h-screen w-full flex-col items-center justify-center gap-5">
            {/*Dòng chữ hiển thị tên và mã nhân viên đang thực hiện đăng ký vân tay*/}
            <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-center">{`Đăng ký vân tay cho nhân viên ${employeeName} - Mã nhân viên: ${employeeID}`}</span>

            {/* Hiển thị hình ảnh tương ứng với trạng thái */}
            {(status === 'start' || status === 'loading' || status === 'press_again') && (
                <div
                    ref={parentRef}
                    className="relative aspect-square w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl"
                >
                    {(status === 'loading' || status === 'press_again') && (
                        <div
                            className="bg-primary absolute inset-0 h-3 w-full animate-pulse transition-all duration-2500"
                            style={{
                                transform: isUp ? 'translateY(0)' : `translateY(${parentHeight - 12}px)`,
                            }}
                        ></div>
                    )}
                    <Image
                        src="/fingerprint_start_scan.png"
                        alt="Fingerprint start scanning"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className={`object-contain ${status === 'loading' ? 'animate-pulse' : ''} `}
                    />
                </div>
            )}
            {status === 'success' && (
                <div className="relative aspect-square w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
                    <Image
                        src="/fingerprint_success.png"
                        alt="Fingerprint success"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className={`object-contain`}
                    />
                </div>
            )}
            {status === 'fail' && (
                <div className="relative aspect-square w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
                    <Image
                        src="/fingerprint_fail.png"
                        alt="Fingerprint fail"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className={`object-contain`}
                    />
                </div>
            )}

            {/*Dòng chữ ở dưới hình*/}
            {status === 'start' && (
                <div className="flex flex-col items-center gap-4">
                    <span className="md:text-2xl text-center text-lg sm:text-xl lg:text-3xl xl:text-4xl">
                        Nhấn nút đăng ký bên dưới để bắt đầu đăng ký vân tay và thực hiện theo hướng dẫn
                    </span>
                    <Button
                        onClick={startEnrollment}
                        className="px-6 py-3 text-xl"
                        disabled={!isConnected}
                    >
                        {isConnected ? 'Bắt đầu đăng ký' : 'Đang kết nối...'}
                    </Button>
                    <span className="text-2xl text-red-500">
                        Lưu ý: Sẽ xóa vân tay cũ nếu đã đăng ký trước đó
                    </span>
                </div>
            )}
            {status === 'loading' && (
                <span className="md:text-2xl text-center text-lg sm:text-xl lg:text-3xl xl:text-4xl">
                    Vui lòng đặt ngón tay lên thiết bị{dots}
                </span>
            )}
            {status === 'press_again' && (
                <span className="md:text-2xl text-center text-lg sm:text-xl lg:text-3xl xl:text-4xl animate-pulse">
                    Vui lòng nhấc ngón tay ra và đặt lại sau khi nghe âm thanh thông báo
                </span>
            )}
            {status === 'success' && (
                <div className="flex flex-col items-center gap-4">
                    <span className="md:text-2xl text-center text-lg sm:text-xl lg:text-3xl xl:text-4xl text-primary-600">
                        Đăng ký vân tay thành công với {fingerprintId && (<span>ID vân tay: {fingerprintId}</span>)}
                    </span>
                    <span className="text-2xl text-primary-600">
                        Quay lại màn hình đăng ký vân tay sau 3 giây
                    </span>
                </div>
            )}
            {status === 'fail' && (
                <span className="md:text-2xl text-center text-lg sm:text-xl lg:text-3xl xl:text-4xl text-red-600">
                    Đăng ký vân tay thất bại, thử lại sau 5 giây
                </span>
            )}
        </div>
    );
};

export default FingerprintPage;