import { PartialType } from '@nestjs/swagger';
import { CreatePurchaseOrderDto } from './create-purchase_order.dto';

export class UpdatePurchaseOrderDto extends PartialType(CreatePurchaseOrderDto) {}
