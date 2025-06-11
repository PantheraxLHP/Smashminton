'use client';

import { useParams, notFound, useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { startOfWeek, endOfWeek, getWeek } from 'date-fns';
import { DateRange } from 'react-day-picker';
import ShiftFilter from '@/components/shiftAssignment/ShiftFilter';
import AssignmentCalendar from '@/components/shiftAssignment/AssignmentCalendar';
import PersonalShift from '@/components/shiftAssignment/PersonalShift';
import { useAuth } from '@/context/AuthContext';
import { ShiftAssignment, ShiftEnrollment, ShiftDate } from '@/types/types';
import { getShiftDate } from '@/services/shiftdate.service';

const VALID_TYPES = ['enrollments', 'assignments'];

const ShiftAssignmentPage = () => {
    const { type } = useParams();
    if (!VALID_TYPES.includes(type as string)) {
        notFound();
    }

    const router = useRouter();

    const today = new Date();
    const [selectedWeek, setSelectedWeek] = useState<DateRange>({
        from: startOfWeek(today, { weekStartsOn: 1 }),
        to: endOfWeek(today, { weekStartsOn: 1 }),
    });
    const [weekNumber, setWeekNumber] = useState<number>(getWeek(today, { weekStartsOn: 1 }));
    const [year, setYear] = useState<number>(today.getFullYear());
    const [selectedRadio, setSelectedRadio] = useState<string>('fulltime');
    const { user, setUser } = useAuth();
    const [shiftData, setShiftData] = useState<ShiftDate[] | ShiftAssignment[] | ShiftEnrollment[]>([]);
    const [personalShift, setPersonalShift] = useState<ShiftAssignment[] | ShiftEnrollment[]>([]);

    const getRoleToEmployeeType = (role: string): string => {
        const roleToEmployeeTypeMap: Record<string, string> = {
            employee: 'Part-time',
            wh_manager: 'Full-time',
            hr_manager: 'Full-time',
        };
        return roleToEmployeeTypeMap[role] || '';
    };

    useEffect(() => {
        const fetchShiftDate = async () => {
            if (selectedWeek.from && selectedWeek.to && user?.role) {
                try {
                    const employeeType = getRoleToEmployeeType(user.role);
                    const response = await getShiftDate(selectedWeek.from, selectedWeek.to, employeeType);
                    if (response.ok) {
                        setShiftData(response.data as ShiftDate[] | ShiftAssignment[] | ShiftEnrollment[]);
                    } else {
                        console.error('Error fetching shift data:', response.message || 'Unknown error occurred');
                    }
                } catch (error) {
                    console.error('Failed to fetch shift data:', error);
                }
            }
        };
        fetchShiftDate();
    }, [selectedWeek, user]);

    const fetchData = useCallback(
        (userRole: string, pageType: string, radioValue: string) => {
            if (pageType === 'enrollments') {
                if (userRole === 'employee') {
                    setPersonalShift(shiftData as ShiftAssignment[] | ShiftEnrollment[]);

                    if (radioValue === 'assignable') {
                        setShiftData(shiftData as ShiftDate[] | ShiftAssignment[] | ShiftEnrollment[]);
                    } else if (radioValue === 'assigned') {
                        setShiftData(shiftData as ShiftDate[] | ShiftAssignment[] | ShiftEnrollment[]);
                    }
                }
            } else if (pageType === 'assignments') {
                if (userRole === 'hr_manager') {
                    setShiftData(shiftData as ShiftDate[] | ShiftAssignment[] | ShiftEnrollment[]);
                } else if (userRole === 'wh_manager') {
                    setPersonalShift(shiftData as ShiftAssignment[] | ShiftEnrollment[]);
                    setShiftData(shiftData as ShiftDate[] | ShiftAssignment[] | ShiftEnrollment[]);
                } else if (userRole === 'employee') {
                    setPersonalShift(shiftData as ShiftAssignment[] | ShiftEnrollment[]);
                    setShiftData(shiftData as ShiftDate[] | ShiftAssignment[] | ShiftEnrollment[]);
                }
            }
        },
        [shiftData],
    );

    useEffect(() => {
        if (!user) {
            const localUser = {
                accountid: 9999,
                sub: 9999,
                username: 'testing',
                accounttype: 'testing',
                role: 'hr_manager',
            };
            setUser(localUser);
            // ! router.push("/signin");
            return;
        }

        if (type === 'enrollments' && (user.role === 'wh_manager' || user.role === 'hr_manager')) {
            router.push('/assignments');
            return;
        }

        if (type === 'enrollments' && user.role === 'employee') {
            setSelectedRadio('assignable');
        } else if (type === 'assignments' && user.role === 'hr_manager') {
            setSelectedRadio('fulltime');
        }

        fetchData(user.role as string, type as string, selectedRadio);
    }, [user, type, router]);

    useEffect(() => {
        if (user) {
            fetchData(user.role as string, type as string, selectedRadio);
        }
    }, [selectedRadio, user, type]);

    return (
        <div className="flex h-[95vh] w-full flex-col items-center justify-center gap-5 p-4 sm:flex-row sm:items-start">
            <div className="flex h-fit items-center gap-2 sm:h-full sm:flex-col">
                <ShiftFilter
                    selectedWeek={selectedWeek}
                    setSelectedWeek={setSelectedWeek}
                    weekNumber={weekNumber}
                    setWeekNumber={setWeekNumber}
                    year={year}
                    setYear={setYear}
                    selectedRadio={selectedRadio}
                    onRadioChange={setSelectedRadio}
                    role={user?.role}
                    type={type as 'enrollments' | 'assignments'}
                />
                <PersonalShift
                    role={user?.role}
                    type={type as 'enrollments' | 'assignments'}
                    personalShift={personalShift}
                />
            </div>
            <AssignmentCalendar
                selectedWeek={selectedWeek}
                weekNumber={weekNumber}
                year={year}
                selectedRadio={selectedRadio}
                role={user?.role}
                type={type as 'enrollments' | 'assignments'}
                shiftData={shiftData}
            />
        </div>
    );
};

export default ShiftAssignmentPage;
