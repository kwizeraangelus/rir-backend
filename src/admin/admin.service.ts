// src/admin/admin.service.ts
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { User, UserCategory } from '../users/entities/user.entity';
import { UniversityUpload } from '../university/entities/university-upload.entity';
import { Event } from '../event/entities/event.entity';
import { Publication } from '../researcher/entities/publication.entity';
import { Innovation } from 'src/innovation/entities/innovation.entity';
import { Contact } from '../contact/contact.entity';
import { MailService } from 'src/mail/mail.service';
// add to constructor


@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(UniversityUpload)
    private uploadRepo: Repository<UniversityUpload>,
    @InjectRepository(Event) private eventRepo: Repository<Event>,
    @InjectRepository(Publication) private pubRepo: Repository<Publication>,
    @InjectRepository(Innovation) private innovationRepo: Repository<Innovation>,
    @InjectRepository(Contact) private contactRepo: Repository<Contact>,
    private mailService: MailService,
  ) {}

  // small helper: turns [{ key: 'fyp', count: '12' }] into { fyp: 12 }
private toCountMap(rows: { key: string | null; count: string }[]) {
  return rows.reduce<Record<string, number>>((acc, row) => {
    acc[(row.key ?? 'unknown').toLowerCase()] = Number(row.count);
    return acc;
  }, {});
}

async getDashboardData() {
  const [
    pendingList,
    userCount,
    usersByRoleRows,
    approvedBookCount,
    approvedTypeRows,
    publicationCount,
    publicationsByTypeRows,
    pendingInnovationCount,
    eventCount,
  ] = await Promise.all([
    // 1. Pending list
    this.uploadRepo.find({
      where: { status: 'pending' },
      relations: ['user'],
      select: {
        id: true,
        title: true,
        file_path: true,
        cover_image: true,
        submission_type: true,
        supervisor_name: true,
        authors: true,
        university: true,
        status: true,
        user: { id: true, first_name: true },
      },
    }),

    // 2. Total users
    this.userRepo.count(),

    // 3. Users grouped by role
    this.userRepo
      .createQueryBuilder('u')
      .select('u.user_category', 'key')
      .addSelect('COUNT(*)', 'count')
      .where('u.user_category IN (:...roles)', {
        roles: [UserCategory.RESEARCHER, UserCategory.UNIVERSITY],
      })
      .groupBy('u.user_category')
      .getRawMany(),

    // 4. Total approved books
    this.uploadRepo.count({ where: { status: 'approved' } }),

    // 5. Approved books: fetch only the type columns, classify below
    this.uploadRepo
      .createQueryBuilder('b')
      .select(['b.id', 'b.degree_type', 'b.submission_type'])
      .where('b.status = :status', { status: 'approved' })
      .getMany(),

    // 6. Total publications
    this.pubRepo.count(),

    // 7. Publications grouped by type
    this.pubRepo
      .createQueryBuilder('p')
      .select('p.publication_type', 'key')
      .addSelect('COUNT(*)', 'count')
      .groupBy('p.publication_type')
      .getRawMany(),

    // 8. Pending innovations
    this.innovationRepo.count({ where: { status: false } }),

    // 9. Events
    this.eventRepo.count(),
  ]);

  const usersByRole = this.toCountMap(usersByRoleRows);
  const publicationsByType = this.toCountMap(publicationsByTypeRows);

  // same rule as getDegreeLabel on the page
  const classify = (b: { degree_type?: string; submission_type?: string }) => {
    const raw = (b.degree_type || b.submission_type || '').toLowerCase();
    if (raw.includes('fyp') || raw.includes('final')) return 'fyp';
    if (raw.includes('thes') || raw.includes('dissert')) return 'theses';
    return 'other';
  };

  const booksByDegree = { fyp: 0, theses: 0, other: 0 };
  for (const b of approvedTypeRows) {
    booksByDegree[classify(b)]++;
  }

  return {
    kpis: {
      total_users: userCount,
      users_by_role: {
        researcher: usersByRole['researcher'] ?? 0,
        university: usersByRole['university'] ?? 0,
      },

      total_books: approvedBookCount,
      books_by_degree: {
        fyp: booksByDegree.fyp,
        theses: booksByDegree.theses,
      },

      total_publications: publicationCount,
      publications_by_type: {
        journal: publicationsByType['journal'] ?? 0,
        conference: publicationsByType['conference'] ?? 0,
      },

      total_events: eventCount,
      pending_count: pendingList.length,
      pending_innovations_count: pendingInnovationCount,
    },
    pending: pendingList.map((item) => ({
      ...item,
      author_name: item.user?.first_name ?? 'Unknown',
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
  const qb = this.uploadRepo
    .createQueryBuilder('b')
    .leftJoinAndSelect('b.user', 'u')
    .where('b.status = :status', { status: 'approved' });

  if (filters.title) {
    qb.andWhere('b.title LIKE :title', { title: `%${filters.title}%` });
  }

  if (filters.author) {
    qb.andWhere('b.authors LIKE :author', { author: `%${filters.author}%` });
  }

  if (filters.university) {
    // search the book's own value AND the uploader's university account
    qb.andWhere('(b.university LIKE :uni OR u.university_name LIKE :uni)', {
      uni: `%${filters.university}%`,
    });
  }

  // the page sends "category"; also accept "submission_type"
  const category = filters.category ?? filters.submission_type;
  if (category) {
    qb.andWhere('(b.submission_type LIKE :cat OR b.degree_type LIKE :cat)', {
      cat: `%${category}%`,
    });
  }

  if (filters.supervisor_name) {
    qb.andWhere('b.supervisor_name LIKE :sup', {
      sup: `%${filters.supervisor_name}%`,
    });
  }

  const rows = await qb.orderBy('b.created_at', 'DESC').getMany();

  const books = rows.map(({ user, ...book }) => ({
    ...book,
    university: book.university?.trim() || user?.university_name || '',
  }));

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
 async createResearch(adminId: string, data: any) {
  const assignedToExpertId = data.assignedToExpertId && data.assignedToExpertId.trim() !== '' 
    ? data.assignedToExpertId 
    : null;

  const publication = this.pubRepo.create({
    title: data.title,
    authors: data.authors || [],
    journal_name: data.journal_name,
    conference_info: data.conference_info,
    doi: data.doi,
    url: data.url,
    publisher: data.publisher,
    book_title: data.book_title,
    publication_type: data.publication_type || 'journal',
    status: data.status ?? true,
    assignedToExpertId: assignedToExpertId,     // ← Fixed
    userId: adminId,
  });

  const savedPub = await this.pubRepo.save(publication);

  return {
    message: 'Research created successfully',
    publication: savedPub,
  };
}

// add Contact import at top


async getMessages() {
  return this.contactRepo.find({ order: { created_at: 'DESC' } });
}

async markMessageRead(id: string) {
  return this.contactRepo.update(id, { is_read: true });
}

async deleteMessage(id: string) {
  return this.contactRepo.delete(id);
}

async replyToMessage(id: string, reply: string) {
  const contact = await this.contactRepo.findOne({ where: { id } });
  if (!contact) throw new NotFoundException('Message not found');
  await this.mailService.sendReply(contact.email, contact.name, reply);
  return { success: true };
}






async getAllPublications(search = '', page = 1, limit = 10) {
  const safePage = Math.max(Number(page) || 1, 1);
  const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 100);

  const qb = this.pubRepo
    .createQueryBuilder('p')
    .leftJoin('p.user', 'u')
    // select only safe user fields, never the password hash or tokens
    .addSelect(['u.id', 'u.first_name', 'u.last_name', 'u.email']);

  if (search.trim()) {
    qb.where(
      `(p.title LIKE :s
        OR p.authors LIKE :s
        OR p.journal_name LIKE :s
        OR p.conference_info LIKE :s
        OR p.doi LIKE :s
        OR p.publisher LIKE :s
        OR u.first_name LIKE :s
        OR u.last_name LIKE :s)`,
      { s: `%${search.trim()}%` },
    );
  }

  const [items, total] = await qb
    .orderBy('p.created_at', 'DESC')
    .skip((safePage - 1) * safeLimit)
    .take(safeLimit)
    .getManyAndCount();

  return {
    items,
    total,
    page: safePage,
    limit: safeLimit,
    totalPages: Math.max(Math.ceil(total / safeLimit), 1),
  };
}

async deletePublicationById(id: string) {
  const pub = await this.pubRepo.findOneBy({ id });
  if (!pub) throw new NotFoundException(`Publication with ID ${id} not found`);
  await this.pubRepo.remove(pub);
  return { message: 'Publication deleted successfully' };
}
}
