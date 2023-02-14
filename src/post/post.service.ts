import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AddCommentDto } from '../dto/add-comment.dto';
import { CreatePostDto } from '../dto/create-post.dto';
import { PostDocument } from '../schemas/post.schema';

@Injectable()
export class PostService {
  constructor(@InjectModel('Post') private postModel: Model<PostDocument>) {}

  async createPost(createPostDto: CreatePostDto, userId: string) {
    const appended = {
      ...createPostDto,
      user: userId,
    };
    const newPost = new this.postModel(appended);
    return newPost.save();
  }

  async addComment(addCommentDto: AddCommentDto, userId: string) {
    const foundPost = await this.postModel.findById(addCommentDto.postId);
    if (foundPost) {
      foundPost.comment.push({
        text: addCommentDto.text,
        user: userId,
      });
      foundPost.save();
    } else {
      throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
    }
  }

  async getAllPosts() {
    return this.postModel.find();
  }

  async getUserPosts(userId: string) {
    return this.postModel.find({ user: userId });
  }
}
