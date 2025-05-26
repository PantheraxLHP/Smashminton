'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

type STATUS_VALUE = 'start' | 'loading' | 'success' | 'fail';

const FingerprintPage: React.FC = () => {
    const [status, setStatus] = useState<STATUS_VALUE>('start');

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
            {/* <span className="text-lg sm:text-xl md-text-2xl lg:text-3xl xl:text-4xl text-center">{`Đăng ký vân tay cho nhân viên ${employee.accounts?.fullname} - Mã nhân viên: ${employee.employeeid}`}</span> */}
            <span className="md-text-2xl text-center text-lg sm:text-xl lg:text-3xl xl:text-4xl">{`Đăng ký vân tay cho nhân viên TEST - Mã nhân viên: tester01`}</span>

            {/* Hiển thị hình ảnh tương ứng với trạng thái */}
            {(status === 'start' || status === 'loading') && (
                <div
                    ref={parentRef}
                    className="relative aspect-square w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl"
                >
                    {status === 'loading' && (
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
                <span className="md-text-2xl text-center text-lg sm:text-xl lg:text-3xl xl:text-4xl">
                    Vui lòng đặt ngón trỏ lên thiết bị
                </span>
            )}
            {status === 'loading' && (
                <span className="md-text-2xl text-center text-lg sm:text-xl lg:text-3xl xl:text-4xl">
                    Đang quét vân tay{dots}
                </span>
            )}
            {status === 'success' && (
                <span className="md-text-2xl text-center text-lg sm:text-xl lg:text-3xl xl:text-4xl">
                    Đăng ký vân tay thành công
                </span>
            )}
            {status === 'fail' && (
                <span className="md-text-2xl text-center text-lg sm:text-xl lg:text-3xl xl:text-4xl">
                    Đăng ký vân tay thất bại, thử lại sau 5 giây
                </span>
            )}
        </div>
    );
};

export default FingerprintPage;
