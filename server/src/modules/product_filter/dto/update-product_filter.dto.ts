import { PartialType } from '@nestjs/swagger';
import { CreateProductFilterDto } from './create-product_filter.dto';

export class UpdateProductFilterDto extends PartialType(CreateProductFilterDto) {}
