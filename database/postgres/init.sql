CREATE TABLE IF NOT EXISTS "accounts" (
	"user_id" serial NOT NULL UNIQUE,
	"password" varchar(255) NOT NULL,
	"date_of_create" date NOT NULL,
	PRIMARY KEY ("user_id")
);
