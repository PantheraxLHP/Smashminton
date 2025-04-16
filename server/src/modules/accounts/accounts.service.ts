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
@Injectable()
export class AccountsService {
    constructor(
        private prisma: PrismaService,
        private customerService: CustomerService,
        private employeeService: EmployeesService, // Assuming you have an EmployeesModule
        private studentCardService: StudentCardService, // Assuming you have a StudentCardModule
        private tesseractOcrService: TesseractOcrService, // Assuming you have a TesseractOcrModule
        private cloudinaryService: CloudinaryService, // Assuming you have a CloudinaryModule
        private cacheService: CacheService, // Assuming you have a CacheModule
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
    update(id: number, updateAccountDto: UpdateAccountDto) {
        return this.prisma.accounts.update({
            where: { accountid: id },
            data: updateAccountDto,
        });
    }

    remove(id: number) {
        return this.prisma.accounts.delete({ where: { accountid: id } });
    }
}
