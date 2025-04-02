import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { RegisterUserDto } from '../../application/dtos/register-user.dto';
import { LoginUserDto } from '../../application/dtos/login-user.dto';
import { UserResponseDto } from '../../application/dtos/user-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<UserResponseDto> {
    // Check if user exists
    try {
      await this.userRepository.findByEmail(registerUserDto.email);
      throw new BadRequestException('Cet email est déjà utilisé.');
    } catch (error) {
      if (!(error instanceof BadRequestException)) {
        // If error is not that the user exists, continue with registration
      } else {
        throw error;
      }
    }

    // Hash password
    const mot_de_passe_hash = await bcrypt.hash(registerUserDto.mot_de_passe, 10);

    // Create user
    const user = await this.userRepository.create({
      nom: registerUserDto.nom,
      email: registerUserDto.email,
      mot_de_passe_hash,
      derniere_connexion: new Date(),
    });

    // Generate token
    const token = this.generateToken(user);

    return {
      _id: user._id.toString(),
      nom: user.nom,
      email: user.email,
      niveau_scolaire: user.niveau_scolaire,
      role: user.role,
      date_inscription: user.date_inscription,
      token,
    };
  }

  async login(loginUserDto: LoginUserDto): Promise<UserResponseDto> {
    // Find user
    const user = await this.userRepository.findByEmail(loginUserDto.email).catch(() => {
      throw new UnauthorizedException('Email ou mot de passe incorrect.');
    });

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      loginUserDto.mot_de_passe,
      user.mot_de_passe_hash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email ou mot de passe incorrect.');
    }

    // Update last login
    user.derniere_connexion = new Date();
    await this.userRepository.findOneAndUpdate(
      { _id: user._id },
      { derniere_connexion: user.derniere_connexion },
    );

    // Generate token
    const token = this.generateToken(user);

    return {
      _id: user._id.toString(),
      nom: user.nom,
      email: user.email,
      niveau_scolaire: user.niveau_scolaire,
      role: user.role,
      date_inscription: user.date_inscription,
      token,
    };
  }

  private generateToken(user: any): string {
    const payload = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    return this.jwtService.sign(payload);
  }
}
