import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractRepository } from '@app/common';
import { User, UserDocument } from '../../domain/schemas/user.schema';
import { IUser } from '../../domain/interfaces/user.interface';

@Injectable()
export class UserRepository extends AbstractRepository<UserDocument> {
  protected readonly logger = new Logger(UserRepository.name);

  constructor(@InjectModel(User.name) userModel: Model<UserDocument>) {
    super(userModel);
  }

  async findByEmail(email: string): Promise<UserDocument> {
    const user = await this.model.findOne({ email });
    
    if (!user) {
      this.logger.warn(`User with email ${email} not found`);
      throw new NotFoundException('Utilisateur non trouvé.');
    }
    
    return user;
  }

  async create(user: Partial<IUser>): Promise<UserDocument> {
    const newUser = await super.create(user as UserDocument);
    return newUser;
  }
}