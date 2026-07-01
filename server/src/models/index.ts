import { DataTypes, Model, Sequelize } from 'sequelize';

export class User extends Model {
  declare id: number;
  declare name: string;
  declare email: string;
  declare password_hash: string;
  declare role: 'employee' | 'admin';
  declare xp: number;
  declare tier: 'Newcomer' | 'Contributor' | 'Champion' | 'Innovator';
  declare created_at: Date;
  declare updated_at: Date;
}

export class Post extends Model {
  declare id: number;
  declare user_id: number | null;
  declare type: 'challenge' | 'solution' | 'both';
  declare title: string;
  declare body: string;
  declare department: string;
  declare status: 'open' | 'in_progress' | 'resolved';
  declare is_anonymous: boolean;
  declare upvotes: number;
  declare downvotes: number;
  declare xp_awarded: number;
  declare created_at: Date;
  declare updated_at: Date;
  // Associations
  declare user?: User;
  declare tags?: PostTag[];
  declare comments?: Comment[];
  declare postVotes?: Vote[];
  declare solutions?: SolutionLink[];
  declare solvedChallenges?: SolutionLink[];
}

export class PostTag extends Model {
  declare id: number;
  declare post_id: number;
  declare tag: string;
}

export class Vote extends Model {
  declare id: number;
  declare user_id: number;
  declare post_id: number;
  declare direction: 'up' | 'down';
  declare created_at: Date;
}

export class Comment extends Model {
  declare id: number;
  declare post_id: number;
  declare user_id: number | null;
  declare body: string;
  declare is_anonymous: boolean;
  declare created_at: Date;
}

export class SolutionLink extends Model {
  declare id: number;
  declare challenge_post_id: number;
  declare solution_post_id: number;
}

export class Setting extends Model {
  declare id: number;
  declare key: string;
  declare value: string;
}

export function initializeModels(sequelize: Sequelize) {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password_hash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM('employee', 'admin'),
        defaultValue: 'employee',
      },
      xp: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      tier: {
        type: DataTypes.ENUM('Newcomer', 'Contributor', 'Champion', 'Innovator'),
        defaultValue: 'Newcomer',
      },
    },
    {
      sequelize,
      tableName: 'users',
      timestamps: true,
      underscored: true,
    }
  );

  Post.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: User,
          key: 'id',
        },
      },
      type: {
        type: DataTypes.ENUM('challenge', 'solution', 'both'),
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      department: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('open', 'in_progress', 'resolved'),
        defaultValue: 'open',
      },
      is_anonymous: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      upvotes: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      downvotes: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      xp_awarded: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      tableName: 'posts',
      timestamps: true,
      underscored: true,
    }
  );

  PostTag.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      post_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Post,
          key: 'id',
        },
      },
      tag: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'post_tags',
      timestamps: false,
    }
  );

  Vote.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: User,
          key: 'id',
        },
      },
      post_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Post,
          key: 'id',
        },
      },
      direction: {
        type: DataTypes.ENUM('up', 'down'),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'votes',
      timestamps: true,
      underscored: true,
    }
  );

  Comment.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      post_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Post,
          key: 'id',
        },
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: User,
          key: 'id',
        },
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      is_anonymous: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      tableName: 'comments',
      timestamps: true,
      underscored: true,
    }
  );

  SolutionLink.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      challenge_post_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Post,
          key: 'id',
        },
      },
      solution_post_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Post,
          key: 'id',
        },
      },
    },
    {
      sequelize,
      tableName: 'solution_links',
      timestamps: false,
    }
  );

  Setting.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      key: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      value: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'settings',
      timestamps: false,
    }
  );

  // Define associations
  User.hasMany(Post, { foreignKey: 'user_id', as: 'posts' });
  Post.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

  Post.hasMany(PostTag, { foreignKey: 'post_id', as: 'tags' });
  PostTag.belongsTo(Post, { foreignKey: 'post_id' });

  User.hasMany(Vote, { foreignKey: 'user_id', as: 'votes' });
  Vote.belongsTo(User, { foreignKey: 'user_id' });

  Post.hasMany(Vote, { foreignKey: 'post_id', as: 'postVotes' });
  Vote.belongsTo(Post, { foreignKey: 'post_id' });

  User.hasMany(Comment, { foreignKey: 'user_id', as: 'comments' });
  Comment.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

  Post.hasMany(Comment, { foreignKey: 'post_id', as: 'comments' });
  Comment.belongsTo(Post, { foreignKey: 'post_id' });

  Post.hasMany(SolutionLink, { foreignKey: 'challenge_post_id', as: 'solutions' });
  SolutionLink.belongsTo(Post, { foreignKey: 'challenge_post_id', as: 'challengePost' });

  Post.hasMany(SolutionLink, { foreignKey: 'solution_post_id', as: 'solvedChallenges' });
  SolutionLink.belongsTo(Post, { foreignKey: 'solution_post_id', as: 'solutionPost' });

  return { User, Post, PostTag, Vote, Comment, SolutionLink, Setting };
}
