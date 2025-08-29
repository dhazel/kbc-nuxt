export default defineEventHandler(async (event) => {
  // Authentication check
  const kinde = event.context.kinde;
  if (kinde === null) {
    throw createError({ statusCode: 500, message: 'Authentication is not set up' });
  }
  else if (! await kinde.isAuthenticated()) {
    throw createError({ statusCode: 401, message: 'Not Authenticated' });
  }

  const { key, value } = await readBody(event);
  if (!key || value === undefined) {
    throw createError({ statusCode: 400, message: 'Key and value are required' });
  }

  try {
    const kv = event.context.$kv;
    await kv.setItem(key, value);
    return { success: true };
  } catch (error: any) {
    throw createError({ statusCode: 500, message: error.message || 'Internal server error' });
  }
});
