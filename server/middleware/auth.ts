export default defineEventHandler(async (event) => {
    if (event.path === '/api/monday') {
        // console.log(event);
        // console.log(event.headers);
        // const { user } = await requireUserSession(event)
        // console.log(user);
        // const { loggedIn } =  useUserSession(event);
        const kinde = useKindeClient();
        console.log(kinde);
    }
  // const kinde = event.context.kinde; // Assuming Kinde populates this in context
  // if (!kinde || !kinde.isAuthenticated()) {
  //   throw createError({ statusCode: 401, message: 'Unauthorized' });
  // }
  //
  // // Attach user data to context (e.g., from Kinde token/user object)
  // event.context.user = kinde.getUser(); // Or kinde.getIdToken() if you want the raw token; adjust as needed
});
