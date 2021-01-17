exports.up = async (knex) => {
    await knex.raw(`
    CREATE TRIGGER update_state_thread
    AFTER UPDATE 
    ON public.users
    FOR EACH ROW
    EXECUTE PROCEDURE public.update_state_thread();
    `)

    await knex.raw(`
    CREATE TRIGGER delete_user
    AFTER UPDATE 
    ON public.users
    FOR EACH ROW
    EXECUTE PROCEDURE public.delete_user();
    `)

    await knex.raw(`
    CREATE TRIGGER update_post
    BEFORE UPDATE 
    ON public.post
    FOR EACH ROW
    EXECUTE PROCEDURE public.update_post();
    `)

    await knex.raw(`
    CREATE TRIGGER create_downvote
    AFTER INSERT OR UPDATE 
    ON public.vote
    FOR EACH ROW
    EXECUTE PROCEDURE public.create_downvote();
    `)

    await knex.raw(`
    CREATE TRIGGER create_upvote
    AFTER INSERT OR UPDATE 
    ON public.vote
    FOR EACH ROW
    EXECUTE PROCEDURE public.create_upvote();
    `)

    await knex.raw(`
    CREATE TRIGGER update_chat
	AFTER UPDATE ON users FOR EACH ROW
	EXECUTE PROCEDURE update_chat()
    `)
};

exports.down = async (knex) => {
    await knex.raw(`
        DROP TRIGGER IF EXISTS create_downvote ON vote;
    `);

    await knex.raw(`
        DROP TRIGGER IF EXISTS create_upvote ON vote;
    `);

    await knex.raw(`
        DROP TRIGGER IF EXISTS update_state_thread ON USERS;
    `);

    await knex.raw(`
        DROP TRIGGER IF EXISTS update_post ON post;
    `);

    await knex.raw(`
        DROP TRIGGER IF EXISTS delete_user ON users;
    `);

    await knex.raw(`
        DROP TRIGGER IF EXISTS update_chat ON users;
    `);
};
