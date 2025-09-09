# JetNet n8n Integration Nodes

[![npm version](https://img.shields.io/npm/v/@mochila/n8n-nodes-jetnet.svg)](https://www.npmjs.com/package/@mochila/n8n-nodes-jetnet)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![n8n](https://img.shields.io/badge/n8n-compatible-orange.svg)](https://n8n.io)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![npm downloads](https://img.shields.io/npm/dm/@mochila/n8n-nodes-jetnet.svg)](https://www.npmjs.com/package/@mochila/n8n-nodes-jetnet)

> Enterprise-grade n8n integration for JetNet Aviation API - Access comprehensive aircraft data, market intelligence, and aviation analytics through workflow automation and AI agents.

**Developer**: [Matt Busi](https://github.com/mtebusi) | **Organization**: [Mochila AI](https://github.com/mochila-ai)

## 🚀 Quick Start

```bash
# Install via npm
npm install @mochila/n8n-nodes-jetnet

# Or install through n8n UI
Settings → Community Nodes → Search "@mochila/n8n-nodes-jetnet" → Install
```

## 📋 Overview

This integration provides **68 operations** across JetNet's aviation data platform, enabling automated workflows for aircraft valuation, market analysis, fleet tracking, and aviation intelligence. Built with TypeScript for reliability and full AI Agent compatibility.

### Why Use This Integration?

- **Complete API Coverage**: Every JetNet endpoint implemented
- **Dual Architecture**: Standard nodes + AI Agent tools
- **Enterprise Ready**: Automatic authentication, error handling, pagination
- **AI Compatible**: Natural language queries through LangChain integration
- **Type Safe**: Full TypeScript with IntelliSense support

## 🎯 Key Features

| Feature | Description |
|---------|-------------|
| **68 Operations** | Complete coverage of Aircraft, Company, Contact, and Market resources |
| **AI Agent Tools** | Natural language interface for aviation data queries |
| **Auto Authentication** | Dual-token system with automatic refresh |
| **Smart Pagination** | Efficient handling of large datasets |
| **Error Recovery** | Automatic retry logic with exponential backoff |
| **Response Formatting** | Clean, structured JSON output |

## 📦 What's Included

### Two Node Types

1. **JetNet Node** - Standard workflow automation
   - Direct API operations
   - Batch processing
   - Scheduled tasks
   - ETL pipelines

2. **JetNet Tool** - AI Agent compatible
   - Natural language queries
   - Context-aware responses
   - LangChain integration
   - Conversational interfaces

## 🔧 Configuration

### Prerequisites

- n8n version 1.0.0+
- Node.js 18.0.0+
- JetNet API credentials

### Authentication Setup

1. Obtain JetNet API credentials from [JetNet Connect](https://customer.jetnetconnect.com)
2. In n8n, create new JetNet credentials:
   - **Username**: Your JetNet email
   - **Password**: Your JetNet password
3. The integration handles token management automatically

## 📊 Available Operations

### Aircraft Resource (31 operations)
- Get aircraft details, valuations, maintenance records
- Track flights, ownership, modifications
- Access market comparisons and trends

### Company Resource (11 operations)
- Company profiles, fleet data, certifications
- Ownership history, contact information
- Business relationships and activities

### Contact Resource (7 operations)
- Contact details, relationships
- Aircraft and company associations
- Communication preferences

### Market Resource (19 operations)
- Market intelligence, trends, forecasts
- Comparative analysis, valuations
- Industry reports and insights

## 💡 Usage Examples

### Standard Workflow
```javascript
// Get aircraft by registration
Resource: Aircraft
Operation: Get By Registration
Registration: N12345
```

### AI Agent Query
```text
"Find all Boeing 737 aircraft manufactured after 2020 with current market valuations"
```

## 🤖 AI Agent Integration

The JetNet Tool node integrates seamlessly with n8n AI Agents:

1. Add an AI Agent node (OpenAI, Anthropic, etc.)
2. Connect JetNet Tool as an available tool
3. Configure natural language prompts
4. Agent automatically queries JetNet based on context

## 📚 Documentation

- [API Documentation](https://customer.jetnetconnect.com/swagger)
- [n8n Documentation](https://docs.n8n.io)
- [GitHub Repository](https://github.com/mochila-ai/jetnet)
- [npm Package](https://www.npmjs.com/package/@mochila/n8n-nodes-jetnet)

## 🔒 Security & Compliance

- Apache 2.0 Licensed with trademark protections
- Secure credential storage via n8n
- No hardcoded secrets or tokens
- Automatic token expiration handling
- Full audit logging capability

## ⚖️ Legal Notice

**JetNet® is a registered trademark of JetNet, LLC.** This project is an independent integration and is not affiliated with, endorsed by, or sponsored by JetNet, LLC. Use of the JetNet name is solely for identification of the integrated service.

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history and updates.

## 📄 License

Licensed under the Apache License 2.0 with additional trademark protections. See [LICENSE](LICENSE) and [NOTICE](NOTICE) files for details.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/mochila-ai/jetnet/issues)
- **Discussions**: [GitHub Discussions](https://github.com/mochila-ai/jetnet/discussions)
- **JetNet Support**: [Official JetNet Support](https://www.jetnet.com/support)

---

**Keywords**: jetnet, aviation, aircraft, n8n, workflow, automation, api, integration, market-intelligence, aviation-data, fleet-management, aircraft-valuation, ai-tools, langchain, typescript

*Built with ❤️ by [Mochila AI](https://github.com/mochila-ai)*