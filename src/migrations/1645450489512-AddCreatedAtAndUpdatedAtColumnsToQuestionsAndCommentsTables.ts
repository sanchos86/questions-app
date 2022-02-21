import {MigrationInterface, QueryRunner} from "typeorm";

export class AddCreatedAtAndUpdatedAtColumnsToQuestionsAndCommentsTables1645450489512 implements MigrationInterface {
    name = 'AddCreatedAtAndUpdatedAtColumnsToQuestionsAndCommentsTables1645450489512'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`comments\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`comments\` ADD \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`questions\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`questions\` ADD \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`questions\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`questions\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`comments\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`comments\` DROP COLUMN \`createdAt\``);
    }

}
