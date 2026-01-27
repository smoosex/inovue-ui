---
name: api-documentation
description: API documentation guidelines
paths: src/**/api.ts, src/**/api/**/*.ts
---

# API Documentation Guidelines

## Required Format

Every API function must include a documentation comment:

Example:

```ts
/**
 * Get user details
 * @description Retrieves user information for profile page display
 */
export const GetUserDetailApi = (): Promise<Response<UserDetail>> => {
  return http.get("/users/me");
};
```

## Rules

- First line: Brief description of the API
- `@description`: Detailed explanation of the purpose and usage
- Never add other lines
