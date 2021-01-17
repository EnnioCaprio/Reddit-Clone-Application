exports.up = async (knex) => {
    await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    return await knex.schema.createTable('users', table => {
        table.uuid('id_user').primary().notNullable().defaultTo(knex.raw('uuid_generate_v4()'));
        table.string("username", 255).notNullable().unique();
        table.string("email", 255).notNullable().unique();
        table.string("password", 255).notNullable();
        table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
        table.boolean('deleted');
    })

    .createTable('thread', (table) => {
        table.uuid('id_thread').primary().notNullable().defaultTo(knex.raw('uuid_generate_v4()'));
        table.string('name').notNullable().unique();
        table.string('subject').notNullable();
        table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
        table.uuid('id_user').notNullable();
        table.integer('upvote').defaultTo(0);
        table.integer('downvote').defaultTo(0);
        table.text('thread_message').notNullable();
        table.uuid('id_main').notNullable();
        table.string('users_delete').defaultTo(null);
        table.foreign('id_user').references('users.id_user');
    })

    .createTable('post', (table) => {
        table.uuid('id_message').primary().notNullable().defaultTo(knex.raw('uuid_generate_v4()'));
        table.string('message').notNullable();
        table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
        table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
        table.uuid('id_user').notNullable();
        table.uuid('id_thread').notNullable();
        table.foreign('id_thread').references('thread.id_thread');
        table.foreign('id_user').references('users.id_user');
    })

    .createTable('chat', (table) => {
        table.uuid('id_chat').primary().notNullable().defaultTo(knex.raw('uuid_generate_v4()'));
        table.string('name').notNullable();
        table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
        table.uuid('id_user').notNullable();
        table.specificType('list', 'uuid[]').notNullable();
        table.foreign('id_user').references('users.id_user');
    })

    .createTable('admin', (table) => {
        table.uuid('id').primary().notNullable().defaultTo(knex.raw('uuid_generate_v4()'));
        table.string('username').notNullable();
        table.string('password').notNullable();
    })

    .createTable('statusinfo', (table) => {
        table.string('statuscode', 1).primary().notNullable();
        table.string('name').notNullable();
    })

    .createTable('friendshipstatus', (table) => {
        table.uuid('id_friendship').primary().notNullable().defaultTo(knex.raw(`uuid_generate_v4()`));
        table.uuid('id_requested').notNullable();
        table.uuid('id_addressed').notNullable();
        table.timestamp('specifiedtime').defaultTo(knex.fn.now()).notNullable();
        table.string('status', 1).notNullable();
        table.uuid('id_specifier').notNullable();
        table.foreign('id_addressed').references('users.id_user');
        table.foreign('id_requested').references('users.id_user');
        table.foreign('status').references('statusinfo.statuscode');
    })

    .createTable('vote', (table) => {
        table.uuid('id_vote').primary().notNullable().defaultTo(knex.raw('uuid_generate_v4()'));
        table.uuid('id_user').notNullable();
        table.uuid('id_thread').notNullable();
        table.string('status_vote').notNullable();
        table.boolean('created').notNullable();
    })

    .createTable('messages', (table) => {
        table.uuid('id_message').primary().notNullable().defaultTo(knex.raw('uuid_generate_v4()'));
        table.string('message').notNullable();
        table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
        table.uuid('id_chat').notNullable();
        table.uuid('id_user').notNullable();
        table.string('username', 255).notNullable();
        table.foreign('id_chat').references('chat.id_chat');
        table.foreign('id_user').references('users.id_user');
    })

    .createTable('main', (table) => {
        table.uuid('id_main').primary().notNullable().defaultTo(knex.raw('uuid_generate_v4()'));
        table.string('name').unique().notNullable();
        table.string('sub_name').unique().notNullable();
        table.integer('members').notNullable().defaultTo(0);
        table.string('description').notNullable();
        table.specificType('subscribed_users', 'uuid[]');
        table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    })
};

exports.down = async (knex) => {
    await knex.raw('DROP TABLE IF EXISTS users CASCADE');
    await knex.raw('DROP TABLE IF EXISTS thread CASCADE');
    await knex.raw('DROP TABLE IF EXISTS chat CASCADE');
    await knex.schema.dropTableIfExists('post')
    .dropTableIfExists('admin')
    .dropTableIfExists('friendshipstatus')
    .dropTableIfExists('statusinfo')
    .dropTableIfExists('vote')
    .dropTableIfExists('messages')
    .dropTableIfExists('main');
};
