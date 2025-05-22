'use client';
import { useState, useEffect, useRef } from 'react';
import { Employees } from '@/types/types';
import Image from 'next/image';

type STATUS_VALUE = "start" | "loading" | "success" | "fail";

interface FingerprintPageProps {
    employee: Employees;
}

const FingerprintPage: React.FC<FingerprintPageProps> = ({
    employee,
}) => {
    const [status, setStatus] = useState<STATUS_VALUE>("start");

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

            const resizeObserver = new ResizeObserver(entries => {
                setParentHeight((entries[0].target as HTMLElement).offsetHeight);
            });

            resizeObserver.observe(parentRef.current);
            return () => resizeObserver.disconnect();
        }
    }, []);

    const [dots, setDots] = useState('');
    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prev => {
                if (prev === '') return '.';
                if (prev === '.') return '..';
                if (prev === '..') return '...';
                return '';
            });
        }, 500);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center h-screen w-full gap-5">
            {/* <span className="text-lg sm:text-xl md-text-2xl lg:text-3xl xl:text-4xl text-center">{`Đăng ký vân tay cho nhân viên ${employee.accounts?.fullname} - Mã nhân viên: ${employee.employeeid}`}</span> */}
            <span className="text-lg sm:text-xl md-text-2xl lg:text-3xl xl:text-4xl text-center">{`Đăng ký vân tay cho nhân viên TEST - Mã nhân viên: tester01`}</span>

            {(status === "start" || status === "loading") && (
                <div
                    ref={parentRef}
                    className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl aspect-square"
                >
                    {status === "loading" && (
                        <div
                            className="absolute inset-0 h-3 w-full bg-primary transition-all duration-2500 animate-pulse"
                            style={{
                                transform: isUp
                                    ? 'translateY(0)'
                                    : `translateY(${parentHeight - 12}px)`
                            }}
                        ></div>
                    )}
                    <Image
                        src="/fingerprint_start_scan.png"
                        alt="Fingerprint start scanning"
                        fill
                        className={`object-contain ${status === "loading" ? "animate-pulse" : ""} `}
                    />
                </div>
            )}
            {status === "success" && (
                <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl aspect-square">
                    <Image
                        src="/fingerprint_success.png"
                        alt="Fingerprint success"
                        fill
                        className={`object-contain`}
                    />
                </div>
            )}
            {status === "fail" && (
                <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl aspect-square">
                    <Image
                        src="/fingerprint_fail.png"
                        alt="Fingerprint fail"
                        fill
                        className={`object-contain`}
                    />
                </div>
            )}

            {status === "start" && (
                <span className="text-lg sm:text-xl md-text-2xl lg:text-3xl xl:text-4xl text-center">Vui lòng đặt ngón trỏ lên thiết bị</span>
            )}
            {status === "loading" && (
                <span className="text-lg sm:text-xl md-text-2xl lg:text-3xl xl:text-4xl text-center">Đang quét vân tay{dots}</span>
            )}
            {status === "success" && (
                <span className="text-lg sm:text-xl md-text-2xl lg:text-3xl xl:text-4xl text-center">Đăng ký vân tay thành công</span>
            )}
            {status === "fail" && (
                <span className="text-lg sm:text-xl md-text-2xl lg:text-3xl xl:text-4xl text-center">Đăng ký vân tay thất bại, thử lại sau 5 giây</span>
            )}
        </div >
    );
}

export default FingerprintPage;