import type { DrizzleError } from 'drizzle-orm';

import slugify from 'slug';

import { findLocationByName, findUniqueSlug, insertLocation } from '~/lib/db/queries/location';
import { InsertLocation } from '~/lib/db/schema';

import defineAuthenticatedEventHandler from '../utils/define-authenticated-event-handler';
import sendZodError from '../utils/send-zod-error.ts';

export default defineAuthenticatedEventHandler(async (event) => {
  const result = await readValidatedBody(event, InsertLocation.safeParse);

  if (!result.success) {
    return sendZodError(event, result.error);
  }

  const existingLocation = await findLocationByName(result.data, event.context.user.id);

  if (existingLocation) {
    return sendError(event, createError({
      statusCode: 409,
      statusMessage: 'Location with this name already exists.',
    }));
  }

  const slug = await findUniqueSlug(slugify(result.data.name));

  try {
    return insertLocation(result.data, slug, event.context.user.id);
  }
  catch (err) {
    console.error('err:', err);
    const error = err as DrizzleError;
    if (error.message === 'SQLITE_CONSTRAINT: SQLite error: UNIQUE constraint failed: location.slug') {
      throw createError({
        statusCode: 409,
        statusMessage: 'Slug must be unique (the location name is used to generate the slug).',
      });
    }
    throw error;
  }
});
