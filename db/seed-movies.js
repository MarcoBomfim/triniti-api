

const seedMovies = (db) => {
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
}

module.exports = seedMovies