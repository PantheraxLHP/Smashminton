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
    ) { }

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


        // Kiểm tra các JSON trong ocrResults
        const validResults = ocrResults.filter((ocrData) => {
            // Kiểm tra nếu tất cả 3 trường đều không rỗng
            return ocrData.university !== '' && ocrData.id !== '' && ocrData.expiryYear !== '';
        });

        if (validResults.length === 0) {
            // Nếu không có JSON nào hợp lệ, upload tất cả các file lên Cloudinary
            const results = await Promise.all(
                files.map((file) => this.cloudinaryService.uploadFiles(file)),
            );

            /// Lấy danh sách URL từ kết quả upload và chuyển đổi thành object
            const urlsObject = results.reduce((acc: Record<string, string>, result, index) => {
                const typedResult = result as { secure_url: string };
                acc[`img${index + 1}`] = typedResult.secure_url;
                return acc;
            }, {} as Record<string, string>);

            // Lưu danh sách URL vào Cache
            if (!data.username) {
                throw new BadRequestException('Username is required');
            }
            await this.cacheService.setStudentCard(data.username, JSON.stringify(urlsObject));

            // Trả về danh sách URL dưới dạng object
            return { account, customer, urls: urlsObject };
        }

        // Lưu thông tin OCR hợp lệ vào database
        const studentCards = await Promise.all(
            validResults.map(async (ocrData) => {
                return await this.studentCardService.createStudentCard({
                    studentcardid: account.accountid,
                    schoolname: ocrData.university,
                    studentid: ocrData.id,
                    studyperiod: ocrData.expiryYear,
                });
            }),
        );
        // Trả về kết quả cuối cùng
        return { account, customer, studentCards };
    }

    findAll() {
        return this.prisma.accounts.findMany();
    }

    findOne(id: number) {
        return this.prisma.accounts.findUnique({ where: { accountid: id } });
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
        const existingAccount = await this.prisma.accounts.findUnique({ where: { accountid: id } });
        if (!existingAccount) {
            throw new BadRequestException('Account not found');
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
    }

    remove(id: number) {
        return this.prisma.accounts.delete({ where: { accountid: id } });
    }

    async checkStudentCustomer(customerId: number): Promise<boolean> {
        const studentCard = await this.prisma.student_card.findUnique({
            where: { studentcardid: customerId },
        });
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
}
