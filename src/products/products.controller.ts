import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { PaginationDto } from 'src/shared/dtos/pagination.dto';



@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll( @Query() paginationDto: PaginationDto) {
    return this.productsService.findAll({
      take: paginationDto.take,
      skip: paginationDto.skip
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(
      Number(id)
    );
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update({
      where: { id: Number(id)},
      data: updateProductDto
    });
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove({id: Number(id)});
  }
}
