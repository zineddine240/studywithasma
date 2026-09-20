DO $$
DECLARE
    constraint_name text;
BEGIN
    SELECT conname INTO constraint_name
    FROM pg_constraint
    WHERE conrelid = 'public.tests'::regclass
      AND pg_get_constraintdef(oid) LIKE '%content_type%';

    IF constraint_name IS NOT NULL THEN
        EXECUTE 'ALTER TABLE public.tests DROP CONSTRAINT ' || quote_ident(constraint_name);
    END IF;
END $$;

ALTER TABLE public.tests ADD CONSTRAINT tests_content_type_check CHECK (content_type IN ('reading', 'writing', 'level_test', 'speaking'));
