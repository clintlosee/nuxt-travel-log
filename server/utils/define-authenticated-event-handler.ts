import type { User } from 'better-auth';
import type { H3Event, H3EventContext } from 'h3';

type AuthenticatedEvent = H3Event & {
  context: H3EventContext & {
    user: User;
  };
};

export default function defineAuthenticatedEventHandler(handler: (event: AuthenticatedEvent) => any) {
  return defineEventHandler(async (event) => {
    if (!event.context.user) {
      return sendError(event, createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
      }));
    }

    return handler(event as AuthenticatedEvent);
  });
}
