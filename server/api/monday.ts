import mondaySdk from "monday-sdk-js";

export default defineEventHandler(async (event) => {
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
