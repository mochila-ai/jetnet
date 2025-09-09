# Changelog

All notable changes to the JetNet n8n integration nodes will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2025-09-09

### Added
- Initial release of JetNet n8n integration nodes
- JetNet standard node with 68 operations across 4 resources:
  - Aircraft resource (31 operations)
  - Company resource (11 operations)
  - Contact resource (9 operations)
  - Market resource (19 operations)
- JetNetTool AI Agent-compatible node for intelligent automation
- Comprehensive authentication system with automatic token management
- Response formatting for clean data output
- TypeScript implementation with full type safety
- Example workflows for all major operations
- Support for pagination in list operations
- Error handling and automatic token refresh
- AI Tools framework compatibility
- LangChain integration support

### Security
- Secure credential storage through n8n system
- No hardcoded credentials or tokens
- Automatic token expiration handling

### Documentation
- Comprehensive README with all operations documented
- Example workflows for testing
- TypeScript interfaces for all data types
- API reference documentation

## [Unreleased]
- Additional filtering options for list operations
- Bulk update operations
- WebSocket support for real-time updates
- Advanced caching mechanisms
- Performance optimizations for large datasets