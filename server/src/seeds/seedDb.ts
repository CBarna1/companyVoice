import sequelize from '../config/database';
import { initializeModels, User, Post, PostTag, Vote, Comment, SolutionLink, Setting } from '../models';
import bcrypt from 'bcryptjs';

const seedDatabase = async () => {
  try {
    // Initialize models
    initializeModels(sequelize);

    // Sync database
    await sequelize.sync({ force: true });
    console.log('Database synced');

    // Create admin users
    const admin1 = await User.create({
      name: 'Admin User',
      email: 'admin@companyvoice.com',
      password_hash: await bcrypt.hash('AdminPassword123', 12),
      role: 'admin',
      xp: 0,
      tier: 'Innovator',
    });

    const admin2 = await User.create({
      name: 'Admin Support',
      email: 'support@companyvoice.com',
      password_hash: await bcrypt.hash('SupportPass123', 12),
      role: 'admin',
      xp: 0,
      tier: 'Champion',
    });

    // Create employee users
    const employees = await Promise.all([
      User.create({
        name: 'John Developer',
        email: 'john@company.com',
        password_hash: await bcrypt.hash('Pass123456', 12),
        role: 'employee',
        xp: 250,
        tier: 'Contributor',
      }),
      User.create({
        name: 'Sarah Designer',
        email: 'sarah@company.com',
        password_hash: await bcrypt.hash('Pass123456', 12),
        role: 'employee',
        xp: 450,
        tier: 'Champion',
      }),
      User.create({
        name: 'Mike Manager',
        email: 'mike@company.com',
        password_hash: await bcrypt.hash('Pass123456', 12),
        role: 'employee',
        xp: 320,
        tier: 'Champion',
      }),
      User.create({
        name: 'Lisa Marketing',
        email: 'lisa@company.com',
        password_hash: await bcrypt.hash('Pass123456', 12),
        role: 'employee',
        xp: 180,
        tier: 'Contributor',
      }),
      User.create({
        name: 'David Finance',
        email: 'david@company.com',
        password_hash: await bcrypt.hash('Pass123456', 12),
        role: 'employee',
        xp: 520,
        tier: 'Innovator',
      }),
      User.create({
        name: 'Emma HR',
        email: 'emma@company.com',
        password_hash: await bcrypt.hash('Pass123456', 12),
        role: 'employee',
        xp: 290,
        tier: 'Contributor',
      }),
      User.create({
        name: 'Tom Operations',
        email: 'tom@company.com',
        password_hash: await bcrypt.hash('Pass123456', 12),
        role: 'employee',
        xp: 150,
        tier: 'Newcomer',
      }),
      User.create({
        name: 'Anna Sales',
        email: 'anna@company.com',
        password_hash: await bcrypt.hash('Pass123456', 12),
        role: 'employee',
        xp: 370,
        tier: 'Champion',
      }),
    ]);

    // Create posts
    const post1 = await Post.create({
      user_id: employees[0].id,
      type: 'challenge',
      title: 'Slow Database Queries',
      body: 'Our database queries are taking too long during peak hours. We need to optimize performance.',
      department: 'Engineering',
      status: 'open',
      is_anonymous: false,
      upvotes: 24,
      downvotes: 2,
      xp_awarded: 50,
    });

    const post2 = await Post.create({
      user_id: employees[1].id,
      type: 'solution',
      title: 'Implement Caching Layer',
      body: 'I propose implementing Redis caching layer for frequently accessed data.',
      department: 'Engineering',
      status: 'open',
      is_anonymous: false,
      upvotes: 18,
      downvotes: 1,
      xp_awarded: 80,
    });

    const post3 = await Post.create({
      user_id: employees[2].id,
      type: 'both',
      title: 'Improve Team Communication',
      body: 'Challenge: Our cross-departmental communication is inefficient. Solution: Implement a centralized communication hub with scheduled sync meetings.',
      department: 'Operations',
      status: 'in_progress',
      is_anonymous: false,
      upvotes: 15,
      downvotes: 3,
      xp_awarded: 120,
    });

    const post4 = await Post.create({
      user_id: null,
      type: 'challenge',
      title: 'Remote Work Policy Clarity',
      body: 'Need clearer guidelines on remote work expectations and requirements.',
      department: 'HR',
      status: 'open',
      is_anonymous: true,
      upvotes: 32,
      downvotes: 5,
      xp_awarded: 50,
    });

    const post5 = await Post.create({
      user_id: employees[3].id,
      type: 'solution',
      title: 'New Marketing Automation Tool',
      body: 'Implement HubSpot for better campaign automation and lead tracking.',
      department: 'Marketing',
      status: 'resolved',
      is_anonymous: false,
      upvotes: 28,
      downvotes: 2,
      xp_awarded: 230,
    });

    const post6 = await Post.create({
      user_id: employees[4].id,
      type: 'challenge',
      title: 'Budget Tracking System',
      body: 'We need a more transparent and real-time budget tracking system.',
      department: 'Finance',
      status: 'in_progress',
      is_anonymous: false,
      upvotes: 12,
      downvotes: 1,
      xp_awarded: 50,
    });

    const post7 = await Post.create({
      user_id: employees[5].id,
      type: 'solution',
      title: 'Employee Wellness Program',
      body: 'Introduce a comprehensive wellness program with gym memberships and mental health support.',
      department: 'HR',
      status: 'open',
      is_anonymous: false,
      upvotes: 42,
      downvotes: 1,
      xp_awarded: 80,
    });

    const post8 = await Post.create({
      user_id: null,
      type: 'challenge',
      title: 'Work-Life Balance',
      body: 'Finding it hard to maintain work-life balance with current workload.',
      department: 'Engineering',
      status: 'open',
      is_anonymous: true,
      upvotes: 38,
      downvotes: 2,
      xp_awarded: 50,
    });

    const post9 = await Post.create({
      user_id: employees[6].id,
      type: 'solution',
      title: 'Implement Code Review Standards',
      body: 'Establish clear code review standards and checklists to improve code quality.',
      department: 'Engineering',
      status: 'resolved',
      is_anonymous: false,
      upvotes: 51,
      downvotes: 0,
      xp_awarded: 230,
    });

    const post10 = await Post.create({
      user_id: employees[7].id,
      type: 'both',
      title: 'Sales Process Optimization',
      body: 'Challenge: Sales pipeline is slow and complex. Solution: Streamline process with automated follow-ups.',
      department: 'Sales',
      status: 'open',
      is_anonymous: false,
      upvotes: 19,
      downvotes: 4,
      xp_awarded: 120,
    });

    // Add tags to posts
    await Promise.all([
      PostTag.create({ post_id: post1.id, tag: 'performance' }),
      PostTag.create({ post_id: post1.id, tag: 'backend' }),
      PostTag.create({ post_id: post2.id, tag: 'backend' }),
      PostTag.create({ post_id: post2.id, tag: 'optimization' }),
      PostTag.create({ post_id: post3.id, tag: 'communication' }),
      PostTag.create({ post_id: post3.id, tag: 'process' }),
      PostTag.create({ post_id: post4.id, tag: 'policy' }),
      PostTag.create({ post_id: post5.id, tag: 'marketing' }),
      PostTag.create({ post_id: post5.id, tag: 'automation' }),
      PostTag.create({ post_id: post6.id, tag: 'finance' }),
      PostTag.create({ post_id: post6.id, tag: 'tracking' }),
      PostTag.create({ post_id: post7.id, tag: 'wellness' }),
      PostTag.create({ post_id: post7.id, tag: 'hr' }),
      PostTag.create({ post_id: post8.id, tag: 'wellbeing' }),
      PostTag.create({ post_id: post9.id, tag: 'code-quality' }),
      PostTag.create({ post_id: post9.id, tag: 'standards' }),
      PostTag.create({ post_id: post10.id, tag: 'sales' }),
      PostTag.create({ post_id: post10.id, tag: 'efficiency' }),
    ]);

    // Create solution links
    await SolutionLink.create({
      challenge_post_id: post1.id,
      solution_post_id: post2.id,
    });

    await SolutionLink.create({
      challenge_post_id: post6.id,
      solution_post_id: post9.id,
    });

    // Create votes
    const votesData = [
      { user_id: employees[1].id, post_id: post1.id, direction: 'up' as const },
      { user_id: employees[2].id, post_id: post1.id, direction: 'up' as const },
      { user_id: employees[3].id, post_id: post2.id, direction: 'up' as const },
      { user_id: employees[4].id, post_id: post2.id, direction: 'up' as const },
      { user_id: employees[0].id, post_id: post3.id, direction: 'down' as const },
      { user_id: employees[5].id, post_id: post5.id, direction: 'up' as const },
      { user_id: employees[6].id, post_id: post5.id, direction: 'up' as const },
    ];

    await Promise.all(votesData.map((vote) => Vote.create(vote)));

    // Create comments
    const comments = await Promise.all([
      Comment.create({
        post_id: post1.id,
        user_id: employees[1].id,
        body: 'Great observation! I think we should look at query optimization first.',
        is_anonymous: false,
      }),
      Comment.create({
        post_id: post2.id,
        user_id: employees[0].id,
        body: 'This sounds like a solid solution. What about cache invalidation?',
        is_anonymous: false,
      }),
      Comment.create({
        post_id: post4.id,
        user_id: null,
        body: 'I completely agree. A clear policy would help everyone.',
        is_anonymous: true,
      }),
      Comment.create({
        post_id: post7.id,
        user_id: employees[3].id,
        body: 'This would be amazing for employee satisfaction.',
        is_anonymous: false,
      }),
      Comment.create({
        post_id: post9.id,
        user_id: employees[2].id,
        body: 'Already seeing improved code quality since implementation!',
        is_anonymous: false,
      }),
    ]);

    // Create settings
    await Setting.create({
      key: 'anonymity_enabled',
      value: 'true',
    });

    console.log('Seed data created successfully');
    console.log('Admin credentials:');
    console.log('  Email: admin@companyvoice.com');
    console.log('  Password: AdminPassword123');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedDatabase();
