'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useWebSocket } from '@/hooks/useWebSocket';
import { Button } from '@/components/ui/button';
import { getNextAvailableFingerprintId, postEnrollFingerprint } from '@/services/fingerprint_enrollment.service';

type STATUS_VALUE = 'start' | 'loading' | 'success' | 'fail' | 'press_again';

const FingerprintPage = () => {
    const searchParams = useSearchParams();
    const employeeID = searchParams.get('employeeid') || '0';
    const employeeName = searchParams.get('fullname') || '';
    const [status, setStatus] = useState<STATUS_VALUE>('start');
    const [fingerprintId, setFingerprintId] = useState<number | null>(null);

    // WebSocket connection for real-time updates
    const wsNamespace = '/fingerprint';
    const server = process.env.NEXT_PUBLIC_SERVER || 'http://localhost:8000';
    const { isConnected, lastMessage, sendMessage } = useWebSocket(server, wsNamespace);

    // Handle real-time messages from backend
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
        }
    }, [lastMessage, employeeID]);

    useEffect(() => {
        if (isConnected && sendMessage && employeeID) {
            sendMessage('subscribe_employee', { employeeID: parseInt(employeeID) });
        }
    }, [isConnected, sendMessage, employeeID]);

    // Start fingerprint enrollmentsssss
    const startEnrollment = async () => {
        if (status !== 'start') return;

        try {
            // Find next available fingerprint ID
            const fingerprint_response = await getNextAvailableFingerprintId();
            if (!fingerprint_response.ok) {
                throw new Error(fingerprint_response.message || 'Không thể lấy ID vân tay tiếp theo');
            }
            const nextFingerId = fingerprint_response.data;

            setStatus('loading');
            setFingerprintId(nextFingerId);

            // Send enrollment command to ESP8266
            const response = await postEnrollFingerprint({
                employeeID: parseInt(employeeID),
                fingerID: nextFingerId,
            });

            if (!response.ok) {
                throw new Error('Failed to start enrollment');
            }

        } catch (error) {
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
            <span className="text-lg sm:text-xl md-text-2xl lg:text-3xl xl:text-4xl text-center">{`Đăng ký vân tay cho nhân viên ${employeeName} - Mã nhân viên: ${employeeID}`}</span>

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
            )}            {/*Dòng chữ ở dưới hình*/}
            {status === 'start' && (
                <div className="flex flex-col items-center gap-4">
                    <span className="md-text-2xl text-center text-lg sm:text-xl lg:text-3xl xl:text-4xl">
                        Vui lòng đặt ngón trỏ lên thiết bị
                    </span>
                    <Button
                        onClick={startEnrollment}
                        className="px-6 py-3 text-xl"
                        disabled={!isConnected}
                    >
                        {isConnected ? 'Bắt đầu đăng ký' : 'Đang kết nối...'}
                    </Button>
                </div>
            )}
            {status === 'loading' && (
                <span className="md-text-2xl text-center text-lg sm:text-xl lg:text-3xl xl:text-4xl">
                    Đang quét vân tay{dots}
                </span>
            )}
            {status === 'press_again' && (
                <span className="md-text-2xl text-center text-lg sm:text-xl lg:text-3xl xl:text-4xl animate-pulse">
                    Vui lòng nhấc tay ra và đặt lại
                </span>
            )}
            {status === 'success' && (
                <span className="md-text-2xl text-center text-lg sm:text-xl lg:text-3xl xl:text-4xl text-green-600">
                    Đăng ký vân tay thành công với {fingerprintId && (<span>ID vân tay: {fingerprintId}</span>)}
                </span>
            )}
            {status === 'fail' && (
                <span className="md-text-2xl text-center text-lg sm:text-xl lg:text-3xl xl:text-4xl text-red-600">
                    Đăng ký vân tay thất bại, thử lại sau 5 giây
                </span>
            )}
        </div>
    );
};

export default FingerprintPage;
