import * as LocalSession from 'telegraf-session-local';

export const TELEGRAF_CONFIG = {
  telegrafToken: '5569412870:AAGElS4JVDHdpTcx-d2q5FdyKR3YQr8RZGY',
  telegrafSessions: () => new LocalSession({ database: 'session_db.json' }),
};
