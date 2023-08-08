import { MigrationInterface, QueryRunner } from 'typeorm';

export class ReplaceMysqlWithPostgresql1649600833307
  implements MigrationInterface
{
  name = 'ReplaceMysqlWithPostgresql1649600833307';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "likes" ("id" SERIAL NOT NULL, "type" character varying NOT NULL, "userId" integer, "commentId" integer, "questionId" integer, CONSTRAINT "PK_a9323de3f8bced7539a794b4a37" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b9ef264256fa1872e7fb53d728" ON "likes" ("type") `,
    );
    await queryRunner.query(
      `CREATE TABLE "comments" ("id" SERIAL NOT NULL, "text" text NOT NULL, "deletedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "questionId" integer, "userId" integer, "parentCommentId" integer, CONSTRAINT "REL_4875672591221a61ace66f2d4f" UNIQUE ("parentCommentId"), CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'author')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_status_enum" AS ENUM('confirmed', 'confirmation_process')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'author', "status" "public"."users_status_enum" NOT NULL DEFAULT 'confirmation_process', "confirmationToken" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "questions" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "plainText" text NOT NULL, "formattedText" text NOT NULL, "content" json NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, "categoryId" integer, CONSTRAINT "PK_08a6d4b0f49ff300bf3a0ca60ac" PRIMARY KEY ("id")); COMMENT ON COLUMN "questions"."plainText" IS 'Question text without html tags'; COMMENT ON COLUMN "questions"."formattedText" IS 'Question text with html tags'; COMMENT ON COLUMN "questions"."content" IS 'https://quilljs.com/docs/delta/'`,
    );
    await queryRunner.query(
      `CREATE TABLE "categories" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE ("name"), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "likes" ADD CONSTRAINT "FK_cfd8e81fac09d7339a32e57d904" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "likes" ADD CONSTRAINT "FK_ec3c75d6522fc60e0ebaf58a6b7" FOREIGN KEY ("commentId") REFERENCES "comments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "likes" ADD CONSTRAINT "FK_3a9880a74397ce4c59fe609f768" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "comments" ADD CONSTRAINT "FK_8db2a234357898ee18a16f5d409" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "comments" ADD CONSTRAINT "FK_7e8d7c49f218ebb14314fdb3749" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "comments" ADD CONSTRAINT "FK_4875672591221a61ace66f2d4f9" FOREIGN KEY ("parentCommentId") REFERENCES "comments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "questions" ADD CONSTRAINT "FK_bc2370231ea3e3d296963f33939" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "questions" ADD CONSTRAINT "FK_f7f9c25bf2bac126d941673a7dc" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "questions" DROP CONSTRAINT "FK_f7f9c25bf2bac126d941673a7dc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "questions" DROP CONSTRAINT "FK_bc2370231ea3e3d296963f33939"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comments" DROP CONSTRAINT "FK_4875672591221a61ace66f2d4f9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comments" DROP CONSTRAINT "FK_7e8d7c49f218ebb14314fdb3749"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comments" DROP CONSTRAINT "FK_8db2a234357898ee18a16f5d409"`,
    );
    await queryRunner.query(
      `ALTER TABLE "likes" DROP CONSTRAINT "FK_3a9880a74397ce4c59fe609f768"`,
    );
    await queryRunner.query(
      `ALTER TABLE "likes" DROP CONSTRAINT "FK_ec3c75d6522fc60e0ebaf58a6b7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "likes" DROP CONSTRAINT "FK_cfd8e81fac09d7339a32e57d904"`,
    );
    await queryRunner.query(`DROP TABLE "categories"`);
    await queryRunner.query(`DROP TABLE "questions"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    await queryRunner.query(`DROP TABLE "comments"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b9ef264256fa1872e7fb53d728"`,
    );
    await queryRunner.query(`DROP TABLE "likes"`);
  }
}
