import { PartialType } from '@nestjs/swagger';
import { CreateProductTypeDto } from './create-product_type.dto';

export class UpdateProductTypeDto extends PartialType(CreateProductTypeDto) {}
