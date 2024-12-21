import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  isAuthenticatedNextjs,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

const isPublicPage = createRouteMatcher(["/"]);
const isRegisterPage = createRouteMatcher(["/register"]);
const isLoginPage = createRouteMatcher(["/login"]);

export default convexAuthNextjsMiddleware((request) => {
  if (
    isPublicPage(request) ||
    isLoginPage(request) ||
    isRegisterPage(request)
  ) {
    if (
      (isLoginPage(request) || isRegisterPage(request)) &&
      isAuthenticatedNextjs()
    ) {
      return nextjsMiddlewareRedirect(request, "/documents");
    }

    return null;
  }

  if (!isAuthenticatedNextjs()) {
    return nextjsMiddlewareRedirect(request, "/login");
  }

  return null;
});

export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
