import { IsNotEmpty } from 'class-validator';

export class CreateCompanyDto {
  @IsNotEmpty()
  readonly name: string;

  readonly image: string;

  readonly address: string;

  readonly phone: string;

  readonly email: string;
}
