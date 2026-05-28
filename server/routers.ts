import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";

/**
 * Main tRPC Router - Defines all API endpoints
 * 
 * tRPC provides type-safe API contracts between frontend and backend:
 * - publicProcedure: Anyone can call (no authentication required)
 * - protectedProcedure: Only authenticated users can call
 * 
 * All endpoints are automatically available at /api/trpc
 * Frontend calls them via: trpc.auth.me.useQuery(), etc.
 * 
 * Benefits:
 * - Full type safety (TypeScript types flow from backend to frontend)
 * - No manual API documentation needed
 * - Automatic error handling and serialization
 */
export const appRouter = router({
  // System endpoints (notifications, health checks, etc.)
  // Registered in server/_core/systemRouter.ts
  system: systemRouter,
  
  // Authentication endpoints
  auth: router({
    /**
     * Get current user info
     * Returns the authenticated user object or null if not logged in
     * Called by frontend to check login status and display user info
     */
    me: publicProcedure.query(opts => opts.ctx.user),
    
    /**
     * Logout the current user
     * Clears the session cookie and returns success status
     * Frontend redirects to login page after logout
     */
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // TODO: Add feature routers here as your app grows
  // Examples: Bookmarks, Favorites, User Preferences, Verse Notes, etc.
  // 
  // Pattern:
  // featureName: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserFeatures(ctx.user.id)
  //   ),
  //   create: protectedProcedure.input(z.object({...})).mutation(({ ctx, input }) =>
  //     db.createFeature(ctx.user.id, input)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;

/**
 * Audio Proxy Handler - Fetches audio from external CDNs
 * 
 * This function is called by the /api/audio-proxy Express endpoint
 * (registered in server/_core/index.ts)
 * 
 * Why it exists:
 * - Browsers block direct cross-origin audio playback (CORS policy)
 * - Server-to-server requests don't have CORS restrictions
 * - This function fetches audio on the server, then streams it to browser
 * 
 * The Express endpoint then:
 * - Adds proper CORS headers (Access-Control-Allow-Origin: *)
 * - Supports HTTP range requests for seeking (206 Partial Content)
 * - Caches the audio for performance (Cache-Control: max-age=3600)
 * 
 * Flow:
 * 1. Frontend requests: /api/audio-proxy?url=<external-url>
 * 2. Express endpoint calls handleAudioProxy(url)
 * 3. This function fetches from external CDN
 * 4. Express streams response back to browser with CORS headers
 * 5. Browser can now play audio without CORS errors
 * 
 * @param fileUrl - External CDN URL of the audio file
 * @returns Response object with audio data
 * @throws Error if the audio file cannot be fetched
 */
export async function handleAudioProxy(fileUrl: string): Promise<Response> {
  try {
    // Fetch audio from external CDN
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch audio: ${response.statusText}`);
    }
    return response;
  } catch (error) {
    throw new Error(`Audio proxy error: ${error}`);
  }
}
