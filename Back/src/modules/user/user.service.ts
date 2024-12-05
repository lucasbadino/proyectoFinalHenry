import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from './enums/role.enum';

@Injectable()
export class UserService {


  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {

    const { passwordConfirm, ...rest } = createUserDto
    rest.role = Role.User;
    const user = this.userRepository.create(rest);
    return await this.userRepository.save(user);
  }

  async findAll(
    page: number,
    limit: number,
    name?: string,
    order: 'ASC' | 'DESC' = 'ASC',
    isBanned?: boolean,
    role?: string,
  ) {
    const skip = (page - 1) * limit;

    const query = this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.servicesOrder', 'servicesOrder')
      .take(limit)
      .skip(skip)
      .orderBy('user.name', order);

    if (name) {
      query.andWhere('user.name ILIKE :name', { name: `%${name}%` });
    }

    if (isBanned !== undefined) {
      query.andWhere('user.isBanned = :isBanned', { isBanned });
    }

    if (role) {
      query.andWhere('user.role = :role', { role });
    }

    const [results, total] = await query.getManyAndCount();

    if (total === 0) {
      throw new NotFoundException('No se encontraron usuarios');
    }

    return {
      count: total,
      data: results,
      page,
    };
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return user;
  }


  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    await this.userRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async banUser(id: string): Promise<User> {
    const user = await this.findOne(id);
    user.isBanned = !user.isBanned;
    return await this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    return user;
  }
  async googleEmail(email: { email: string }) {
    const user = await this.userRepository.findOne({ where: { email: email.email } });
    if (user) return true;

    return false;
  }

  async remove(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('Usuario no encontrado para eliminar');
  }

  async findOneWithOrders(userId: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['servicesOrder', 'servicesOrder.gardener', 'servicesOrder.serviceProvided', 'servicesOrder.orderDetail', 'servicesOrder.reviews'],
        order: {
          servicesOrder: {
            serviceDate: 'ASC',
          },
        },
      });
      console.log(user);
      
      if (!user) {
        throw new NotFoundException('Usuario no encontrado');
      }
      return user;
    } catch (error) {
      throw new NotFoundException('Usuario no encontrado');
    }
  }

  async updateProfileImage(id: string, imageUrl: string): Promise<void> {
    await this.userRepository.update(id, { profileImageUrl: imageUrl });
  }
}

