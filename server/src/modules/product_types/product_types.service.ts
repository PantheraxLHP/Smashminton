import { Injectable } from '@nestjs/common';
import { CreateProductTypeDto } from './dto/create-product_type.dto';
import { UpdateProductTypeDto } from './dto/update-product_type.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductTypesService {
  constructor(private prisma: PrismaService) { }

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

  // async findAllProductsFromProductType(productTypeId: number, filterValueIds?: number[]) {
  //   const productTypes = await this.prisma.product_types.findUnique({
  //     where: {
  //       producttypeid: productTypeId,
  //     },
  //     include: {
  //       product_filter: { 
  //         include: {
  //           product_filter_values: {
  //             where: filterValueIds
  //               ? { productfiltervalueid: { in: filterValueIds } }
  //               : undefined,
  //             include: {
  //               product_attributes: {
  //                 include: {
  //                   products: true,
  //                 },
  //               },
  //             },
  //           },
  //         },
  //       },
  //     },
  //   });

  //   const allProductsMap = new Map();

  //   productTypes?.product_filter.forEach((filter) => {
  //     filter.product_filter_values.forEach((value) => {
  //       value.product_attributes.forEach((attr) => {
  //         const product = attr.products;
  //         if (product && !allProductsMap.has(product.productid)) {
  //           allProductsMap.set(product.productid, product);
  //         }
  //       });
  //     });
  //   });

  //   const allProducts = Array.from(allProductsMap.values());
  //   return allProducts;
  // }

  async findAllProductsFromProductType(productTypeId: number, filterValueIds?: number[]) {
    const now = new Date();

    const productTypes = await this.prisma.product_types.findUnique({
      where: {
        producttypeid: productTypeId,
      },
      include: {
        product_filter: {
          include: {
            product_filter_values: {
              where: filterValueIds
                ? { productfiltervalueid: { in: filterValueIds } }
                : undefined,
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

    const productMap = new Map<number, any>();

    productTypes?.product_filter.forEach(filter => {
      filter.product_filter_values.forEach(value => {
        value.product_attributes.forEach(attr => {
          const product = attr.products;
          if (product && !productMap.has(product.productid)) {
            productMap.set(product.productid, product);
          }
        });
      });
    });

    // Lấy danh sách productid duy nhất
    const uniqueProducts = Array.from(productMap.values());

    // Lấy stock quantity cho từng productid
    const enrichedProducts = await Promise.all(uniqueProducts.map(async (product) => {
      const purchaseOrders = await this.prisma.purchase_order.findMany({
        where: {
          productid: product.productid,
          product_batch: {
            expirydate: {
              gte: now,
            },
          },
        },
        include: {
          product_batch: true,
        },
      });

      const quantity = purchaseOrders.reduce((sum, po) => {
        return sum + (po.product_batch?.stockquantity || 0);
      }, 0);

      return {
        productid: product.productid,
        productname: product.productname,
        sellingprice: product.sellingprice,
        rentalprice: product.rentalprice,
        productimgurl: product.productimgurl,
        quantity,
      };
    }));

    return enrichedProducts;
  }

  update(id: number, updateProductTypeDto: UpdateProductTypeDto) {
    return `This action updates a #${id} productType`;
  }

  remove(id: number) {
    return `This action removes a #${id} productType`;
  }
}
