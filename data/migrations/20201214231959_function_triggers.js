exports.up = async (knex) => {
  await knex.raw(`
    CREATE FUNCTION create_downvote()
    RETURNS TRIGGER AS $$
    BEGIN
        IF NEW.status_vote = 'downvote' AND OLD.status_vote = 'upvote' THEN 
            UPDATE thread SET upvote = upvote - 1, downvote = downvote - 1 WHERE id_thread = OLD.id_thread;
            RETURN OLD;
        ELSEIF NEW.status_vote = 'downvote' THEN
            UPDATE thread SET downvote = downvote - 1 WHERE id_thread = NEW.id_thread;
            RETURN NEW;
        ELSEIF OLD.status_vote = 'downvote' AND NEW.status_vote = 'neutral' THEN
            UPDATE thread SET downvote = downvote + 1 WHERE id_thread = OLD.id_thread;
            RETURN OLD;
        ELSE
            RETURN NULL;
        END IF;
    END;
    $$
    LANGUAGE 'plpgsql';
    `);

    await knex.raw(`
    CREATE FUNCTION create_upvote()
    RETURNS TRIGGER AS $$
    BEGIN
        IF NEW.status_vote = 'upvote' AND OLD.status_vote = 'downvote' THEN 
            UPDATE thread SET upvote = upvote + 1, downvote = downvote + 1 WHERE id_thread = OLD.id_thread;
            RETURN OLD;
        ELSEIF NEW.status_vote = 'upvote' THEN
            UPDATE thread SET upvote = upvote + 1 WHERE id_thread = NEW.id_thread;
            RETURN NEW;
        ELSEIF OLD.status_vote = 'upvote' AND NEW.status_vote = 'neutral' THEN
            UPDATE thread SET upvote = upvote - 1 WHERE id_thread = OLD.id_thread;
            RETURN OLD;
        ELSE
            RETURN NULL;
        END IF;
    END;
    $$
    LANGUAGE 'plpgsql';
    `);

    await knex.raw(`
    CREATE FUNCTION update_state_thread()
    RETURNS TRIGGER AS $$
    BEGIN
        UPDATE thread SET users_delete = 'deleted' WHERE id_user = OLD.id_user;
        RETURN OLD;
    END;
    $$
    LANGUAGE 'plpgsql';
    `);

    await knex.raw(`
    CREATE FUNCTION update_post()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
    END;
    $$
    LANGUAGE 'plpgsql';
    `);

    await knex.raw(`
    CREATE FUNCTION delete_user()
    RETURNS TRIGGER AS $$
    BEGIN
        DELETE FROM friendshipstatus WHERE status = 'A' AND (id_requested = OLD.id_user OR id_addressed = OLD.id_user);
        RETURN OLD;
    END;
    $$
    LANGUAGE 'plpgsql';
    `);

    return await knex.raw(`
    CREATE FUNCTION update_chat()
	RETURNS TRIGGER AS $$
	BEGIN
		IF EXISTS (SELECT * FROM chat WHERE list @> ARRAY[(OLD.id_user)::uuid]) AND NEW.deleted <> OLD.deleted
		THEN
			UPDATE chat SET list = array_remove(list, OLD.id_user) WHERE list @> ARRAY[(OLD.id_user)::uuid];
			RETURN OLD;
		ELSE
			RETURN NULL;
		END IF;
	END;
	$$
	LANGUAGE 'plpgsql'
    `);
};

exports.down = async (knex) => {
    await knex.raw(`
        DROP FUNCTION IF EXISTS create_downvote() CASCADE;
    `);

    await knex.raw(`
        DROP FUNCTION IF EXISTS create_upvote() CASCADE;
    `);

    await knex.raw(`
        DROP FUNCTION IF EXISTS update_state_thread() CASCADE;
    `);

    await knex.raw(`
        DROP FUNCTION IF EXISTS update_post() CASCADE;
    `);

    await knex.raw(`
        DROP FUNCTION IF EXISTS delete_user() CASCADE;
    `);

    await knex.raw(`
        DROP FUNCTION IF EXISTS update_chat() CASCADE;
    `);
};
