const parseActorQueryResult = (rawActor) => {
	if (rawActor.movies) {
		const moviesWithIntegerIds = JSON.parse(rawActor.movies).map(id => parseInt(id));
		return { id: rawActor.id, firstName: rawActor.first_name, lastName: rawActor.last_name, age: rawActor.age, movies: moviesWithIntegerIds }
	}

	return rawActor
}

module.exports = { parseActorQueryResult }