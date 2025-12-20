import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ nullable: true })
  passwordHash?: string;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ nullable: true })
  avatarUrl?: string;

  @Column({ type: 'text', nullable: true })
  bio?: string;

  @Column({ default: 'student' })
  role!: string;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ default: false })
  emailVerified!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // Relations
  @OneToMany(() => Course, (course) => course.instructor)
  courses!: Course[];

  @OneToMany(() => CoursePurchase, (purchase) => purchase.user)
  purchases!: CoursePurchase[];

  @OneToMany(() => Subscription, (subscription) => subscription.user)
  subscriptions!: Subscription[];

  @OneToMany(() => UserProgress, (progress) => progress.user)
  progress!: UserProgress[];

  @OneToMany(() => CommunityPost, (post) => post.user)
  posts!: CommunityPost[];

  @OneToMany(() => Certificate, (certificate) => certificate.user)
  certificates!: Certificate[];
}

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ nullable: true })
  shortDescription: string;

  @Column('uuid')
  instructorId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'instructorId' })
  instructor: User;

  @Column()
  category: string;

  @Column({ default: 'beginner' })
  level: string;

  @Column({ default: 'subscription' })
  accessType: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price: number;

  @Column({ default: 'USD' })
  currency: string;

  @Column({ nullable: true })
  durationHours: number;

  @Column({ nullable: true })
  thumbnailUrl: string;

  @Column({ nullable: true })
  videoPreviewUrl: string;

  @Column({ default: false })
  isPublished: boolean;

  @Column({ default: false })
  isFeatured: boolean;

  @Column({ default: 0 })
  totalStudents: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  rating: number;

  @Column({ default: 0 })
  totalRatings: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => CourseModule, (module) => module.course)
  modules: CourseModule[];

  @OneToMany(() => CoursePurchase, (purchase) => purchase.course)
  purchases: CoursePurchase[];

  @OneToMany(() => UserProgress, (progress) => progress.course)
  progress: UserProgress[];

  @OneToMany(() => Certificate, (certificate) => certificate.course)
  certificates: Certificate[];
}

@Entity('course_purchases')
export class CoursePurchase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column('uuid')
  courseId: string;

  @ManyToOne(() => Course)
  @JoinColumn({ name: 'courseId' })
  course: Course;

  @Column({ type: 'timestamp' })
  purchaseDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  pricePaid: number;

  @Column({ default: 'USD' })
  currency: string;

  @Column()
  paymentMethod: string;

  @Column({ nullable: true })
  transactionId: string;

  @Column({ default: 'none' })
  refundStatus: string;

  @CreateDateColumn()
  createdAt: Date;
}

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  planType: string;

  @Column({ default: 'active' })
  status: string;

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  endDate: Date;

  @Column({ default: true })
  autoRenew: boolean;

  @Column({ nullable: true })
  paymentMethod: string;

  @Column({ type: 'timestamp', nullable: true })
  lastPaymentDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  nextPaymentDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('course_modules')
export class CourseModule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  courseId: string;

  @ManyToOne(() => Course)
  @JoinColumn({ name: 'courseId' })
  course: Course;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column()
  orderIndex: number;

  @Column({ nullable: true })
  durationMinutes: number;

  @Column({ default: false })
  isLocked: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => Lesson, (lesson) => lesson.module)
  lessons: Lesson[];
}

@Entity('lessons')
export class Lesson {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  moduleId: string;

  @ManyToOne(() => CourseModule)
  @JoinColumn({ name: 'moduleId' })
  module: CourseModule;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column()
  contentType: string;

  @Column({ nullable: true })
  contentUrl: string;

  @Column({ type: 'text', nullable: true })
  contentText: string;

  @Column({ nullable: true })
  durationMinutes: number;

  @Column()
  orderIndex: number;

  @Column({ default: false })
  isPreview: boolean;

  @Column({ default: false })
  isLocked: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => UserProgress, (progress) => progress.lesson)
  progress: UserProgress[];

  @OneToMany(() => Quiz, (quiz) => quiz.lesson)
  quizzes: Quiz[];
}

@Entity('user_progress')
export class UserProgress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column('uuid')
  courseId: string;

  @ManyToOne(() => Course)
  @JoinColumn({ name: 'courseId' })
  course: Course;

  @Column('uuid')
  lessonId: string;

  @ManyToOne(() => Lesson)
  @JoinColumn({ name: 'lessonId' })
  lesson: Lesson;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  progressPercentage: number;

  @Column({ default: 0 })
  timeSpentSeconds: number;

  @Column({ default: false })
  isCompleted: boolean;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;

  @Column({ type: 'timestamp', default: () => 'NOW()' })
  lastAccessed: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('quizzes')
export class Quiz {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  lessonId: string;

  @ManyToOne(() => Lesson)
  @JoinColumn({ name: 'lessonId' })
  lesson: Lesson;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 70 })
  passingScore: number;

  @Column({ nullable: true })
  timeLimitMinutes: number;

  @Column({ default: 3 })
  maxAttempts: number;

  @Column({ default: true })
  isRequired: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('certificates')
export class Certificate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column('uuid')
  courseId: string;

  @ManyToOne(() => Course)
  @JoinColumn({ name: 'courseId' })
  course: Course;

  @Column({ unique: true })
  certificateNumber: string;

  @Column({ type: 'timestamp' })
  issuedDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  expiryDate: Date;

  @Column()
  downloadUrl: string;

  @CreateDateColumn()
  createdAt: Date;
}

@Entity('community_posts')
export class CommunityPost {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column('uuid', { nullable: true })
  courseId: string;

  @ManyToOne(() => Course)
  @JoinColumn({ name: 'courseId' })
  course: Course;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ default: 'discussion' })
  postType: string;

  @Column({ default: false })
  isPinned: boolean;

  @Column({ default: false })
  isLocked: boolean;

  @Column({ default: 0 })
  viewCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => CommunityComment, (comment) => comment.post)
  comments: CommunityComment[];
}

@Entity('community_comments')
export class CommunityComment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  postId: string;

  @ManyToOne(() => CommunityPost)
  @JoinColumn({ name: 'postId' })
  post: CommunityPost;

  @Column('uuid')
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column('uuid', { nullable: true })
  parentCommentId: string;

  @ManyToOne(() => CommunityComment)
  @JoinColumn({ name: 'parentCommentId' })
  parentComment: CommunityComment;

  @Column({ type: 'text' })
  content: string;

  @Column({ default: false })
  isAnswer: boolean;

  @Column({ default: 0 })
  upvoteCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => CommunityComment, (comment) => comment.parentComment)
  replies: CommunityComment[];
}
