import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateQuestionsTableAndAddRelationsOnUsersAndCategoriesTables1645102415601 implements MigrationInterface {
    name = 'CreateQuestionsTableAndAddRelationsOnUsersAndCategoriesTables1645102415601'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`questions\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`plainText\` longtext NOT NULL COMMENT 'Question text without html tags', \`formattedText\` longtext NOT NULL COMMENT 'Question text with html tags', \`content\` json NOT NULL COMMENT 'https://quilljs.com/docs/delta/', \`userId\` int NULL, \`categoryId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`questions\` ADD CONSTRAINT \`FK_bc2370231ea3e3d296963f33939\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`questions\` ADD CONSTRAINT \`FK_f7f9c25bf2bac126d941673a7dc\` FOREIGN KEY (\`categoryId\`) REFERENCES \`categories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`questions\` DROP FOREIGN KEY \`FK_f7f9c25bf2bac126d941673a7dc\``);
        await queryRunner.query(`ALTER TABLE \`questions\` DROP FOREIGN KEY \`FK_bc2370231ea3e3d296963f33939\``);
        await queryRunner.query(`DROP TABLE \`questions\``);
    }

}
