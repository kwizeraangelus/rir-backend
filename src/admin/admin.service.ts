// src/admin/admin.service.ts
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { UniversityUpload } from '../university/entities/university-upload.entity';
import { Event } from '../event/entities/event.entity';
import { Publication } from '../researcher/entities/publication.entity';
import { Innovation } from 'src/innovation/entities/innovation.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(UniversityUpload)
    private uploadRepo: Repository<UniversityUpload>,
    @InjectRepository(Event) private eventRepo: Repository<Event>,
    @InjectRepository(Publication) private pubRepo: Repository<Publication>,
    @InjectRepository(Innovation)
    private innovationRepo: Repository<Innovation>,
  ) {}

  async getDashboardData() {
    const [pendingList, userCount, approvedBookCount, eventCount] =
      await Promise.all([
        // 1. Get the actual list of pending items
        this.uploadRepo.find({
          where: { status: 'pending' },
          relations: ['user'],
          select: {
            id: true,
            title: true,
            file_path: true,
            cover_image: true,
            submission_type: true,
            authors: true,
            status: true,
            user: {
              id: true,
              first_name: true, // adjust to your actual field name
            },
          },
        }),
        // 2. Count Total Users
        this.userRepo.count(),
        // 3. Count ALL Books (University Uploads) that are approved
        this.uploadRepo.count({
          where: { status: 'approved' },
          relations: ['user'],
        }),
        // 4. Count All Events
        this.eventRepo.count(),
      ]);

    return {
      kpis: {
        total_users: userCount,
        total_books: approvedBookCount, // <--- This is your "Total Books"
        total_events: eventCount,
        pending_count: pendingList.length,
      },
      pending: pendingList.map((item) => ({
        ...item,
        author_name: item.user?.first_name ?? 'Unknown', // ✅ map it here
      })),
    };
  }

  // src/admin/admin.service.ts

  async processUpload(id: string, action: string, feedback?: string) {
    // 1. Prepare the update data object
    const updateData = {
      status: action === 'approve' ? 'approved' : 'rejected',
      // Only save feedback if the action is 'reject'
      feedback: action === 'reject' ? feedback || 'No feedback provided' : null,
    } as Partial<UniversityUpload>;

    // 2. Perform the update in one go
    await this.uploadRepo.update(id, updateData);

    return {
      message: `Upload ${updateData.status} successfully`,
      status: updateData.status,
    };
  }

  async getUsers() {
    return this.userRepo.find();
  }

  async updateUser(id: string, data: any) {
    await this.userRepo.update(id, data);
    return { message: 'User updated' };
  }

  // src/admin/admin.service.ts
  async deleteUser(id: string) {
    // 1. Delete all uploads by this user first
    await this.uploadRepo.delete({ user: { id: id } });

    // 2. Delete all events by this user
    await this.eventRepo.delete({ user: { id: id } });

    // 3. Now you can safely delete the user
    await this.userRepo.delete(id);

    return { message: 'User and all their data deleted successfully' };
  }

  async getApprovedBooks(filters: any) {
    const where: any = { status: 'approved' };
    if (filters.title) where.title = Like(`%${filters.title}%`);
    if (filters.university) where.university = Like(`%${filters.university}%`);

    const books = await this.uploadRepo.find({ where });
    return { books };
  }

  async createUser(data: any) {
    const { email, username, password } = data;

    // 1. Check for duplicates
    const existing = await this.userRepo.findOne({
      where: [{ email }, { username }],
    });
    if (existing) {
      throw new ConflictException('Email or Username already exists');
    }

    // 2. Create the user object
    // Note: Since your User entity has @BeforeInsert(),
    // it will handle hashing the password automatically.
    const newUser = this.userRepo.create(data);

    await this.userRepo.save(newUser);

    return { message: 'User created successfully by Admin' };
  }

  // src/admin/admin.service.ts
  async createEvent(adminId: string, data: any, photoPath: string | null) {
    const newEvent = this.eventRepo.create({
      ...data,
      photo: photoPath, // Matches your entity column name
      user: { id: adminId } as any,
    });

    await this.eventRepo.save(newEvent);
    return { message: 'Event created successfully by Admin' };
  }

  // src/admin/admin.service.ts

  async getAllEvents() {
    return this.eventRepo.find({
      relations: ['user'], // Shows who created the event
      order: { created_at: 'DESC' }, // Newest events first
    });
  }

  // src/admin/admin.service.ts

  async deleteEvent(id: string) {
    const event = await this.eventRepo.findOneBy({ id });

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    await this.eventRepo.remove(event);

    return { message: 'Event deleted successfully' };
  }

  // src/admin/admin.service.ts
  async updateEvent(id: string, data: any, photoPath?: string) {
    const event = await this.eventRepo.findOneBy({ id });
    if (!event) throw new NotFoundException('Event not found');

    // Create an update object
    const updateData = { ...data };

    // Only update photo if a new one was uploaded
    if (photoPath) {
      updateData.photo = photoPath;
    }

    await this.eventRepo.update(id, updateData);
    return { message: 'Event updated successfully' };
  }

  // src/admin/admin.service.ts

  async deleteBook(id: string) {
    const book = await this.uploadRepo.findOneBy({ id });

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    // This will remove the record from the university_uploads table
    await this.uploadRepo.remove(book);

    return { message: 'Book deleted successfully' };
  }

  // src/events/event.service.ts
  async findPending() {
    return this.eventRepo.find({
      where: { status: false },
      order: { created_at: 'DESC' },
    });
  }

  async updateStatus(id: string, status: boolean) {
    await this.eventRepo.update(id, { status, rejection_feedback: undefined });
    return { message: 'Status updated' };
  }

  async rejectEvent(id: string, feedback: string) {
    // Option A: Update with feedback and keep status false
    await this.eventRepo.update(id, {
      rejection_feedback: feedback,
      status: false,
    });
    // Option B: You could also delete it here if you prefer
    return { message: 'Event rejected with feedback' };
  }

  async remove(id: string) {
    return this.eventRepo.delete(id);
  }

  // src/admin/admin.service.ts

  async getPendingPublications() {
    return this.pubRepo.find({
      where: { status: false },
      relations: ['user'], // To show who submitted it
      order: { created_at: 'DESC' },
    });
  }

  async approvePublication(id: string) {
    return this.pubRepo.update(id, { status: true });
  }

  async rejectPublication(id: string, feedback: string) {
    // You can store feedback in a 'rejection_feedback' column if you add it to the entity
    return this.pubRepo.update(id, { status: false });
  }

  async deletePublication(id: string) {
    return this.pubRepo.delete(id);
  }

  // src/admin/admin.service.ts

  async getPendingInnovations() {
    return this.innovationRepo.find({
      where: { status: false },
      relations: ['user'], // Shows who submitted it
      order: { created_at: 'DESC' },
    });
  }

  async approveInnovation(id: string) {
    return this.innovationRepo.update(id, { status: true });
  }

  async rejectInnovation(id: string, feedback: string) {
    // If you added a feedback column to the Innovation entity:
    // return this.innovationRepo.update(id, { status: false, rejection_feedback: feedback });
    return this.innovationRepo.update(id, { status: false });
  }

  async deleteInnovation(id: string) {
    return this.innovationRepo.delete(id);
  }
}
