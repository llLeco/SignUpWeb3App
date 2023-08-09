import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './entities/user.entity';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { LoginUserDto } from './dto/login-user.dto';


@Injectable()
export class UsersService {

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

  async create(createUserDto: CreateUserDto) {
    const user = new this.userModel({
      ...createUserDto,
    });
    return user.save();
  }
  

  findAll() {
    return this.userModel.find().exec();
  }

  findOne(id: string) {
    return this.userModel.findById(id);
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userModel.findByIdAndUpdate({
      _id: id
    }, {
      $set: updateUserDto
    }, {
      new: true
    });
  }

  remove(id: string) {
    return this.userModel.findByIdAndDelete(id);
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.userModel.findOne({ username: loginUserDto.username });

    if (!user) {
      throw new Error('User not found');
    }

    // Compare the provided password with the stored hash
    bcrypt.compare(loginUserDto.password, user.password, (err, res) => {

      if (err) {
        console.log(err);
        throw new Error('Invalid password');
      }
      if (res) {
        console.log('passwordMatches', res)
        return user;
      } else {
        throw new Error('Invalid password');
      }
    });
  }

}
