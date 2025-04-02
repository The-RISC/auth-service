import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '@app/common';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ versionKey: false, timestamps: true })
export class User extends AbstractDocument {
  @Prop({ required: true })
  nom: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  mot_de_passe_hash: string;

  @Prop({ type: Date, default: Date.now })
  date_inscription: Date;

  @Prop({ type: Date })
  derniere_connexion: Date;

  @Prop({ default: 'CP' })
  niveau_scolaire: string;

  @Prop({ enum: ['élève', 'parent', 'enseignant'], default: 'élève' })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);