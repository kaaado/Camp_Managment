import bcrypt from 'bcrypt';

export const up = async (db) => {
  const hashedPassword = await bcrypt.hash("123456789", 10);
  await db.run(
    "INSERT INTO user (name, mail, password, type) VALUES (?, ?, ?, ?)",
    ["Admin", "admin@admin.com", hashedPassword, "admin"]
  );
};

export const down = async (db) => {
  await db.run("DELETE FROM user WHERE mail = ?", ["admin@admin.com"]);
};