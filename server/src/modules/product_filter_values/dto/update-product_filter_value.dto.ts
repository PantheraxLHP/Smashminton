import { PartialType } from '@nestjs/mapped-types';
import { CreateProductFilterValueDto } from './create-product_filter_value.dto';

export class UpdateProductFilterValueDto extends PartialType(CreateProductFilterValueDto) {}
