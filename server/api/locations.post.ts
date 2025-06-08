import type { DrizzleError } from 'drizzle-orm';

import slugify from 'slug';

import { findLocationByName, findUniqueSlug, insertLocation } from '~/lib/db/queries/location';
import { InsertLocation } from '~/lib/db/schema';

export default defineEventHandler(async (event) => {
  if (!event.context.user) {
    return sendError(event, createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    }));
  }

  const result = await readValidatedBody(event, InsertLocation.safeParse);

  if (!result.success) {
    const statusMessage = result.error.issues.map((issue) => {
      return `${issue.path.join('')}: ${issue.message}`;
    }).join('; ');

    const data = result.error.issues.reduce((errors, issue) => {
      errors[issue.path.join('')] = issue.message;
      return errors;
    }, {} as Record<string, string>);

    return sendError(event, createError({
      statusCode: 422,
      statusMessage,
      data,
    }));
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
