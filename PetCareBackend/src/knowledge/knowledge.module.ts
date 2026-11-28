import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { KnowledgeService } from './knowledge.service';
import { KnowledgeController } from './knowledge.controller';
import { KnowledgeArticle, KnowledgeArticleSchema } from './schemas/knowledge-article.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: KnowledgeArticle.name, schema: KnowledgeArticleSchema },
    ]),
  ],
  controllers: [KnowledgeController],
  providers: [KnowledgeService],
  exports: [KnowledgeService, MongooseModule],
})
export class KnowledgeModule {}
