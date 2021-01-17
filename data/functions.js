const CREATE_DOWNVOTE = `
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
`;

const CREATE_UPVOTE = `
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
`;

const UPDATE_STATE_THREAD = `
    CREATE FUNCTION update_state_thread()
    RETURNS TRIGGER AS $$
    BEGIN
        UPDATE thread SET users_delete = 'deleted' WHERE id_user = OLD.id_user;
        RETURN OLD;
    END;
    $$
    LANGUAGE 'plpgsql';
`;

const UPDATE_STATE = `
    CREATE FUNCTION update_state()
    RETURNS TRIGGER AS $$
    BEGIN
        INSERT INTO friendshipstatus (id_requested, id_addressed) VALUES (OLD.id_requested, OLD.id_addressed);
        RETURN OLD;
    END;
    $$
    LANGUAGE 'plpgsql';
`;

const UPDATE_POST = `
    CREATE FUNCTION update_post()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
    END;
    $$
    LANGUAGE 'plpgsql';
`;

const DELETE_USER = `
    CREATE FUNCTION delete_user()
    RETURNS TRIGGER AS $$
    BEGIN
        DELETE FROM friendshipstatus WHERE status = 'A' AND (id_requested = OLD.id_user OR id_addressed = OLD.id_user);
        RETURN OLD;
    END;
    $$
    LANGUAGE 'plpgsql';
`;

const TRANSFER_FRIENDSHIP = `
    CREATE FUNCTION transfer_friendship()
    RETURNS TRIGGER AS $$
    BEGIN
        INSERT INTO friendshipstatus(id_requested, id_addressed, specifiedtime, status, id_specifier)
        VALUES (NEW.id_requested, NEW.id_addressed, NEW.created_at, 'R', NEW.id_requested);
        RETURN NEW;
    END;
    $$
    LANGUAGE 'plpgsql';
`;