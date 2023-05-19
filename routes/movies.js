const { parseActorQueryResult } = require('../utils/actors');

const moviesRoutes = (db) => [
	{
		method: 'GET',
		path: '/movies',
		handler: async (request, h) => {
			return new Promise((resolve, reject) => {
				db.all('SELECT * FROM movies', (err, rows) => {
					if (err) {
						reject(err);
					} else {
						const parsedMovies = rows.map(movie => ({ id: movie.id, name: movie.name, releaseDate: movie.release_date }))
						resolve(parsedMovies);
					}
				});
			});
		}
	},
	{
		method: 'POST',
		path: '/actors/{id}/movies',
		handler: async (request, h) => {
			const actorId = request.params.id;
			const { name, releaseDate } = request.payload;

			return new Promise((resolve, reject) => {
				db.get('SELECT * FROM movies WHERE name = ?', name, (err, existingMovie) => {
					if (err) {
						reject(err);
					} else if (existingMovie) {
						// Movie already exists, add it to the actor's array
						resolve(existingMovie.id);
					} else {
						db.run('INSERT INTO movies (name, release_date) VALUES (?, ?)', [name, releaseDate], function (err) {
							if (err) {
								reject(err);
							} else {
								const movieId = this.lastID;
								resolve(movieId);
							}
						});
					}
				});
			}).then(movieId => {
				return new Promise((resolve, reject) => {
					db.run('UPDATE actors SET movies = json_insert(movies, "$[#]", ?) WHERE id = ?', [movieId, actorId], function (err) {
						if (err) {
							reject(err);
						} else {
							resolve(movieId);
						}
					});
				});
			}).then(movieId => {
				return new Promise((resolve, reject) => {
					db.get('SELECT * FROM movies WHERE id = ?', movieId, (err, movie) => {
						if (err) {
							reject(err);
						} else {
							const parsedMovie = { id: movie.id, name: movie.name, releaseDate: movie.release_date }
							resolve(parsedMovie);
						}
					});
				});
			}).catch(err => {
				console.error('Error creating movie:', err);
				return h.response('Internal server error').code(500);
			});
		}
	}
];

module.exports = moviesRoutes;
