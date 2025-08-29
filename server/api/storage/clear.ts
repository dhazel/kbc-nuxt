export default defineEventHandler(async (event) => {
  // Authentication check
  const kinde = event.context.kinde;
  if (kinde === null) {
    throw createError({ statusCode: 500, message: 'Authentication is not set up' });
  }
  else if (! await kinde.isAuthenticated()) {
    throw createError({ statusCode: 401, message: 'Not Authenticated' });
  }

  try {
    const kv = event.context.$kv;
    await kv.clear();
    return { success: true };
  } catch (error: any) {
    throw createError({ statusCode: 500, message: error.message || 'Internal server error' });
  }
});