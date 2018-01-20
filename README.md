This is the restify backend to `len-react`. All routes are in `server.js` and all direct db connections are made through `dbInterface.js`

Sessions are currently handled with a database table but this should be moved to redis or a sessionID scheme that does not require a database look up to be verified (hashed secret or something similiar).

Migrations are handled with [dogfish](https://github.com/dwb/dogfish). To configure basically all you have to do is add a file titled `DOGFISH_PG_OPTS` in `pg_migrations/` and set `PGHOST, PGDATABASE, PGPASSWORD, PGUSER` to the appriopriate values. After doing this you can run `./bin/dogfish migrate`, it should handle everything for you.

Run `node server.js` to get the server running.
