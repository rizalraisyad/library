import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitiateBookMemberBorrowingTables1716369573506
  implements MigrationInterface
{
  name = 'InitiateBookMemberBorrowingTables1716369573506';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "book" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT NOW(),
                "code" character varying NOT NULL,
                "title" character varying NOT NULL,
                "author" character varying NOT NULL,
                "stock" character varying NOT NULL,
                "available_quantity" character varying NOT NULL,
                "borrowed_quantity" character varying NOT NULL,
                CONSTRAINT "UQ_153910bab5ef6438fb822a0c143" UNIQUE ("code"),
                CONSTRAINT "PK_a3afef72ec8f80e6e5c310b28a4" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "borrowing" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT NOW(),
                "borrow_date" character varying NOT NULL,
                "return_date" character varying,
                "due_date" character varying NOT NULL,
                "is_returned" boolean NOT NULL,
                "book_id" uuid NOT NULL,
                "member_id" uuid NOT NULL,
                CONSTRAINT "PK_5bfeaa4e275c1a2e2ab257f2ee2" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "member" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT NOW(),
                "code" character varying NOT NULL,
                "name" character varying NOT NULL,
                "penalty_status" character varying NOT NULL,
                "penalty_end_date" character varying,
                CONSTRAINT "UQ_87dbb39d7c7c430faa5bf1af3bb" UNIQUE ("code"),
                CONSTRAINT "PK_97cbbe986ce9d14ca5894fdc072" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "borrowing"
            ADD CONSTRAINT "FK_5a5ead47aacc96376e7ab0d1a62" FOREIGN KEY ("book_id") REFERENCES "book"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "borrowing"
            ADD CONSTRAINT "FK_7ffb2634fbe8279bbfd30f6e854" FOREIGN KEY ("member_id") REFERENCES "member"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "borrowing" DROP CONSTRAINT "FK_7ffb2634fbe8279bbfd30f6e854"
        `);
    await queryRunner.query(`
            ALTER TABLE "borrowing" DROP CONSTRAINT "FK_5a5ead47aacc96376e7ab0d1a62"
        `);
    await queryRunner.query(`
            DROP TABLE "member"
        `);
    await queryRunner.query(`
            DROP TABLE "borrowing"
        `);
    await queryRunner.query(`
            DROP TABLE "book"
        `);
  }
}
