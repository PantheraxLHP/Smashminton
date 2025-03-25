import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Put,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Controller('customer')
export class CustomerController {
    constructor(private readonly customerService: CustomerService) {}

    @Post()
    create(accountId: number) {
        return this.customerService.create(accountId);
    }

    @Get()
    findAll() {
        return this.customerService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.customerService.findOne(+id);
    }

    @Put(':id')
    update(
        @Param('id') id: string,
        @Body() updateCustomerDto: UpdateCustomerDto,
    ) {
        return this.customerService.update(+id, updateCustomerDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.customerService.remove(+id);
    }
}
