import { PartialType } from '@nestjs/mapped-types';
import { SigninAuthDto } from './signin-auth.dto';
export class UpdateAuthDto extends PartialType(SigninAuthDto) {}
