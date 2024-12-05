import { Controller, Post, Body, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpAuthDto } from '../user/dto/signup-user.dto';
import { SignInAuthDto } from '../user/dto/signin-user.dto';
import { UserResponseDto } from '../user/dto/response-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('signin')
  signIn(@Body() credentials: SignInAuthDto) {
    return this.authService.signIn(credentials)
  }

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() signUpUser: SignUpAuthDto, @Res() res: Response) {
    try {
      const user = await this.authService.signUp(signUpUser);
      return res.status(HttpStatus.CREATED).json({
        user,
        status: 201
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).send(error);
    }
  }

  @Post('signup/google')
  @HttpCode(HttpStatus.CREATED)
  async signUpgoogle(@Body() signUpUser: SignUpAuthDto) {
    const user = await this.authService.signUpgoogle(signUpUser);  // El servicio ya maneja el envío del correo
    return user;  // Retorna el usuario con la respuesta deseada
  }

}
