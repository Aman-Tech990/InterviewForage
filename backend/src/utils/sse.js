// Server-Sent Events helper. Used for AI responses so tokens reach the browser as the
// model produces them. The heartbeat keeps proxies from closing a connection that is
// waiting on a slow model call.
export function openSse(req, res) {
  res.status(200).set({
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  });
  res.flushHeaders();

  let closed = false;
  res.on('close', () => { closed = true; });

  const heartbeat = setInterval(() => {
    if (!closed) res.write(': keep-alive\n\n');
  }, 15000);

  return {
    emit(event, data = {}) {
      if (closed) return;
      res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
    },
    end() {
      clearInterval(heartbeat);
      if (!closed) res.end();
    },
  };
}

export const wantsEventStream = (req) => String(req.headers.accept ?? '').includes('text/event-stream');
