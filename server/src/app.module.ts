import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './modules/prisma/prisma.module';
import { ProductsModule } from './modules/products/products.module';
import { AccountsModule } from './modules/accounts/accounts.module';

@Module({
  imports: [PrismaModule, ProductsModule, AccountsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
