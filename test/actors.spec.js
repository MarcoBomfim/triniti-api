const Lab = require('@hapi/lab');
const { expect } = require('@hapi/code');
const sqlite3 = require('sqlite3').verbose();
const { afterEach, beforeEach, describe, it } = exports.lab = Lab.script();
const { init } = require('../server');

describe('Actors Routes', () => {
  let server;
  let db;

  beforeEach(async () => {
    server = await init();

    db = new sqlite3.Database(':memory:');
    db.serialize(() => {
      db.run('CREATE TABLE IF NOT EXISTS actors (id INTEGER PRIMARY KEY, first_name TEXT, last_name TEXT, age INTEGER, movies TEXT[])');
      db.run('CREATE TABLE IF NOT EXISTS movies (id INTEGER PRIMARY KEY, name TEXT, release_date TEXT)');

      const actors = [
        { firstName: 'Leonardo', lastName: 'Di Caprio', age: 54, movies: ['0', '1', '2', '3', '4'] },
        { firstName: 'Tom', lastName: 'Hanks', age: 65, movies: ['0', '1', '2', '3', '4'] },
        { firstName: 'Meryl', lastName: 'Streep', age: 72, movies: ['0', '1', '2', '3', '4'] },
        { firstName: 'Brad', lastName: 'Pitt', age: 58, movies: ['0', '1', '2', '3', '4'] },
        { firstName: 'Angelina', lastName: 'Jolie', age: 46, movies: ['0', '1', '2', '3', '4'] }
      ];
      
      actors.forEach(actor => {
        db.run(
          `INSERT INTO actors (first_name, last_name, age, movies) VALUES (?, ?, ?, ?)`,
          [actor.firstName, actor.lastName, actor.age, JSON.stringify(actor.movies)]
        );
      });
    });
  });

  afterEach(async () => {
    await new Promise((resolve, reject) => {
      db.close((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });

  it('should return a list of actors', async () => {
    const options = {
      method: 'GET',
      url: '/actors',
    };

    const response = await server.inject(options);
    expect(response.statusCode).to.equal(200);
  });

  it('should return a specific actor', async () => {
    const actorId = 1;
    const options = {
      method: 'GET',
      url: `/actors/${actorId}`,
    };

    const response = await server.inject(options);

    expect(response.statusCode).to.equal(200);
  });

  it('should return a list of movies for a specific actor', async () => {
    const actorId = 1;
    const options = {
      method: 'GET',
      url: `/actors/${actorId}/movies`,
    };

    const response = await server.inject(options);

    expect(response.statusCode).to.equal(200);
  });

  it('should create a new actor', async () => {
    const actorData = {
      firstName: 'John',
      lastName: 'Doe',
      age: 30,
    };

    const postRequest = {
      method: 'POST',
      url: '/actors',
      payload: actorData,
    };

    const postResponse = await server.inject(postRequest);
    
    expect(postResponse.statusCode).to.equal(200);

    const getRequest = {
      method: 'GET',
      url: `/actors/${postResponse.result.id}`
    }
    const getResponse = await server.inject(getRequest);

    expect(getResponse.result.id).to.equal(postResponse.result.id);
  });
});
