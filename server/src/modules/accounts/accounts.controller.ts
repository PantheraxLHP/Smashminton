import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
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

@ApiTags('Accounts')
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  @ApiOperation({ summary: 'Create an account' })
  @ApiCreatedResponse({
    description: 'Account was created',
    type: CreateAccountDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  create(@Body() createAccountDto: CreateAccountDto) {
    return this.accountsService.create(createAccountDto);
  }

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
  async update(
    @Param('id') id: number,
    @Body() updateAccountDto: UpdateAccountDto,
  ) {
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
