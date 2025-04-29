import { Injectable, Logger } from '@nestjs/common';
import { Prisma, Product } from 'generated/prisma/client';

import { PrismaService } from 'src/services/services';


@Injectable()
export class ProductsService{
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    private prismaService : PrismaService
  )
  {}


  async create(data: Prisma.ProductCreateInput) : Promise<Product> {
    return this.prismaService.product.create({
      data,
    });
  }


  async findAll(params: {
    take?: number,
    skip?:number,
    cursor?: Prisma.ProductWhereUniqueInput,
    where?: Prisma.ProductWhereInput,
    orderBy?: Prisma.ProductOrderByWithRelationInput
  }) {
    const { skip, take, cursor, where, orderBy } = params;
    const totalRegisters = await this.prismaService.product.count({
      where: { available: true} // Filter only available products
    });
    return{
      data: await this.prismaService.product.findMany({
        skip,
        take,
        cursor,
        where: { available: true, ...where }, // Filter only available products
        orderBy
      }),
      metadata: {
        totalRegisters,
        totalPages: Math.ceil(totalRegisters / (take || 10)),
      }
    }
  }


  async findOne(id: number) : Promise<Product | null> {
    return this.prismaService.product.findUnique({
      where: { id: id, available: true },
    })
  }


  async update(params: {
    where: Prisma.ProductWhereUniqueInput, 
    data: Prisma.ProductUpdateInput
  }) : Promise<Product> 
  {
    const { where, data } = params;
    return await this.prismaService.product.update({
      data,
      where
    });
  }


  async remove(where: Prisma.ProductWhereUniqueInput) : Promise<Product> {
    // return this.prismaService.product.delete({
    //   where
    // });
    const product = await this.prismaService.product.update({
      where,
      data: {
        available: false 
      },
    });
    return product;
  }



}
