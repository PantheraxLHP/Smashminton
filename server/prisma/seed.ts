import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding...');
  // Resetting data
  await prisma.shift_assignment.deleteMany({});
  await prisma.shift_enrollment.deleteMany({});
  await prisma.shift_date.deleteMany({});
  await prisma.shift.deleteMany({});
  await prisma.bank_detail.deleteMany({});
  await prisma.customer.deleteMany({});
  await prisma.employee.deleteMany({});
  await prisma.account.deleteMany({});
  await prisma.penalty_rules.deleteMany({});
  // Seeding accounts
  await prisma.account.createMany({
    data: [
      {
        username: 'employee1',
        password: 'pass1',
        status: 'Active',
        fullname: 'Nguyen Van A',
        email: 'a@example.com',
        dob: new Date('1990-01-01'),
        gender: 'Male',
        phonenumber: '0987654321',
        address: 'Hanoi',
      },
      {
        username: 'employee2',
        password: 'pass2',
        status: 'Inactive',
        fullname: 'Tran Thi B',
        email: 'b@example.com',
        dob: new Date('1995-05-10'),
        gender: 'Female',
        phonenumber: '0987123456',
        address: 'HCM',
      },
      {
        username: 'employee3',
        password: 'pass3',
        status: 'Active',
        fullname: 'Le Van C',
        email: 'c@example.com',
        dob: new Date('1988-07-15'),
        gender: 'Male',
        phonenumber: '0987234567',
        address: 'Da Nang',
      },
      {
        username: 'employee4',
        password: 'pass4',
        status: 'Active',
        fullname: 'Pham Thi D',
        email: 'd@example.com',
        dob: new Date('1992-09-20'),
        gender: 'Female',
        phonenumber: '0987345678',
        address: 'Can Tho',
      },
      {
        username: 'employee5',
        password: 'pass5',
        status: 'Inactive',
        fullname: 'Hoang Van E',
        email: 'e@example.com',
        dob: new Date('1985-03-25'),
        gender: 'Male',
        phonenumber: '0987456789',
        address: 'Hai Phong',
      },
      {
        username: 'customer1',
        password: 'pass6',
        status: 'Active',
        fullname: 'Nguyen Van F',
        email: 'f@example.com',
        dob: new Date('1993-06-15'),
        gender: 'Male',
        phonenumber: '0987567890',
        address: 'Hue',
      },
      {
        username: 'customer2',
        password: 'pass7',
        status: 'Active',
        fullname: 'Tran Thi G',
        email: 'g@example.com',
        dob: new Date('1997-08-22'),
        gender: 'Female',
        phonenumber: '0987678901',
        address: 'Vinh',
      },
    ],
  });

  // Seeding employees
  await prisma.employee.createMany({
    data: [
      { employeeid: 1, fingerprintid: 101, employee_type: 'Full-time' },
      { employeeid: 2, fingerprintid: 102, employee_type: 'Part-time' },
      { employeeid: 3, fingerprintid: 103, employee_type: 'Full-time' },
      { employeeid: 4, fingerprintid: 104, employee_type: 'Part-time' },
      { employeeid: 5, fingerprintid: 105, employee_type: 'Full-time' },
    ],
  });

  // Seeding customers
  await prisma.customer.createMany({
    data: [
      { customerid: 6, totalpurchase: 1000000 },
      { customerid: 7, totalpurchase: 200000 },
    ],
  });

  // Seeding bank details
  await prisma.bank_detail.createMany({
    data: [
      {
        bankdetailid: 1,
        bankname: 'Bank A',
        banknumber: '123456789',
        employeeid: 1,
      },
      {
        bankdetailid: 2,
        bankname: 'Bank B',
        banknumber: '987654321',
        employeeid: 2,
      },
      {
        bankdetailid: 3,
        bankname: 'Bank C',
        banknumber: '567890123',
        employeeid: 3,
      },
    ],
  });

  // Seeding shifts
  await prisma.shift.createMany({
    data: [
      {
        shiftid: 1,
        shiftstarthour: '08:00:00',
        shiftendhour: '12:00:00',
        shifttype: 'Morning',
      },
      {
        shiftid: 2,
        shiftstarthour: '13:00:00',
        shiftendhour: '17:00:00',
        shifttype: 'Afternoon',
      },
      {
        shiftid: 3,
        shiftstarthour: '18:00:00',
        shiftendhour: '22:00:00',
        shifttype: 'Evening',
      },
    ],
  });

  // Seeding shift dates
  await prisma.shift_date.createMany({
    data: [
      { shiftid: 1, shiftdate: new Date('2024-03-10') },
      { shiftid: 2, shiftdate: new Date('2024-03-11') },
      { shiftid: 3, shiftdate: new Date('2024-03-12') },
    ],
  });

  // Seeding shift enrollments
  await prisma.shift_enrollment.createMany({
    data: [
      { employeeid: 1, shiftid: 1, shiftdate: new Date('2024-03-10') },
      { employeeid: 2, shiftid: 2, shiftdate: new Date('2024-03-11') },
      { employeeid: 3, shiftid: 3, shiftdate: new Date('2024-03-12') },
      { employeeid: 4, shiftid: 1, shiftdate: new Date('2024-03-10') },
      { employeeid: 5, shiftid: 2, shiftdate: new Date('2024-03-11') },
    ],
  });

  // Seeding shift assignments
  await prisma.shift_assignment.createMany({
    data: [
      { employeeid: 1, shiftid: 1, shiftdate: new Date('2024-03-10') },
      { employeeid: 2, shiftid: 2, shiftdate: new Date('2024-03-11') },
      { employeeid: 3, shiftid: 3, shiftdate: new Date('2024-03-12') },
    ],
  });

  // Seeding penalty rules
  await prisma.penalty_rules.createMany({
    data: [
      { penaltyruleid: 1, penaltyname: 'Late Arrival', basepenalty: 50000 },
      { penaltyruleid: 2, penaltyname: 'Absent', basepenalty: 100000 },
      { penaltyruleid: 3, penaltyname: 'Early Leave', basepenalty: 30000 },
    ],
  });

  console.log(`🌱 Database has been seeded`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
