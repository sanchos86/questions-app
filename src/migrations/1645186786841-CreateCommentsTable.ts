import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateCommentsTable1645186786841 implements MigrationInterface {
    name = 'CreateCommentsTable1645186786841'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`comments\` (\`id\` int NOT NULL AUTO_INCREMENT, \`text\` longtext NOT NULL, \`deletedAt\` datetime(6) NULL, \`questionId\` int NULL, \`userId\` int NULL, \`parentCommentId\` int NULL, UNIQUE INDEX \`REL_4875672591221a61ace66f2d4f\` (\`parentCommentId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`comments\` ADD CONSTRAINT \`FK_8db2a234357898ee18a16f5d409\` FOREIGN KEY (\`questionId\`) REFERENCES \`questions\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`comments\` ADD CONSTRAINT \`FK_7e8d7c49f218ebb14314fdb3749\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`comments\` ADD CONSTRAINT \`FK_4875672591221a61ace66f2d4f9\` FOREIGN KEY (\`parentCommentId\`) REFERENCES \`comments\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`comments\` DROP FOREIGN KEY \`FK_4875672591221a61ace66f2d4f9\``);
        await queryRunner.query(`ALTER TABLE \`comments\` DROP FOREIGN KEY \`FK_7e8d7c49f218ebb14314fdb3749\``);
        await queryRunner.query(`ALTER TABLE \`comments\` DROP FOREIGN KEY \`FK_8db2a234357898ee18a16f5d409\``);
        await queryRunner.query(`DROP INDEX \`REL_4875672591221a61ace66f2d4f\` ON \`comments\``);
        await queryRunner.query(`DROP TABLE \`comments\``);
    }

}
