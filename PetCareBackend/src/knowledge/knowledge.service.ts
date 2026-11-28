import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { KnowledgeArticle, KnowledgeArticleDocument } from './schemas/knowledge-article.schema';

@Injectable()
export class KnowledgeService {
  constructor(
    @InjectModel(KnowledgeArticle.name) private articleModel: Model<KnowledgeArticleDocument>,
  ) {}

  async findAll(category?: string, search?: string, page = 1, limit = 20) {
    const filter: any = { status: 'PUBLISHED' };
    if (category && category !== 'Tất cả') {
      filter.category = category.toUpperCase();
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { summary: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.articleModel.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }).exec(),
      this.articleModel.countDocuments(filter).exec(),
    ]);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findBySlug(slug: string): Promise<KnowledgeArticleDocument> {
    const article = await this.articleModel.findOne({ slug }).exec();
    if (!article) {
      throw new NotFoundException(`Không tìm thấy bài viết kiến thức: ${slug}`);
    }
    return article;
  }

  async create(dto: any): Promise<KnowledgeArticleDocument> {
    const created = new this.articleModel(dto);
    return created.save();
  }

  async update(id: string, dto: any): Promise<KnowledgeArticleDocument> {
    const updated = await this.articleModel.findByIdAndUpdate(id, { $set: dto }, { new: true }).exec();
    if (!updated) {
      throw new NotFoundException('Không tìm thấy bài viết để cập nhật');
    }
    return updated;
  }

  async delete(id: string): Promise<{ success: boolean; message: string }> {
    const deleted = await this.articleModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException('Không tìm thấy bài viết để xóa');
    }
    return { success: true, message: 'Đã xóa bài viết thành công' };
  }
}
