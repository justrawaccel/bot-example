# Security Policy

## Supported Versions

This is a template repository. Security updates are applied to the main branch only.

## Reporting a Vulnerability

**Do not report security vulnerabilities through public GitHub issues.**

If you discover a security vulnerability in this template, please report it privately:

1. Use GitHub's private vulnerability reporting feature (Security tab → Report a vulnerability)
2. Or email the maintainers directly if private reporting is not available

### What to Include

When reporting a security issue, please provide:

- Description of the vulnerability
- Steps to reproduce the issue
- Affected components or files
- Potential impact assessment
- Suggested fix (if available)

### Response Timeline

- Initial response: Within 72 hours
- Status update: Within 7 days
- Fix timeline: Varies based on severity and complexity

## Security Considerations for Users

When using this template to build your Discord bot:

### Secrets Management

- Never commit `.env` files or hardcode tokens
- Use environment variables for all sensitive data
- Rotate Discord tokens and database credentials regularly
- Use separate credentials for development and production

### Discord Bot Permissions

- Request only the permissions your bot needs
- Review Discord's permission system documentation
- Use role-based access control for sensitive commands
- Implement rate limiting for public commands

### Database Security

- Use strong passwords for PostgreSQL
- Keep database ports closed to external networks in production
- Run migrations in controlled environments
- Validate and sanitize all user input before database queries

### Dependencies

- Regularly update dependencies with `bun update`
- Review security advisories for discord.js and other packages
- Use `bun audit` or similar tools to check for known vulnerabilities

### Redis Security

- Configure Redis authentication in production
- Limit Redis network exposure
- Do not store sensitive data in cache without encryption

### API Security

- Validate all Discord interaction data
- Implement proper error handling to avoid information leakage
- Use middleware for authentication and authorization
- Rate limit API endpoints and commands

## Disclosure Policy

Security vulnerabilities will be disclosed publicly after:

1. A fix has been developed and tested
2. The fix has been released or documented
3. Users have been given reasonable time to update (typically 7-14 days)

For critical vulnerabilities affecting active deployments, disclosure may be delayed to allow more time for mitigation.