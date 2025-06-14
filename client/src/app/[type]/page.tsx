'use client';

import AssignmentCalendar from '@/components/shiftAssignment/AssignmentCalendar';
import PersonalShift from '@/components/shiftAssignment/PersonalShift';
import ShiftFilter from '@/components/shiftAssignment/ShiftFilter';
import { useAuth } from '@/context/AuthContext';
import { getPartTimeShiftEnrollment, getShiftDate, getShiftDateEmployee } from '@/services/shiftdate.service';
import { ShiftAssignment, ShiftDate, ShiftEnrollment } from '@/types/types';
import { endOfWeek, getWeek, startOfWeek } from 'date-fns';
import { notFound, useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';

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
    const { user } = useAuth();
    const [shiftData, setShiftData] = useState<ShiftDate[] | ShiftEnrollment[] | ShiftAssignment[]>([]);
    const [personalShift, setPersonalShift] = useState<ShiftEnrollment[] | ShiftAssignment[]>([]);
    const [fullTimeOption, setFullTimeOption] = useState<string>('same');
    const [partTimeOption, setPartTimeOption] = useState<string>('0');
    const [refreshData, setRefreshData] = useState(() => () => {});

    const formatEmployeeType = (selectedRadio: string | undefined) => {
        if (selectedRadio === 'fulltime') {
            return 'Full-time';
        } else if (selectedRadio === 'parttime') {
            return 'Part-time';
        }
    };

    useEffect(() => {
        if (type === 'enrollments' && (user?.role === 'wh_manager' || user?.role === 'hr_manager')) {
            router.push('/assignments');
            return;
        }

        if (type === 'enrollments' && user?.role === 'employee') {
            setSelectedRadio('assignable');
        } else if (type === 'assignments' && user?.role === 'hr_manager') {
            setSelectedRadio('fulltime');
        }
    }, [type, user, router]);

    const fetchShiftDate = async () => {
        if (selectedWeek.from && selectedWeek.to && user?.role) {
            try {
                const response = await getShiftDate(
                    selectedWeek.from,
                    selectedWeek.to,
                    formatEmployeeType(selectedRadio) || '',
                );

                if (response.ok) {
                    setShiftData(response.data as ShiftDate[]);
                    setPersonalShift(response.data.assignments || []);
                } else {
                    console.error('Error fetching shift data:', response.message || 'Unknown error occurred');
                }
            } catch (error) {
                console.error('Failed to fetch shift data:', error);
            }
        }
    };

    const fetchShiftDateEmployee = async () => {
        if (selectedWeek.from && selectedWeek.to && user?.role) {
            try {
                const response = await getShiftDateEmployee(user?.accountid, selectedWeek.from, selectedWeek.to);
                if (response.ok) {
                    setShiftData(response.data as ShiftAssignment[]);
                    setPersonalShift(response.data as ShiftAssignment[]);
                } else {
                    console.error('Error fetching shift data:', response.message || 'Unknown error occurred');
                }
            } catch (error) {
                console.error('Failed to fetch shift data:', error);
            }
        }
    };

    const fetchPartTimeShiftEnrollment = async () => {
        if (selectedWeek.from && selectedWeek.to && user?.role) {
            if (selectedRadio === 'enrolled') {
                const response = await getPartTimeShiftEnrollment(
                    selectedWeek.from,
                    selectedWeek.to,
                    'enrolled',
                    user?.accountid,
                );
                if (response.ok) {
                    setShiftData(response.data as ShiftEnrollment[]);
                    setPersonalShift(response.data as ShiftEnrollment[]);
                } else {
                    console.error('Error fetching shift data:', response.message || 'Unknown error occurred');
                }
            } else if (selectedRadio === 'unenrolled') {
                const response = await getPartTimeShiftEnrollment(
                    selectedWeek.from,
                    selectedWeek.to,
                    'unenrolled',
                    user?.accountid,
                );
                if (response.ok) {
                    setShiftData(response.data as ShiftDate[]);
                    setPersonalShift(response.data as ShiftEnrollment[]);
                } else {
                    console.error('Error fetching shift data:', response.message || 'Unknown error occurred');
                }
            }
        }
    };

    useEffect(() => {
        if (user?.role === 'hr_manager') {
            fetchShiftDate();
            setRefreshData(() => fetchShiftDate);
        } else if (type === 'enrollments') {
            fetchPartTimeShiftEnrollment();
            setRefreshData(() => fetchPartTimeShiftEnrollment);
        } else {
            fetchShiftDateEmployee();
            setRefreshData(() => fetchShiftDateEmployee);
        }
    }, [selectedWeek, user, selectedRadio, type]);

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
                    fullTimeOption={fullTimeOption}
                    setFullTimeOption={setFullTimeOption}
                    partTimeOption={partTimeOption}
                    setPartTimeOption={setPartTimeOption}
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
                shiftData={shiftData || []}
                onDataChanged={refreshData}
            />
        </div>
    );
};

export default ShiftAssignmentPage;
