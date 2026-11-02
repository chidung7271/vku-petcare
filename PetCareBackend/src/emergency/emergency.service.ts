import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EmergencyCase, EmergencyCaseDocument } from './schemas/emergency-case.schema';
import { EmergencySafetyService, EmergencyTriageResult } from './emergency-safety.service';
import { TriageRequestDto, CreateEmergencyCaseDto } from './dto/triage-request.dto';

@Injectable()
export class EmergencyService {
  constructor(
    @InjectModel(EmergencyCase.name) private emergencyCaseModel: Model<EmergencyCaseDocument>,
    private emergencySafetyService: EmergencySafetyService,
  ) {}

  async triage(dto: TriageRequestDto): Promise<EmergencyTriageResult> {
    return this.emergencySafetyService.evaluateTriage(dto);
  }

  async getGuides(): Promise<EmergencyCaseDocument[]> {
    return this.emergencyCaseModel.find().sort({ urgencyLevel: 1 }).exec();
  }

  async getGuideBySlug(slug: string): Promise<EmergencyCaseDocument> {
    const guide = await this.emergencyCaseModel.findOne({ slug }).exec();
    if (!guide) {
      throw new NotFoundException(`Không tìm thấy hướng dẫn sơ cứu cho: ${slug}`);
    }
    return guide;
  }

  async createCase(dto: CreateEmergencyCaseDto): Promise<EmergencyCaseDocument> {
    const created = new this.emergencyCaseModel(dto);
    return created.save();
  }
}
