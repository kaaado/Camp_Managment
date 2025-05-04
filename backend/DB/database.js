import sqlite3 from "sqlite3";
import { open } from "sqlite";

export const initDB = async () => {
  const db = await open({
    filename: "./db/database.sqlite",
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS user (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      mail TEXT UNIQUE,
      password TEXT,
      type TEXT DEFAULT "user"
    );
  `);

 

  await db.exec(`
    CREATE TABLE IF NOT EXISTS camp (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      place TEXT NOT NULL,
      datestart TEXT NOT NULL,
      enddate TEXT NOT NULL,
      associatorName TEXT NOT NULL,
      type TEXT,
      maxcap INTEGER,
      agecapmax INTEGER,
      agecapmin INTEGER,
      team TEXT,
      program TEXT,
      rules TEXT
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS kid (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      kidName TEXT NOT NULL,
      kidFather TEXT NOT NULL,
      kidMother TEXT NOT NULL,
      fatherNumber TEXT NOT NULL,
      fatherMail TEXT,
      kidAge INTEGER NOT NULL,
      adresse TEXT NOT NULL,
      zayad TEXT,
      tasrihAbawi TEXT,
      chadaTibiya TEXT
    );
  `);

  return db;
};
