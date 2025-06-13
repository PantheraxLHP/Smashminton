import { Injectable } from '@nestjs/common';
import { CreateProductTypeDto } from './dto/create-product_type.dto';
import { UpdateProductTypeDto } from './dto/update-product_type.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductTypesService {
  constructor(private prisma: PrismaService) { }
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

  async getProductById(productId: number) {
    const now = new Date();

    const product = await this.prisma.products.findUnique({
      where: {
        productid: productId,
      },
    });

    if (!product) {
      throw new Error(`Product with ID ${productId} not found`);
    }

    const purchaseOrders = await this.prisma.purchase_order.findMany({
      where: {
        productid: productId,
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
  }


  async findAllProductsFromProductType(productTypeId: number, filterValueIds?: number[], page: number = 1, limit: number = 12) {
    const now = new Date();
    const skip = (page - 1) * limit;

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
            OR: [
              // Nếu có expiry date thì phải >= now
              {
                expirydate: {
                  gte: now,
                },
              },
              // Nếu expiry date là null thì vẫn lấy
              {
                expirydate: null,
              },
            ],
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

    const total = enrichedProducts.length;
    const totalPages = Math.ceil(total / limit);

    // ⛳ CHỖ NÀY paginate nè:
    const paginatedProducts = enrichedProducts.slice(skip, skip + limit);

    return {
      data: paginatedProducts,
      pagination: {
        page: page,
        totalPages: totalPages
      },
    }
  }
}
