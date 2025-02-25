create table if not exists walk2025 (
  id integer primary key autoincrement,
  created text default current_timestamp,
  updated text not null,
  ticket text not null,
  access text not null,
  fname text not null,
  lname text not null,
  email text not null,
  tel text not null,
  shirts text not null,
  shirtc text not null,
  price integer not null,
  donation integer not null,
  total integer not null,
  payment text not null
);

create table if not exists merch2025 (
  id integer primary key autoincrement,
  walker integer not null,
  type text not null,
  size text not null,
  color text not null,
  price integer not null,
  quantity integer not null,
  total integer not null
);
