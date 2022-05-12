# Building a small API project
* GraphQL
* Apollo
* Koa
* TypeGraphQL
* TypeORM

### Coding standards
In order to use the existing linting rules, you need to authenticate with `npm login --registry=https://npm.pkg.github.com/` using your GitHub username and a personal access token (with the `read:packages` scope).

### Environmental variables
Copy `.env.dist` file and rename it to `.env`. Fill in the necessary fields.

### Database
Currently, `mysql` package does not support MySQL 8 Authentication ([#2233](https://github.com/mysqljs/mysql/pull/2233)). As a workaround, execute the following statement
```sql
ALTER USER 'username'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
```
Where `username` is your user, `localhost` is your URL, and `password` is your password

Note: If the SQL does not work, consider dropping `@localhost`.

Then run
```sql
flush privileges;
```

Alternatively, you can avoid the authentication issue by using `mysql2` package.
* `npm uninstall mysql`
* `npm install mysql2`.
