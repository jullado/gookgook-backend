import { IsNotEmpty } from 'class-validator';

class SignInDto {
  @IsNotEmpty()
  readonly username: string;

  @IsNotEmpty()
  readonly password: string;
}

class SignUpDto extends SignInDto {}

export { SignInDto, SignUpDto };
