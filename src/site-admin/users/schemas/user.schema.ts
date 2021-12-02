import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Schema()
export class User {
  @Prop({ unique: true })
  username: string;
  @Prop()
  email: string;
  @Prop()
  password: string;


}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function(next) {
  let user = this;
  if(!user.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  // @ts-ignore
  user.password = await bcrypt.hash(user.password, salt);
  next()
});

UserSchema.methods.comparePassword = async function(password: string) {
  // @ts-ignore
  return await bcrypt.compare(password, this.password!);
}
