const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const users = [
  {
    full_name: 'Admin User',
    email: 'admin@kebenasdachurch.org',
    password: 'admin123',
    roles: ['admin', 'student'],
  },
  {
    full_name: 'Pastor User',
    email: 'pastor@kebenasdachurch.org',
    password: 'pastor123',
    roles: ['pastor', 'student'],
  },
  {
    full_name: 'Editor User',
    email: 'editor@kebenasdachurch.org',
    password: 'editor123',
    roles: ['editor', 'student'],
  },
  {
    full_name: 'Teacher User',
    email: 'teacher@kebenasdachurch.org',
    password: 'teacher123',
    roles: ['teacher', 'student'],
  },
  {
    full_name: 'Developer User',
    email: 'developer@kebenasdachurch.org',
    password: 'developer123',
    roles: ['developer', 'student'],
  },
  {
    full_name: 'Student User',
    email: 'student@kebenasdachurch.org',
    password: 'student123',
    roles: ['student'],
  },
];

const roles = ['student', 'teacher', 'pastor', 'editor', 'developer', 'admin'];

async function connect() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'kschool_db',
  });
  return connection;
}

async function seed() {
  const conn = await connect();

  try {
    await conn.beginTransaction();

    const rolePlaceholders = roles.map(() => '?').join(', ');
    await conn.execute(`INSERT IGNORE INTO roles (name) VALUES ${roles.map(() => '(?)').join(', ')}`, roles);

    const [roleRows] = await conn.execute(
      `SELECT id, name FROM roles WHERE name IN (${rolePlaceholders})`,
      roles
    );

    const roleMap = roleRows.reduce((map, row) => {
      map[row.name] = row.id;
      return map;
    }, {});

    for (const user of users) {
      const normalizedEmail = user.email.trim().toLowerCase();
      const passwordHash = await bcrypt.hash(user.password, 12);

      const [existingRows] = await conn.execute(
        'SELECT id FROM users WHERE LOWER(email) = ?',
        [normalizedEmail]
      );

      let userId;

      if (existingRows.length > 0) {
        userId = existingRows[0].id;
        await conn.execute(
          'UPDATE users SET full_name = ?, email = ?, password_hash = ? WHERE id = ?',
          [user.full_name, normalizedEmail, passwordHash, userId]
        );
      } else {
        const [result] = await conn.execute(
          'INSERT INTO users (full_name, email, password_hash) VALUES (?, ?, ?)',
          [user.full_name, normalizedEmail, passwordHash]
        );
        userId = result.insertId;
      }

      await conn.execute('DELETE FROM user_roles WHERE user_id = ?', [userId]);

      for (const roleName of user.roles) {
        const roleId = roleMap[roleName];
        if (!roleId) {
          throw new Error(`Role not found: ${roleName}`);
        }
        await conn.execute('INSERT IGNORE INTO user_roles (user_id, role_id) VALUES (?, ?)', [userId, roleId]);
      }
    }

    await conn.commit();
    console.log('✅ Demo users seeded successfully');
  } catch (error) {
    await conn.rollback();
    console.error('❌ Failed to seed demo users:', error.message || error);
    process.exit(1);
  } finally {
    await conn.end();
  }
}

seed();
