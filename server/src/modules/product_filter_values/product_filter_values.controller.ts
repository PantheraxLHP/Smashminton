import { Controller, Get } from '@nestjs/common';
import { ProductFilterValuesService } from './product_filter_values.service';

@Controller('product-filter-values')
export class ProductFilterValuesController {
  constructor(private readonly productFilterValuesService: ProductFilterValuesService) { }
  @Get()
  findAll() {
    return this.productFilterValuesService.findAll();
  }
}
