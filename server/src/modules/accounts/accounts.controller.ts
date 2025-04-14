import { Controller, Get, Post, Body, Put, Param, Delete, NotFoundException, BadRequestException, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import {
    ApiTags,
    ApiBadRequestResponse,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiOperation,
    ApiNotFoundResponse,
} from '@nestjs/swagger';
import { CustomerService } from '../customers/customers.service';
import { FilesInterceptor } from '@nestjs/platform-express';

@ApiTags('Accounts')
@Controller('accounts')
export class AccountsController {
    constructor(
        private readonly accountsService: AccountsService,
    ) {}

    @Post('customer')
    @UseInterceptors(FilesInterceptor('studentCard', 10, { // Cho phép tối đa 10 file
        limits: {
            fileSize: 5 * 1024 * 1024, // Giới hạn kích thước file: 5MB
        },
        fileFilter: (req, file, cb) => {
            if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
                return cb(new Error('Only image files are allowed!'), false);
            }
            cb(null, true);
        },
    }))
    async createAccount(
        @Body() createAccountDto: CreateAccountDto,
        @UploadedFiles() files: Express.Multer.File[],
    ) {
        if (!createAccountDto) {
            throw new BadRequestException('Invalid account data');
        }

        return this.accountsService.createCustomer(createAccountDto, files);
    }

    // @Post()
    // @ApiOperation({ summary: 'Create an account employee' })
    // @ApiCreatedResponse({
    //     description: 'Account was created',
    //     type: CreateAccountDto,
    // })
    // @ApiBadRequestResponse({ description: 'Invalid input' })
    // async createAccountEmployee(@Body() createAccountDto: CreateAccountDto) {
    //     const account = await this.accountsService.create(createAccountDto);

    //     if (account.accounttype === 'Employee') {
    //         await this.customerService.create(account.accountid);
    //     }
    // }

    @Get()
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
    @ApiOperation({ summary: 'Update an account' })
    @ApiOkResponse({ description: 'Account was updated' })
    @ApiBadRequestResponse({ description: 'Invalid input' })
    @ApiNotFoundResponse({ description: 'Account not found' })
    async update(@Param('id') id: number, @Body() updateAccountDto: UpdateAccountDto) {
        const account = await this.accountsService.findOne(+id);
        if (!account) {
            throw new NotFoundException('Account not found');
        }
        return this.accountsService.update(+id, updateAccountDto);
    }

    @Delete(':id')
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
}
