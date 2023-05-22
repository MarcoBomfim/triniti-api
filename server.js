const Hapi = require('@hapi/hapi');
const sqlite3 = require('sqlite3').verbose();
const seedActors = require('./db/seed-actors');
const seedMovies = require('./db/seed-movies');

// Create a new Hapi server
const server = Hapi.server({
	port: 3001,
	host: '0.0.0.0',
	routes: {
		cors: {
			origin: ["*"]
		}
	}
});

// Connect to SQLite database
const db = new sqlite3.Database(':memory:'); // Change to your SQLite database path

// Initialize the database and start the server
db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS actors (id INTEGER PRIMARY KEY, first_name TEXT, last_name TEXT, age INTEGER, movies TEXT[])');
    db.run('CREATE TABLE IF NOT EXISTS movies (id INTEGER PRIMARY KEY, name TEXT, release_date TEXT)');

    // Execute the seed files
    seedActors(db);
    seedMovies(db);
});

const actorsRoutes = require('./routes/actors')(db);
const moviesRoutes = require('./routes/movies')(db);

server.route(actorsRoutes);
server.route(moviesRoutes);

exports.init = async () => {
    await server.initialize();
    return server;
};

exports.start = async () => {
    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
    return server;
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});