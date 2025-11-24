import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/tta(.*)",
  "/api/chat(.*)",
  "/api/gallery(.*)",
  "/api/generate-image(.*)",
  "/api/guardrail(.*)",
  "/api/profile/(.*)",
  "/api/badge/og-share/(.*)",
  "/api/badge/og/(.*)",
  "/i/(.*)",
  "/p/(.*)",
  "/sign-in(.*)",
  "/share/badge/(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
