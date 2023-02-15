import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdatePostDto } from '../dto/update-post.dto';
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

  async getAllPosts(documentsToSkip = 0, limitOfDocuments?: number) {
    const query = this.postModel.find().sort({ _id: 1 }).skip(documentsToSkip);
    if (limitOfDocuments) {
      query.limit(limitOfDocuments);
    }
    const results = await query;
    const count = await this.postModel.count();
    return { results, count };
  }

  async getUserPosts(userId: string) {
    return this.postModel.find({ user: userId });
  }

  async updatePost(id: string, updatePostDto: UpdatePostDto) {
    return this.postModel
      .findByIdAndUpdate(id, updatePostDto, { new: true })
      .exec();
  }

  async findById(id: string) {
    return this.postModel.findById(id);
  }
}
