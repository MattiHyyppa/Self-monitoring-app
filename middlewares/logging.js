const errorMiddleware = async(context, next) => {
  try {
    await next();
  } catch (e) {
    console.log(e);
  }
}

const requestTimingMiddleware = async({ request, session }, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  const user = await session.get('user');
  let id = 'anonymous'
  if (user) {
    id = user.id;
  }
  console.log(`${request.method} ${request.url.pathname} - ${ms} ms - user_id: ${id} - timestamp: ${new Date()}`);
}

export { errorMiddleware, requestTimingMiddleware }