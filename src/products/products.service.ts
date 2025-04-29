import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
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
    try {

      return this.prismaService.product.create({
        data,
      });
      
    } catch (error) {
      throw new RpcException({
        message: `Creation product error: ${error.message}`, 
        status: HttpStatus.BAD_REQUEST
      });
    }
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
    // const product =  this.prismaService.product.findUnique({
    //   where: { id: id, available: true },
    // })
    const product = await this.prismaService.product.findFirst({
      where: { id: id, available: true },
    });
    if (!product)
      throw new RpcException({
        message: `Product with id ${id} not found`, 
        status: HttpStatus.BAD_REQUEST
      });
    return product;
  }


  async update(params: {
    where: Prisma.ProductWhereUniqueInput, 
    data: Prisma.ProductUpdateInput
  }) : Promise<Product> 
  {
    try {
      
      const { where, data } = params;
      return await this.prismaService.product.update({
        data,
        where: { ...where, available: true }, // Filter only available products
      });

    } catch (error) {
      throw new RpcException({
        message: `Update product error: ${error.message}`, 
        status: HttpStatus.BAD_REQUEST
      });
    }
  }


  async remove(where: Prisma.ProductWhereUniqueInput) : Promise<Product> {
    try {

      const product = await this.prismaService.product.update({
        where,
        data: {
          available: false 
        },
      });
      return product;
      
    } catch (error) {
      throw new RpcException({
        message: `Remove product error: ${error.message}`, 
        status: HttpStatus.BAD_REQUEST
      });
    }
  }



}
