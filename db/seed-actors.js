const seedActors = (db) => {
	const actors = [
		{ firstName: 'Leonardo', lastName: 'Di Caprio', age: 54, movies: ['0', '1', '2', '3', '4'] },
		{ firstName: 'Tom', lastName: 'Hanks', age: 65, movies: ['0', '1', '2', '3', '4'] },
		{ firstName: 'Meryl', lastName: 'Streep', age: 72, movies: ['0', '1', '2', '3', '4'] },
		{ firstName: 'Brad', lastName: 'Pitt', age: 58, movies: ['0', '1', '2', '3', '4'] },
		{ firstName: 'Angelina', lastName: 'Jolie', age: 46, movies: ['0', '1', '2', '3', '4'] },
		{ firstName: 'Denzel', lastName: 'Washington', age: 66, movies: ['0', '1', '2', '3', '4'] },
		{ firstName: 'Scarlett', lastName: 'Johansson', age: 37, movies: ['0', '1', '2', '3', '4'] },
		{ firstName: 'Robert', lastName: 'De Niro', age: 78, movies: ['0', '1', '2', '3', '4'] },
		{ firstName: 'Julia', lastName: 'Roberts', age: 54, movies: ['0', '1', '2', '3', '4'] },
		{ firstName: 'Johnny', lastName: 'Depp', age: 58, movies: ['0', '1', '2', '3', '4'] },
		{ firstName: 'Emma', lastName: 'Stone', age: 33, movies: ['0', '1', '2', '3', '4'] },
		{ firstName: 'Will', lastName: 'Smith', age: 53, movies: ['0', '1', '2', '3', '4'] },
		{ firstName: 'Charlize', lastName: 'Theron', age: 45, movies: ['0', '1', '2', '3', '4'] },
		{ firstName: 'George', lastName: 'Clooney', age: 60, movies: ['0', '1', '2', '3', '4'] },
		{ firstName: 'Natalie', lastName: 'Portman', age: 40, movies: ['0', '1', '2', '3', '4'] },
		{ firstName: 'Samuel', lastName: 'Jackson', age: 73, movies: ['0', '1', '2', '3', '4'] },
		{ firstName: 'Jennifer', lastName: 'Lawrence', age: 31, movies: ['0', '1', '2', '3', '4'] },
		{ firstName: 'Matt', lastName: 'Damon', age: 51, movies: ['0', '1', '2', '3', '4'] },
		{ firstName: 'Cate', lastName: 'Blanchett', age: 52, movies: ['0', '1', '2', '3', '4'] },
		{ firstName: 'Chris', lastName: 'Hemsworth', age: 38, movies: ['0', '1', '2', '3', '4'] },
		{ firstName: 'Sandra', lastName: 'Bullock', age: 57, movies: ['0', '1', '2', '3', '4'] }
	];
	
	actors.forEach(actor => {
		db.run(
			`INSERT INTO actors (first_name, last_name, age, movies) VALUES (?, ?, ?, ?)`,
			[actor.firstName, actor.lastName, actor.age, JSON.stringify(actor.movies)]
		);
	});
}

module.exports = seedActors;