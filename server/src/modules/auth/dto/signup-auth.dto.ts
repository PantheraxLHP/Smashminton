import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthDto } from './signin-auth.dto';

export class UpdateAuthDto extends PartialType(CreateAuthDto) {}
