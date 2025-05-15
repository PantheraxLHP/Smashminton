import { Injectable } from '@nestjs/common';
import { CreateProductTypeDto } from './dto/create-product_type.dto';
import { UpdateProductTypeDto } from './dto/update-product_type.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductTypesService {
  constructor(private prisma: PrismaService) {}
  
  create(createProductTypeDto: CreateProductTypeDto) {
    return 'This action adds a new productType';
  }

  findAllProductFilters() {
    return this.prisma.product_types.findMany({
      include: {
        product_filter: {
          include: {
            product_filter_values: true,
          },
        },
      },
    });
  }

  async findAllProductsFromProductType(productTypeId: number) {
    const productTypes = await this.prisma.product_types.findUnique({
      where: {
        producttypeid: productTypeId,
      },
      include: {
        product_filter: {
          include: {
            product_filter_values: {
              include: {
                product_attributes: {
                  include: {
                    products: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const allProductsMap = new Map();

    productTypes?.product_filter.forEach((filter) => {
      filter.product_filter_values.forEach((value) => {
        value.product_attributes.forEach((attr) => {
          const product = attr.products;
          if (product && !allProductsMap.has(product.productid)) {
            allProductsMap.set(product.productid, product);
          }
        });
      });
    });

    const allProducts = Array.from(allProductsMap.values());
    return allProducts;
  }

  update(id: number, updateProductTypeDto: UpdateProductTypeDto) {
    return `This action updates a #${id} productType`;
  }

  remove(id: number) {
    return `This action removes a #${id} productType`;
  }
}
