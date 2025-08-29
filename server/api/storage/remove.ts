export default defineEventHandler(async (event) => {
  // Authentication check
  const kinde = event.context.kinde;
  if (kinde === null) {
    throw createError({ statusCode: 500, message: 'Authentication is not set up' });
  }
  else if (! await kinde.isAuthenticated()) {
    throw createError({ statusCode: 401, message: 'Not Authenticated' });
  }

  const { key } = await readBody(event);
  if (!key) {
    throw createError({ statusCode: 400, message: 'Key is required' });
  }

  try {
    const kv = event.context.$kv;
    await kv.removeItem(key);
    return { success: true };
  } catch (error: any) {
    throw createError({ statusCode: 500, message: error.message || 'Internal server error' });
  }
});