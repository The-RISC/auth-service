import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from '../../application/services/auth.service';
import { UserService } from '../../application/services/user.service';
import { RegisterUserDto } from '../../application/dtos/register-user.dto';
import { LoginUserDto } from '../../application/dtos/login-user.dto';
import { UpdateProfileDto } from '../../application/dtos/update-profile.dto';
import { JwtAuthGuard } from '@app/common';
import { CurrentUser } from '../decorators/current-user.decorator';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    const user = await this.authService.register(registerUserDto);
    return { message: 'Inscription réussie.', user };
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    const user = await this.authService.login(loginUserDto);
    return { message: 'Connexion réussie.', user };
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile')
  async updateProfile(
    @CurrentUser() user: any,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const updatedUser = await this.userService.updateProfile(
      user.id,
      updateProfileDto,
    );
    return {
      message: 'Profil mis à jour avec succès.',
      user: {
        _id: updatedUser._id,
        nom: updatedUser.nom,
        email: updatedUser.email,
        niveau_scolaire: updatedUser.niveau_scolaire,
        role: updatedUser.role,
        date_inscription: updatedUser.date_inscription,
      },
    };
  }

  @MessagePattern('validate_user')
  async validateUser(userId: string) {
    return this.userService.validateUser(userId);
  }
}