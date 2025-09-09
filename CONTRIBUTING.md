# Contributing to JetNet n8n Integration

Thank you for considering contributing to the JetNet n8n integration nodes. This document provides guidelines for contributing to this private repository.

## Development Setup

### Prerequisites
- Node.js 18.x or higher
- npm 8.x or higher
- n8n instance for testing
- JetNet API credentials

### Installation
```bash
# Clone the repository
git clone https://github.com/mochila-ai/jetnet.git
cd jetnet

# Install dependencies
npm install

# Build the project
npm run build
```

## Development Workflow

### Code Style
- TypeScript strict mode enabled
- ESLint configuration enforced
- Prettier for code formatting

### Testing
Before submitting changes:
1. Run `npm run lint` to check code style
2. Run `npm run build` to ensure compilation
3. Test in local n8n instance
4. Verify all operations work as expected

### Commit Messages
Follow conventional commit format:
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `refactor:` Code refactoring
- `test:` Test additions or changes
- `chore:` Maintenance tasks

## Pull Request Process

1. Create a feature branch from `main`
2. Make your changes following the guidelines above
3. Update documentation if needed
4. Submit a pull request with clear description
5. Ensure all checks pass

## Code of Conduct

### Professional Standards
- Use welcoming and inclusive language
- Be respectful of differing viewpoints
- Accept constructive criticism gracefully
- Focus on what is best for the project

### Responsibilities
- Maintain code quality and documentation
- Review pull requests constructively
- Report issues with clear reproduction steps
- Test changes thoroughly before submission

## Questions

For questions about contributing, please contact Matt Busi at matt@shadowrock.io