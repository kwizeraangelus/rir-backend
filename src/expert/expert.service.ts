import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateExpertDto } from './dto/create-expert.dto';
import { UpdateExpertDto } from './dto/update-expert.dto';
import { Expert } from './entities/expert.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ExpertService {
  constructor(
    @InjectRepository(Expert)
    private readonly expertRepository: Repository<Expert>, // Replaces private experts Map
  ) {}

  async create(createExpertDto: CreateExpertDto): Promise<Expert> {
    const id = uuidv4();
    
    // Format incoming certification string dates into JavaScript Dates
    const formattedCertifications = (createExpertDto.certifications || []).map(cert => ({
      ...cert,
      dateObtained: typeof cert.dateObtained === 'string' 
        ? new Date(cert.dateObtained) 
        : cert.dateObtained,
    }));

    // Create record instance mapping DTO data to database fields
    const expert = this.expertRepository.create({
      id,
      ...createExpertDto,
      certifications: formattedCertifications,
      verified: createExpertDto.verified || false,
    });

    return await this.expertRepository.save(expert); // SAVES DIRECTLY TO MYSQL
  }

  async findAll(): Promise<Expert[]> {
    return await this.expertRepository.find(); // FETCHES ALL ROWS FROM MYSQL
  }

  async findOne(id: string): Promise<Expert> {
    const expert = await this.expertRepository.findOneBy({ id });
    if (!expert) {
      throw new NotFoundException(`Expert with id ${id} not found`);
    }
    return expert;
  }

  async findById(id: string): Promise<Expert> {
    return await this.findOne(id);
  }

  async update(id: string, updateExpertDto: UpdateExpertDto): Promise<Expert> {
    const expert = await this.findOne(id); // Ensures record exists first

    let formattedCertifications = expert.certifications;
    if (updateExpertDto.certifications) {
      formattedCertifications = updateExpertDto.certifications.map(cert => ({
        ...cert,
        dateObtained: typeof cert.dateObtained === 'string' 
          ? new Date(cert.dateObtained) 
          : cert.dateObtained,
      }));
    }

    // Merge updates into our found entity profile instance
    const updatedData = this.expertRepository.merge(expert, {
      ...updateExpertDto,
      certifications: formattedCertifications,
    });

    return await this.expertRepository.save(updatedData); // PERSISTS UPDATES TO MYSQL
  }

  async remove(id: string): Promise<{ message: string }> {
    const expert = await this.findOne(id);
    await this.expertRepository.delete(id); // REMOVES RECORD FROM MYSQL
    return { message: `Expert ${expert.name} deleted successfully` };
  }

  async verify(id: string): Promise<Expert> {
    const expert = await this.findOne(id);
    expert.verified = true;
    return await this.expertRepository.save(expert);
  }

  async unverify(id: string): Promise<Expert> {
    const expert = await this.findOne(id);
    expert.verified = false;
    return await this.expertRepository.save(expert);
  }

  async uploadProfileImage(id: string, filePath: string): Promise<Expert> {
    const expert = await this.findOne(id);
    expert.profileImage = filePath;
    return await this.expertRepository.save(expert);
  }
}
