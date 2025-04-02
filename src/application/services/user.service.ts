import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { UpdateProfileDto } from '../dtos/update-profile.dto';
import { Types } from 'mongoose';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    return this.userRepository.findOneAndUpdate(
      { _id: new Types.ObjectId(userId) },
      { ...updateProfileDto },
    );
  }

  async findById(userId: string) {
    return this.userRepository.findOneById(userId);
  }

  async validateUser(userId: string) {
    const user = await this.userRepository.findOneById(userId);
    if (!user) {
      return null;
    }
    return {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    };
  }
}
