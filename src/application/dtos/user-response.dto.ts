export class UserResponseDto {
    _id: string;
    nom: string;
    email: string;
    niveau_scolaire: string;
    role: string;
    date_inscription: Date;
    token?: string;
  }