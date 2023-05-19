const { parseActorQueryResult } = require('../utils/actors');

const actorsRoutes = (db) => [
	{
		method: 'GET',
		path: '/actors',
		handler: async (request, h) => {
			return new Promise((resolve, reject) => {
				db.all('SELECT * FROM actors LIMIT 25', (err, rows) => {
					if (err) {
						reject(err);
					} else {
						const parsedMoviesArray = rows.map(row => {
							return parseActorQueryResult(row);
						});

						resolve(parsedMoviesArray);
					}
				});
			});
		}
	},
	{
		method: 'GET',
		path: '/actors/{id}',
		handler: async (request, h) => {
			const actorId = request.params.id;

			return new Promise((resolve, reject) => {
				db.get('SELECT * FROM actors WHERE id = ?', actorId, (err, actor) => {
					if (err) {
						reject(err);
					} else {
						resolve(parseActorQueryResult(actor));
					}
				});
			});
		}
	},
	{
		method: 'GET',
		path: '/actors/{id}/movies',
		handler: async (request, h) => {
			const actorId = request.params.id;

			return new Promise((resolve, reject) => {
				db.get('SELECT * FROM actors WHERE id = ?', actorId, (err, actor) => {
					if (err) {
						reject(err);
					} else {
						const parsedActor = parseActorQueryResult(actor)
						resolve({ movies: parsedActor.movies });
					}
				});
			});
		}
	},
	{
		method: 'POST',
		path: '/actors',
		handler: async (request, h) => {
			const { firstName, lastName, age } = request.payload;

			return new Promise((resolve, reject) => {
				db.run('INSERT INTO actors (first_name, last_name, age, movies) VALUES (?, ?, ?, ?)',
					[firstName, lastName, age, JSON.stringify([])], function (err) {
						if (err) {
							reject(err);
						} else {
							resolve({ id: this.lastID });
						}
					});
			}).then(({ id }) => {
				return new Promise((resolve, reject) => {
					db.get('SELECT * FROM actors WHERE id = ?', id, (err, actor) => {
						if (err) {
							reject(err);
						} else {
							resolve(actor)
						}
					});
				})
			})
		}
	}
];

module.exports = actorsRoutes;
