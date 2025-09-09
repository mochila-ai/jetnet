# Security Policy

## Supported Versions

We release patches for security vulnerabilities in the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |
| < 0.1.0 | :x:                |

## Reporting a Vulnerability

We take the security of the JetNet n8n nodes seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### Please do NOT:
- Open a public GitHub issue for security vulnerabilities
- Post about the vulnerability on social media or forums

### Please DO:
- Email your findings to the maintainer (see package.json for contact)
- Include the following information:
  - Type of issue (e.g., credential exposure, API token leak, etc.)
  - Full paths of source file(s) related to the manifestation of the issue
  - Step-by-step instructions to reproduce the issue
  - Proof-of-concept or exploit code (if possible)
  - Impact of the issue

### What to Expect

- **Acknowledgment**: We will acknowledge receipt of your vulnerability report within 48 hours
- **Communication**: We will keep you informed about the progress of addressing the vulnerability
- **Fix Timeline**: We aim to release a patch within 7-14 days, depending on complexity
- **Credit**: We will credit you for the discovery (unless you prefer to remain anonymous)

## Security Measures

This package implements several security measures:

### 1. Credential Protection
- All API credentials are handled through n8n's secure credential storage
- Tokens are never logged or exposed in error messages
- Sensitive data is automatically redacted from error outputs

### 2. Error Sanitization
- All error messages are sanitized to remove:
  - Bearer tokens
  - API tokens
  - Passwords
  - Email addresses in authentication context
  - URLs containing tokens

### 3. Request Security
- All API requests use HTTPS
- Default timeout of 60 seconds prevents hanging requests
- Token caching includes automatic expiry handling

### 4. Input Validation
- All user inputs are validated before being sent to the API
- SQL injection and XSS attacks are prevented through proper parameterization

## Best Practices for Users

1. **Credential Management**:
   - Use n8n's built-in credential storage
   - Never hardcode credentials in workflows
   - Rotate API tokens regularly
   - Use environment-specific credentials

2. **Workflow Security**:
   - Limit access to workflows containing JetNet nodes
   - Review workflow permissions regularly
   - Audit workflow executions

3. **Data Handling**:
   - Be cautious when exposing aircraft/company data
   - Implement proper access controls
   - Consider data retention policies

## Dependencies

We regularly update dependencies to patch known vulnerabilities. Run `npm audit` to check for vulnerabilities in dependencies.

## Contact

For security concerns, please contact the maintainer directly rather than using public issue trackers.