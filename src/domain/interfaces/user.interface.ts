export interface IUser {
    _id?: string;
    nom: string;
    email: string;
    mot_de_passe_hash?: string;
    date_inscription?: Date;
    derniere_connexion?: Date;
    niveau_scolaire?: string;
    role?: string;
  }