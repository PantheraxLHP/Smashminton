import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CustomerService } from '../customers/customers.service';
import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { EmployeesService } from '../employees/employees.service';
import { StudentCardService } from '../student_card/student_card.service';
import { TesseractOcrService } from '../tesseract-ocr/tesseract-ocr.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CacheService } from '../cache/cache.service';
import { Accounts } from 'src/interfaces/accounts.interface';
import { ChangePasswordDto } from './dto/change-password.dto';
@Injectable()
export class AccountsService {
    constructor(
        private prisma: PrismaService,
        private customerService: CustomerService,
        private employeeService: EmployeesService,
        private studentCardService: StudentCardService,
        private tesseractOcrService: TesseractOcrService,
        private cloudinaryService: CloudinaryService,
        private cacheService: CacheService,
    ) {}

    //CRUD operations
    async createCustomer(createAccountDto: CreateAccountDto, files: Express.Multer.File[]): Promise<any> {
        const data = createAccountDto;

        // Kiểm tra username đã tồn tại
        const user = await this.prisma.accounts.findFirst({
            where: { username: data.username },
        });
        if (user) {
            throw new BadRequestException('Username already existed');
        }

        // Kiểm tra email đã tồn tại
        const email = await this.prisma.accounts.findFirst({
            where: { email: data.email },
        });
        if (email) {
            throw new BadRequestException('Email already existed');
        }

        if (data.phonenumber) {
            const phone = await this.prisma.accounts.findFirst({
                where: { phonenumber: data.phonenumber },
            });
            if (phone) {
                throw new BadRequestException('Số điện thoại đã tồn tại');
            }
        }

        // Kiểm tra mật khẩu
        if (data.password !== data.repassword) {
            throw new BadRequestException('Password not match');
        }

        // Hash mật khẩu
        const password: string = data.password;
        const hashPassword = await bcrypt.hash(password, 10);

        // Tạo tài khoản
        const account = await this.prisma.accounts.create({
            data: {
                username: data.username,
                password: hashPassword,
                fullname: data.fullname,
                email: data.email,
                dob: data.dob,
                phonenumber: data.phonenumber,
                address: data.address,
                status: 'Active',
                accounttype: 'Customer',
            },
        });

        // Tạo khách hàng
        const customer = await this.customerService.create(account.accountid);

        // Nếu không có student card, trả về kết quả
        if (!files || files.length === 0) {
            return { account, customer };
        }

        // Nếu có student card, thực hiện OCR
        const ocrResults = await Promise.all(
            files.map(async (file) => {
                return await this.tesseractOcrService.parseImage(file.buffer);
            }),
        );

        // Lấy phần tử đầu tiên có đủ cả 3 trường
        const validResult = ocrResults.find((ocrData) => {
            return ocrData.university !== '' && ocrData.id !== '' && ocrData.expiryYear !== '';
        });

        if (validResult === undefined) {
            return { account, customer, studentCard: false };
        }

        // Lưu thông tin OCR hợp lệ vào database (chỉ 1 bản ghi)
        if (validResult) {
            const studnetid = await this.prisma.student_card.findFirst({
                where: {
                    studentid: validResult.id,
                },
            });
            if (!studnetid) {
                await this.studentCardService.createStudentCard({
                    studentcardid: account.accountid,
                    schoolname: validResult.university,
                    studentid: validResult.id,
                    studyperiod: validResult.expiryYear,
                });
            } else {
                throw new BadRequestException('Thẻ học sinh/sinh viên đã tồn tại');
            }
        }
        // Trả về kết quả cuối cùng
        return { account, customer, studentCard: validResult };
    }

    findAll() {
        return this.prisma.accounts.findMany();
    }

    async findOne(id: number) {
        const account = await this.prisma.accounts.findUnique({ where: { accountid: id } });
        if (!account) return null;
        if (account.accounttype === 'Customer') {
            const studentCard = await this.prisma.student_card.findUnique({ where: { studentcardid: id } });

            if (studentCard) {
                const currentDate = new Date();
                const studyPeriod = studentCard.studyperiod;
                if (studyPeriod && studyPeriod < currentDate) {
                    return account;
                }
            }
            return { ...account, studentCard };
        }
        return account;
    }

    findByUsername(username: string) {
        return this.prisma.accounts.findFirst({
            where: { username: username },
        });
    }
    findRoleByEmployeeId(employeeId: number) {
        return this.employeeService.getEmployeeRoles(employeeId);
    }
    async update(id: number, updateAccountDto: UpdateAccountDto, file: Express.Multer.File): Promise<any> {
        try {
            const existingAccount = await this.prisma.accounts.findUnique({ where: { accountid: id } });
            if (!existingAccount) {
                throw new BadRequestException('Account not found');
            }

            if (updateAccountDto.phonenumber) {
                const phone = await this.prisma.accounts.findFirst({
                    where: { phonenumber: updateAccountDto.phonenumber },
                });
                if (phone && phone.accountid !== id) {
                    throw new BadRequestException('Số điện thoại đã tồn tại');
                }
            }

            let url_avatar: string = existingAccount.avatarurl || '';
            if (file) {
                // If files are provided, upload them to Cloudinary
                const uploadResults = await this.cloudinaryService.uploadAvatar(file); // Changed to handle multiple files
                url_avatar = uploadResults.secure_url || '';
                if (!url_avatar) {
                    throw new BadRequestException('Failed to upload files');
                }
            }
            // Map updateAccountDto into a variable named updatedInfo with data type Accounts
            const updatedInfo: Accounts = {
                ...updateAccountDto,
                avatarurl: url_avatar,
            };

            // Update account details in the database
            const updatedAccount = await this.prisma.accounts.update({
                where: { accountid: id },
                data: updatedInfo,
            });

            if (!updatedAccount) {
                throw new BadRequestException('Failed to update account');
            }

            return updatedAccount;
        } catch (error) {
            throw new BadRequestException('Failed to update account');
        }
    }

    remove(id: number) {
        return this.prisma.accounts.delete({ where: { accountid: id } });
    }

    async checkStudentCustomer(customerId: number): Promise<boolean> {
        const studentCard = await this.prisma.student_card.findUnique({
            where: { studentcardid: customerId },
        });

        if (studentCard) {
            const currentDate = new Date();
            const studyPeriod = studentCard.studyperiod;

            if (studyPeriod && studyPeriod < currentDate) {
                return false;
            }
        }

        return studentCard ? true : false;
    }

    async changePassword(accountId: number, changePassword: ChangePasswordDto): Promise<any> {
        const account = await this.findOne(accountId);
        if (!account) {
            throw new BadRequestException('Account not found');
        }

        if (changePassword.newPassword !== changePassword.confirmPassword) {
            throw new BadRequestException('New password and confirm password do not match');
        }
        // Hash the new password
        const hashedPassword = await bcrypt.hash(changePassword.newPassword, 10);

        // Update the password in the database
        const updatedAccount = await this.prisma.accounts.update({
            where: { accountid: accountId },
            data: {
                password: hashedPassword,
            },
        });

        return updatedAccount;
    }

    async updateStudentCard(accountId: number, files: Express.Multer.File[]): Promise<any> {
        // Kiểm tra account tồn tại
        const existingAccount = await this.prisma.accounts.findUnique({
            where: { accountid: accountId },
        });

        if (!existingAccount) {
            throw new BadRequestException('Account not found');
        }

        // Nếu không có files, trả về thông tin hiện tại
        if (!files || files.length === 0) {
            return this.findOne(accountId);
        }

        // Thực hiện OCR
        const ocrResults = await Promise.all(
            files.map(async (file) => {
                return await this.tesseractOcrService.parseImage(file.buffer);
            }),
        );

        // Lấy phần tử đầu tiên có đủ cả 3 trường
        const validResult = ocrResults.find((ocrData) => {
            return ocrData.university !== '' && ocrData.id !== '' && ocrData.expiryYear !== '';
        });

        if (validResult === undefined) {
            // Trả về kết quả từ findOne với thông tin URLs
            const accountInfo = await this.findOne(accountId);
            return accountInfo;
        }

        // Check if another student card exists with the same studentid (excluding current account)
        const duplicateStudentCard = await this.prisma.student_card.findFirst({
            where: {
                studentid: validResult.id,
                NOT: {
                    studentcardid: accountId, // Exclude current account's student card
                },
            },
        });

        if (duplicateStudentCard) {
            throw new BadRequestException('Student card already exists');
        }

        // Lưu thông tin OCR hợp lệ vào database - use upsert for create or update
        if (validResult) {
            const expireDate = new Date(Number(validResult.expiryYear), 11, 31, 23, 59, 59);

            await this.prisma.student_card.upsert({
                where: { studentcardid: accountId },
                update: {
                    schoolname: validResult.university,
                    studentid: validResult.id,
                    studyperiod: expireDate,
                },
                create: {
                    studentcardid: accountId,
                    schoolname: validResult.university,
                    studentid: validResult.id,
                    studyperiod: expireDate,
                },
            });
        }

        // Trả về kết quả từ findOne (sẽ bao gồm student card mới/cập nhật)
        const updatedAccountInfo = await this.findOne(accountId);
        return updatedAccountInfo;
    }

    async findByEmail(email: string) {
        return this.prisma.accounts.findFirst({
            where: { email: email },
        });
    }

    async updatePassword(accountId: number, newPassword: string) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        return this.prisma.accounts.update({
            where: { accountid: accountId },
            data: { password: hashedPassword },
        });
    }
}
