import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { PasteService } from '../paste/paste.service';
import { StarService } from '../star/star.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject(forwardRef(() => PasteService))
    private readonly pasteService: PasteService,
    private readonly starService: StarService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const salt = await bcrypt.genSalt();
    createUserDto.password = await bcrypt.hash(createUserDto.password, salt);
    try {
      return await this.userModel.create(createUserDto);
    } catch (error) {
      throw new HttpException('Username already exist', HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(username: string): Promise<User | undefined> {
    return await this.userModel.findOne({ username: username }).exec();
  }

  async findById(id: string): Promise<UserDocument> {
    return await this.userModel.findById(id).exec();
  }

  async delete(id: string) {
    await this.pasteService.deleteUserPastes(id);
    await this.starService.removeUserStars(id);
    await this.userModel.deleteOne({ _id: id }).exec();
  }
}
