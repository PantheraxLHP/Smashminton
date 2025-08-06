import {
    Controller,
    Get,
    Post,
    Body,
    Put,
    Param,
    Delete,
    NotFoundException,
    BadRequestException,
    UploadedFiles,
    UploadedFile,
    UseInterceptors,
    ParseIntPipe,
    UseGuards,
    Logger,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import {
    ApiTags,
    ApiBadRequestResponse,
    ApiOkResponse,
    ApiOperation,
    ApiNotFoundResponse,
    ApiConsumes,
    ApiBody,
    ApiParam,
    ApiResponse,
    ApiBearerAuth,
} from '@nestjs/swagger';
import { FilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@ApiTags('Accounts')
@UseGuards(JwtAuthGuard)
@Controller('accounts')
export class AccountsController {
    constructor(private readonly accountsService: AccountsService) {}

    @Post('customer')
    @ApiBearerAuth()
    @UseInterceptors(
        FilesInterceptor('studentCard', 10, {
            // Cho phép tối đa 10 file
            limits: {
                fileSize: 5 * 1024 * 1024, // Giới hạn kích thước file: 5MB
            },
            fileFilter: (req, file, cb) => {
                if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
                    return cb(new Error('Only image files are allowed!'), false);
                }
                cb(null, true);
            },
        }),
    )
    async createAccount(@Body() createAccountDto: CreateAccountDto, @UploadedFiles() files: Express.Multer.File[]) {
        if (!createAccountDto) {
            throw new BadRequestException('Invalid account data');
        }

        return this.accountsService.createCustomer(createAccountDto, files);
    }

    @Put(':id/password')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Change account password' })
    @ApiBody({
        description: 'Change account password',
        type: ChangePasswordDto,
    })
    @ApiOkResponse({ description: 'Password was changed successfully' })
    @ApiBadRequestResponse({ description: 'Invalid input' })
    @ApiParam({ name: 'id', required: true, description: 'Account ID', example: 15 })
    async changePassword(@Param('id') id: number, @Body() changePasswordDto: ChangePasswordDto) {
        if (!changePasswordDto) {
            throw new BadRequestException('Invalid password data');
        }
        return this.accountsService.changePassword(+id, changePasswordDto);
    }

    @Get()
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Find all accounts' })
    @ApiOkResponse({ description: 'Found all accounts' })
    async findAll() {
        const accounts = await this.accountsService.findAll();
        if (!accounts) {
            throw new NotFoundException('No accounts found');
        }
        return accounts;
    }

    @Get(':id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Find one account' })
    @ApiOkResponse({ description: 'Found the account' })
    @ApiBadRequestResponse({ description: 'Invalid ID' })
    @ApiNotFoundResponse({ description: 'Account not found' })
    async findOne(@Param('id') id: number) {
        const account = await this.accountsService.findOne(+id);
        if (!account) {
            throw new NotFoundException('Account not found');
        }
        return account;
    }
    @Put(':id')
    @ApiBearerAuth()
    @UseInterceptors(
        FileInterceptor('avatarurl', {
            limits: {
                fileSize: 5 * 1024 * 1024, // Giới hạn kích thước file: 5MB
            },
            fileFilter: (req, file, cb) => {
                if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
                    return cb(new Error('Only image files are allowed!'), false);
                }
                cb(null, true);
            },
        }),
    )
    @ApiOperation({ summary: 'Update an account with profile picture' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Update account with profile picture',
        type: UpdateAccountDto,
    })
    @ApiOkResponse({ description: 'Account was updated' })
    @ApiBadRequestResponse({ description: 'Invalid input' })
    @ApiNotFoundResponse({ description: 'Account not found' })
    @ApiParam({ name: 'id', required: true, description: 'Account ID', example: 1 })
    async update(
        @Param('id') id: number,
        @Body() updateAccountDto: UpdateAccountDto,
        @UploadedFile() file: Express.Multer.File,
    ) {
        Logger.log(updateAccountDto);
        if (!updateAccountDto) {
            throw new BadRequestException('Invalid account data');
        }
        return this.accountsService.update(+id, updateAccountDto, file);
    }

    @Delete(':id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete an account' })
    @ApiOkResponse({ description: 'Account was deleted' })
    @ApiNotFoundResponse({ description: 'Account not found' })
    async remove(@Param('id') id: string) {
        const account = await this.accountsService.findOne(+id);
        if (!account) {
            throw new NotFoundException('Account not found');
        }
        return this.accountsService.remove(+id);
    }

    @Put(':id/student-card')
    @ApiBearerAuth()
    @UseInterceptors(FilesInterceptor('files', 2)) // Max 2 files
    @ApiOperation({
        summary: 'Update student card with OCR',
        description: 'Upload 2 student card images to update the student card information.',
    })
    @ApiConsumes('multipart/form-data')
    @ApiParam({
        name: 'id',
        description: 'Account ID',
        type: Number,
        example: 1,
    })
    @ApiBody({
        description: 'Upload 2 student card images',
        schema: {
            type: 'object',
            properties: {
                files: {
                    type: 'array',
                    items: {
                        type: 'string',
                        format: 'binary',
                    },
                    maxItems: 2,
                    description: 'Tối đa 2 ảnh student card',
                },
            },
        },
    })
    @ApiResponse({
        status: 200,
        description: 'Update student card successfully',
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request - Account not found, invalid files, or OCR failed',
    })
    @ApiResponse({
        status: 422,
        description: 'Unprocessable Entity - Unable to extract student card information from images',
    })
    async updateStudentCard(@Param('id', ParseIntPipe) id: number, @UploadedFiles() files?: Express.Multer.File[]) {
        return this.accountsService.updateStudentCard(id, files || []);
    }
}
