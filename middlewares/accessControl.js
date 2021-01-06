const limitAccessMiddleware = async({ request, response, session }, next) => {
  const path = request.url.pathname;
  // Landing page, /auth paths and /static paths are accessible to all
  if (path.startsWith('/auth') || path === '/' || path.startsWith('/static') || path.startsWith('/api/')) {
    await next();
  }
  // Authentication required.
  else {
    if (await session.get('authenticated')) {
      await next();
    }
    else {
      response.redirect('/auth/login');
    }
  }
}

export { limitAccessMiddleware }