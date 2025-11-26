import type { NominatimResult } from '~/lib/types';

import { SearchSchema } from '~/lib/zod-schemas';

import defineAuthenticatedEventHandler from '../utils/define-authenticated-event-handler';
import sendZodError from '../utils/send-zod-error.ts';

export default defineAuthenticatedEventHandler(
  defineCachedEventHandler(async (event) => {
    const result = await getValidatedQuery(event, SearchSchema.safeParse);

    if (!result.success) {
      return sendZodError(event, result.error);
    }

    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(result.data.q)}`, {
        signal: AbortSignal.timeout(5000),
        headers: {
          'User-Agent': 'nuxt-travel-log/1.0 | clintlosee.dev',
        },
      });

      if (!response.ok) {
        return sendError(event, createError({
          statusCode: 504,
          statusMessage: 'Unable to reach search API.',
        }));
      }

      const results = await response.json() as NominatimResult[];
      return results;
    }
    catch (error) {
      console.error('error:', error);
      return sendError(event, createError({
        statusCode: 504,
        statusMessage: 'Unable to reach search API.',
      }));
    }
  }, {
    maxAge: 60 * 60 * 24, // 1 day
    name: 'search-nominatim',
    getKey: async (event) => {
      const query = await getQuery(event);
      return query.q?.toString() as string || '';
    },
  }),
);
