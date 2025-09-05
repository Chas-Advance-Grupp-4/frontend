routes/

Routing configuration and wrappers for protected routes.
Examples:

AppRouter.tsx (React Router config)

ProtectedRoute.tsx (checks JWT, redirects to login if unauthenticated)

AdminRoutes.tsx, PublicRoutes.tsx (role-based route groups)

👉 Think: Navigation logic, not UI.
