const LEVELS = { debug: 10, info: 20, warn: 30, error: 40 };

const isProduction = process.env.NODE_ENV === 'production';
const threshold = LEVELS[process.env.LOG_LEVEL] ?? (isProduction ? LEVELS.info : LEVELS.debug);
const silent = process.env.NODE_ENV === 'test' && !process.env.LOG_LEVEL;

function serializeMeta(meta) {
  if (!meta) return undefined;
  if (meta instanceof Error) return { name: meta.name, message: meta.message, stack: meta.stack };
  return meta;
}

function write(level, message, meta) {
  if (silent || LEVELS[level] < threshold) return;
  const payload = serializeMeta(meta);
  const stream = level === 'error' || level === 'warn' ? process.stderr : process.stdout;

  if (isProduction) {
    stream.write(`${JSON.stringify({ time: new Date().toISOString(), level, message, ...(payload && { meta: payload }) })}\n`);
    return;
  }

  const time = new Date().toISOString().slice(11, 23);
  const suffix = payload ? ` ${JSON.stringify(payload)}` : '';
  stream.write(`${time} ${level.toUpperCase().padEnd(5)} ${message}${suffix}\n`);
}

export const logger = {
  debug: (message, meta) => write('debug', message, meta),
  info: (message, meta) => write('info', message, meta),
  warn: (message, meta) => write('warn', message, meta),
  error: (message, meta) => write('error', message, meta),
};
