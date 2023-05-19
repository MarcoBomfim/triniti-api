const Lab = require('@hapi/lab');
const { expect } = require('@hapi/code');
const sqlite3 = require('sqlite3').verbose();
const { afterEach, beforeEach, describe, it } = exports.lab = Lab.script();
const { init } = require('../server');

describe('Movies Routes', () => {
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

        const movies = [
            { name: 'The Shawshank Redemption', releaseDate: '1994-09-23' },
            { name: 'The Godfather', releaseDate: '1972-03-14' },
            { name: 'Pulp Fiction', releaseDate: '1994-05-21' },
            { name: 'The Dark Knight', releaseDate: '2008-07-18' },
            { name: 'Fight Club', releaseDate: '1999-10-15' },
            { name: 'Inception', releaseDate: '2010-07-16' }
        ];
    
        movies.forEach(movie => {
            db.run('INSERT INTO movies (name, release_date) VALUES (?, ?)', [movie.name, movie.releaseDate]);
        });
        
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

  it('should return a list of movies', async () => {
    const options = {
      method: 'GET',
      url: '/movies',
    };

    const response = await server.inject(options);

    expect(response.statusCode).to.equal(200);
  });

  it('should create a new movie and associate it with an actor', async () => {
    const actorId = 1;
    const movieData = {
      name: 'The Matrix',
      releaseDate: '1999-03-31',
    };

    const createMovieRequest = {
      method: 'POST',
      url: `/actors/${actorId}/movies`,
      payload: movieData,
    };

    const createMovieResponse = await server.inject(createMovieRequest);

    expect(createMovieResponse.statusCode).to.equal(200);

    const getActorMoviesRequest = {
        method: 'GET',
        url: `/actors/${actorId}/movies`
    }
    const getActorMoviesResponse = await server.inject(getActorMoviesRequest);

    const createdMovie = getActorMoviesResponse.result.movies.find(actorMovie => actorMovie === createMovieResponse.result.id)
    
    expect(createdMovie).to.exist();
  });
});
