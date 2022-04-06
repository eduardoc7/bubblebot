import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('orders', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('identifier').notNullable();
    table.string('contact_number').notNullable();
    table.string('payment_method').nullable();
    table.string('payment_status').nullable();
    table.string('delivery_method').nullable();
    table.string('total').notNullable();
    table.text('items').notNullable();
    table.text('location').nullable();
    table.string('status').defaultTo('created');
    table.string('chatId').notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('orders');
}
