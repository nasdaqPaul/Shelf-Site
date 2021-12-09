import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class UserProfile {
  @Prop()
  firstName: string;
  @Prop()
  lastName: string;
}

export const UserProfileSchema = SchemaFactory.createForClass(UserProfile);