import { Injectable, Logger } from '@nestjs/common';
import { Prisma, Product } from 'generated/prisma/client';

import { PrismaService } from 'src/services/services';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

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
  }) : Promise<Product[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prismaService.product.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy
    });
  }


  async findOne(id: Prisma.ProductWhereUniqueInput) : Promise<Product | null> {
    return this.prismaService.product.findUnique({
      where: id
    })
  }


  update(params: {
    where: Prisma.ProductWhereUniqueInput, 
    data: Prisma.ProductUpdateInput
  }) : Promise<Product> 
  {
    const { where, data } = params;
    return this.prismaService.product.update({
      data,
      where
    });
  }


  remove(where: Prisma.ProductWhereUniqueInput) {
    return this.prismaService.product.delete({
      where
    });
  }
}
