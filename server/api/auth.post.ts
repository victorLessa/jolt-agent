export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { password } = body;

  if (password === process.env.PASSWORD) {
    // Password is correct, proceed with authentication

    return { success: true };
  }

  throw createError({
    statusCode: 401,
    statusMessage: 'Unauthorized',
  });
})
