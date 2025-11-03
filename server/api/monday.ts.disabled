import mondaySdk from "monday-sdk-js";

export default defineEventHandler(async (event) => {

  const kinde = event.context.kinde;
  if (kinde === null) {
    throw createError({ statusCode: 500, message: 'Authentication is not set up' });
  }
  else if (! await kinde.isAuthenticated()) {
    throw createError({ statusCode: 401, message: 'Not Authenticated' });
  }


  const { query } = await readBody(event);
  const config = useRuntimeConfig();
  const monday = mondaySdk();
  monday.setToken(config.mondayToken);
  try {
    return await monday.api(query);
  } catch (error) {
    throw createError({ statusCode: 500, message: error.message });
  }
});
