/**
 * Contains utility functions to help redirect the user to their previous page after signing in.
 * Works by capturing their previous URL and passing it as a query parameter to the sign-in page.
 * eg: `/sign-in?redirect=previous20%path`
 */

export const createRedirectUrl = (path: string, authTarget = "sign-in") => {
  if (authTarget === "sign-in" || authTarget === "sign-up") return authTarget;

  const encodedPath = encodeURIComponent(path);
  return `/${authTarget}?redirect=${encodedPath}`;
};

export const extractRedirectUrl = (searchParams: URLSearchParams) => {
  const redirect = searchParams.get("redirect");

  if (!redirect) return "/";

  const decodedRedirect = decodeURIComponent(redirect);
  // Prevent open redirect attacks
  if (decodedRedirect.startsWith("/") && !decodedRedirect.startsWith("//")) {
    return decodedRedirect;
  }

  //if absolute url, check if it's from the same origin
  const url = new URL(decodedRedirect, window.location.origin);
  if (url.origin === window.location.origin) {
    return url.pathname + url.search + url.hash;
  }
  return "/";
};
