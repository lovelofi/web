import { isAllowedOrigin, withCors } from '../_shared/allowed-origins';

export const onRequest: PagesFunction = async (context) => {
  const origin = context.request.headers.get('Origin');

  if (!isAllowedOrigin(origin)) {
    return new Response('Forbidden', { status: 403 });
  }

  const response = await context.next();
  return withCors(response, origin!);
};
