import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DataResponse } from '@src/common/contracts/openapi-builder'
import { IsNotEmpty, MaxLength, ValidateNested } from 'class-validator';
import { CustomerOrderDto, Order } from '@order/schemas/order.schema';
import { ItemDto } from '@cart/schemas/cart.schema';

export class CreateOrderDto {
  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested()
  customer: CustomerOrderDto;

  @ApiProperty({ isArray: true, type: ItemDto })
  @IsNotEmpty()
  @ValidateNested()
  items: ItemDto[]

  @ApiPropertyOptional()
  @MaxLength(256)
  notes?: string
}

export class OrderResponseDto extends DataResponse(Order) {}