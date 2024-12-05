import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { SignInAuthDto } from '../user/dto/signin-user.dto';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { SignUpAuthDto } from '../user/dto/signup-user.dto';
import * as bcrypt from 'bcrypt';
import { AdminService } from '../admin/admin.service';
import { GardenerService } from '../gardener/gardener.service';
import { Role } from '../user/enums/role.enum';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private adminService: AdminService,
    private gardenerService: GardenerService,
    private jwtService: JwtService,
    private readonly mailService: MailService,
  ) { }

  async signIn(credentials: SignInAuthDto) {
    try {      
      const user = await this.userService.findByEmail(credentials.email);
      const admin = await this.adminService.findByEmail(credentials.email);
      const gardener = await this.gardenerService.findByEmail(
        credentials.email,
      );
      if (user?.isBanned === true) {
        throw new HttpException(
          'El usuario esta baneado',
          HttpStatus.UNAUTHORIZED,
        );
      }

      // Validación para usuarios
      if (user) {        
        const isPasswordMatching = await bcrypt.compare(
          credentials.password,
          user.password,
        );
        if (!isPasswordMatching) {
          throw new HttpException(
            'Credenciales incorrectas',
            HttpStatus.UNAUTHORIZED,
          );
        }
        const token = await this.createToken(user);
        return { token, user };
      }

      // Validación para administradores
      if (admin) {
        const isPasswordMatching = await bcrypt.compare(
          credentials.password,
          admin.password,
        );
        if (!isPasswordMatching) {
          throw new HttpException(
            'Credenciales incorrectas',
            HttpStatus.UNAUTHORIZED,
          );
        }
        const token = await this.createToken(admin);
        return { token, user: admin };
      }

      // Validación para jardineros
      if (gardener) {
        const isPasswordMatching = await bcrypt.compare(
          credentials.password,
          gardener.password,
        );
        if (!isPasswordMatching) {
          throw new HttpException(
            'Credenciales incorrectas',
            HttpStatus.UNAUTHORIZED,
          );
        }
        const token = await this.createToken(gardener);
        return { token, user: gardener };
      }

      throw new HttpException(
        'Usuario no encontrado en la base de datos',
        HttpStatus.UNAUTHORIZED,
      );
    } catch (error) {
      throw new HttpException(error, 401);
    }
  }

  async signUp(signUpUser: SignUpAuthDto) {
    const userFinded = await this.userService.findByEmail(signUpUser.email);
    const gardenerFinded = await this.gardenerService.findByEmail(
      signUpUser.email,
    );

    if (userFinded || gardenerFinded) {
      throw new BadRequestException('El usuario ya existe');
    }

    if (signUpUser.password !== signUpUser.passwordConfirm) {
      throw new HttpException('Las contraseñas no coinciden', 400);
    }

    signUpUser.password = await bcrypt.hash(signUpUser.password, 10);

    if (!signUpUser.password) {
      throw new BadRequestException('Error al encriptar la contraseña');
    }

    let newUsers;    
    if (signUpUser.role === Role.Gardener) newUsers = await this.gardenerService.create(signUpUser);
    else newUsers = await this.userService.create(signUpUser);

    await this.mailService.sendWelcomeEmail(newUsers.email, newUsers.username);
    return newUsers;
  }

  async signUpgoogle(createUserDto: any) {
    try {
      let password2 = await bcrypt.hash(createUserDto.password, 10);
      this.userService.create(
        {
          name: createUserDto.name,
          email: createUserDto.email,
          username: createUserDto.username,
          password: password2,
          passwordConfirm: password2,
          profileImageUrl: createUserDto.profileImageUrl,
          isGoogle: true,
          role: Role.User,
          phone: '35745678',
          age: 18,
          address: 'google123'
        }
      );
      await this.mailService.sendWelcomeEmail(createUserDto.email, createUserDto.username);
      return true
    } catch (error) {
      return false
    }
  }
  
  private async createToken(user: User) {
    const payload = {
      id: user.id,
      email: user.email,
      roles: user.role,
    };

    return this.jwtService.signAsync(payload);
  }
}
