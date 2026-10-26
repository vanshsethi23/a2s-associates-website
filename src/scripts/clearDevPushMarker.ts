/**
 * Clears Payload's "ran in dev mode" marker before a deploy runs migrations.
 *
 * Payload records a row in payload_migrations with batch = -1 whenever the
 * Postgres adapter pushes schema changes instead of migrating. On the next
 * `payload migrate` it sees that row and asks, interactively:
 *
 *   It looks like you've run Payload in dev mode ... data loss will occur.
 *   Would you like to proceed? (y/N)
 *
 * A build machine has no one to answer. Worse, `payload migrate` ignores
 * --forceAcceptWarning (the CLI only forwards it to migrate:create and
 * migrate:fresh), and declining or cancelling exits 0 — so the deploy hangs,
 * gives up, reports success and then builds against a schema that was never
 * migrated. That is how site_settings.portal_url came to be missing from a
 * green deploy.
 *
 * src/lib/adapters.ts now refuses to push to anything but a local database, so
 * the marker should never reappear. This clears any left from before that, and
 * keeps the deploy unable to stall on a question.
 *
 * Safe to run always: it only deletes the marker rows, never real migration
 * history, and no-ops when the table or the database is absent.
 */
import { Client } from 'pg'

const run = async (): Promise<void> => {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL || ''

  if (!/^postgres(ql)?:\/\//.test(url)) {
    // SQLite development, or no database configured: nothing to do.
    return
  }

  const client = new Client({ connectionString: url })

  try {
    await client.connect()

    const { rows } = await client.query<{ to_regclass: string | null }>(
      "select to_regclass('payload_migrations')",
    )
    if (!rows[0]?.to_regclass) {
      // First deploy: the migration table is created by the migration itself.
      return
    }

    const deleted = await client.query('delete from payload_migrations where batch = -1')
    if (deleted.rowCount) {
      console.log(
        `[db] Cleared ${deleted.rowCount} dev-push marker row(s) from payload_migrations so ` +
          'migrations can run without an interactive prompt.',
      )
    }
  } catch (error) {
    // Never block a deploy over this: if the database is unreachable the
    // migration step that follows will fail with a far clearer message.
    console.warn('[db] Could not check for dev-push markers:', error instanceof Error ? error.message : error)
  } finally {
    await client.end().catch(() => {})
  }
}

void run()
