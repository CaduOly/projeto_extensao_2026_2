import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateJobDto {
  @IsString()
  @IsNotEmpty({ message: 'O título da vaga é obrigatório.' })
  @Length(3, 100, { message: 'O título da vaga deve ter entre 3 e 100 caracteres.' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'A descrição da vaga é obrigatória.' })
  @Length(10, 2000, { message: 'A descrição deve ter entre 10 e 2000 caracteres.' })
  description: string;

  @IsString()
  @IsOptional()
  @Length(0, 50, { message: 'O valor da remuneração deve ter no máximo 50 caracteres.' })
  salary?: string;

  @IsString()
  @IsNotEmpty({ message: 'O número do WhatsApp é obrigatório.' })
  @Length(8, 20, { message: 'O número do WhatsApp deve ter entre 8 e 20 caracteres.' })
  whatsapp: string;
}
