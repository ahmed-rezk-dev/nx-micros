import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 255 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'short_description', length: 500, nullable: true })
  shortDescription?: string;

  @Column({ name: 'instructor_id', nullable: true })
  instructorId?: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'instructor_id' })
  instructor?: User;

  @Column({ length: 100, nullable: true })
  category?: string;

  @Column({ default: 'beginner' })
  level!: 'beginner' | 'intermediate' | 'advanced';

  @Column({ name: 'access_type', default: 'subscription' })
  accessType!: 'lifetime' | 'subscription';

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price?: number;

  @Column({ length: 3, default: 'USD' })
  currency!: string;

  @Column({ name: 'duration_hours', type: 'int', nullable: true })
  durationHours?: number;

  @Column({ name: 'thumbnail_url', length: 500, nullable: true })
  thumbnailUrl?: string;

  @Column({ name: 'video_preview_url', length: 500, nullable: true })
  videoPreviewUrl?: string;

  @Column({ name: 'is_published', default: false })
  isPublished!: boolean;

  @Column({ name: 'is_featured', default: false })
  isFeatured!: boolean;

  @Column({ name: 'total_students', default: 0 })
  totalStudents!: number;

  @Column({
    name: 'rating',
    type: 'decimal',
    precision: 3,
    scale: 2,
    default: 0.0,
  })
  rating!: number;

  @Column({ name: 'total_ratings', default: 0 })
  totalRatings!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
