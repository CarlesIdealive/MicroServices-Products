import { 
  Controller, 
  ParseIntPipe
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { PaginationDto } from 'src/shared/dtos/pagination.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';



@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @MessagePattern({ cmd: 'create'})
  create(@Payload() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  // @Get()
  @MessagePattern({ cmd: 'find_all'})
  findAll( @Payload() paginationDto: PaginationDto) {
    return this.productsService.findAll({
      take: paginationDto.take,
      skip: paginationDto.skip
    });
  }

  // @Get(':id')
  @MessagePattern({cmd: 'find_one'})
  findOne(@Payload('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  // @Patch(':id')
  @MessagePattern({ cmd: 'update'})
  update(
    @Payload() updateProductDto: UpdateProductDto
  ) {
    const { id } = updateProductDto;
    return this.productsService.update({
      where: { id: id},
      data: updateProductDto
    });
  }


  // @Delete(':id')
  @MessagePattern({ cmd: 'remove'})
  remove(@Payload('id', ParseIntPipe) id: number) {
    return this.productsService.remove({id: id});
  }
}
