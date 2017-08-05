We want a minimal example to demonstrate the use of the following:

* React
* Node
* Passport-local
* Postgres
* Tape, Supertest

We use Postgres here though it should be easy to do a MongoDB version.

# Postgres

## Install

Some usual `psql` commands:
* `\du` to list all users
* `\l` to list all databases
* `\dt` to list all tables in current database

In case you haven't created a user:

```
sudo -u postgres psql

CREATE USER jchiu;
ALTER USER jchiu SUPERUSER CREATEDB;
```

Exit and login to postgres as the new user. Create a database just for this app.

```
psql template1
CREATE DATABASE db0000 WITH OWNER=jchiu;
```

Exit and login to the new database by typing `psql db0000`.

Next, set a password for this database by modifying `/etc/postgresql/9.5/main/pg_hba.conf`. For example, add the following line to the end:

```
host db0000 jchiu 127.0.0.1/32 password
```

Then set the password.

```
psql db0000

ALTER ROLE jchiu UNENCRYPTED PASSWORD 'somepassword';
```

Try logging in:

```
psql -h localhost -d db0000
```

You will be prompted for a password. Try different possibilities to make sure it works.

This information should be consistent with what is specified in `models/pool.js`.

## Model

When a user is created, or when a password is updated, we create a new [salt](https://en.wikipedia.org/wiki/Salt_(cryptography)) for the user, which is really just some random bits.

`hash` is computed from hashing `salt+password`. The latter is string concatenation.

Create our table. We add just the fields we need for this example. Some simple constraints are added, e.g., uniqueness of `username`. We also add an index for `username`.

```
psql db0000
CREATE TABLE table_users(
  id SERIAL PRIMARY KEY,
  salt VARCHAR(255) NOT NULL CHECK (char_length(username)>=4),
  username VARCHAR(255) UNIQUE NOT NULL CHECK (char_length(username)>=4),
  hash VARCHAR(1000) NOT NULL CHECK (char_length(hash)>=4));

CREATE INDEX index_users_username_ ON table_users(username);

\d table_users
```

# Node backend

## Install

We assume you have installed Node and npm.

In case you don't have the following already installed on your machine, do:

```shell
sudo npm install express-generator supervisor -g
```

Let's put our Node code in the directory `backend`.

```shell
express backend
cd backend
npm install
```

In `package.json`, under `scripts.start`, change it from `node ./bin/www` to `supervisor ./bin/www`.

Try the app and see that it works by typing `npm start`. By default, for Express, the site would be available at `http://localhost:3000`.

Next, install all the packages we need.

```shell
npm install --save \
passport passport-local \
crypto underscore \
continuation-local-storage \
express-session \
pg
```

## Tape

We use Tape and Supertest for unit test. It is simpler than `mocha` but has some quirks. For example, the test might not end because the server is running. That explains why we have `test.onFinish(() => process.exit());` at the start of each
test.

To install:

```shell
sudo npm install tape -g
npm install tape supertest --save-dev
```

Add the following to `package.json`:

```
"test": "tape **/*_test.js"
```

One simple test is `models/pool_test.js`. It will test that we can connect to the database and that the table is created.

# React

## Install

In case you don't have this utility installed:

```shell
sudo npm install -g create-react-app
```

Create app
```shell
create-react-app frontend
cd frontend
PORT=3001 npm start
```

Stick in `PORT=3001` so that we start frontend on `:3001`. We assume backend is
on `:3000` instead.

If you are using Sublime, you can use https://github.com/babel/babel-sublime to
improve the syntax highlighting. Install package and set syntax to Babel.

Install some modules.

```shell
npm install --save \
axios \
bootstrap@3 \
react-toastr
```

For Bootstrap, remember to update `index.js`. We need to import some CSS.

For Toast, we need to copy two CSS files `toastr.min.css` and `animate.min.css` and import them in `index.js`.