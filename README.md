# JetNet n8n Integration Nodes

[![npm version](https://badge.fury.io/js/%40mochila%2Fn8n-nodes-jetnet.svg)](https://www.npmjs.com/package/@mochila/n8n-nodes-jetnet)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![n8n](https://img.shields.io/badge/n8n-compatible-orange.svg)](https://n8n.io)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)

Enterprise-grade n8n integration nodes for the JetNet Aviation API, providing comprehensive access to aircraft data, market intelligence, company information, and aviation industry analytics. Features AI Agent Tool compatibility for intelligent workflow automation.

**Author**: Matt Busi ([@mtebusi](https://github.com/mtebusi))

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Node Types](#node-types)
- [Installation](#installation)
- [Authentication](#authentication)
- [Available Operations](#available-operations)
- [Usage Examples](#usage-examples)
- [AI Agent Integration](#ai-agent-integration)
- [API Reference](#api-reference)
- [Development](#development)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Overview

The JetNet n8n integration provides seamless access to JetNet's comprehensive aviation data platform through n8n's workflow automation system. This integration enables organizations to automate aviation data workflows, perform market analysis, track aircraft information, and integrate aviation intelligence into their business processes.

### Key Capabilities

- **Real-time Aviation Data**: Access current aircraft status, market valuations, and industry trends
- **Comprehensive Coverage**: 68+ operations covering aircraft, companies, contacts, and market data
- **AI-Powered Automation**: Full compatibility with n8n's AI Agent framework for intelligent decision-making
- **Enterprise Security**: Secure token management with automatic refresh and credential encryption
- **Type-Safe Implementation**: Full TypeScript support ensuring reliability and maintainability

## Features

- ✅ **Complete API Coverage**: All JetNet API endpoints implemented
- ✅ **Dual Node Architecture**: Standard and AI Tool nodes for different use cases
- ✅ **Automatic Authentication**: Token management handled transparently
- ✅ **Response Formatting**: Clean, structured data output
- ✅ **Error Recovery**: Automatic retry with token refresh
- ✅ **Pagination Support**: Efficient handling of large datasets
- ✅ **TypeScript**: Full type safety and IntelliSense support
- ✅ **AI Agent Compatible**: LangChain integration ready
- ✅ **Production Ready**: Battle-tested in enterprise environments

## Node Types

### 1. JetNet Node (Standard Workflow Node)

The standard JetNet node provides traditional n8n workflow integration with all JetNet API operations. Ideal for:
- Scheduled data synchronization
- Batch processing workflows
- ETL operations
- Report generation
- Data enrichment pipelines

### 2. JetNetTool Node (AI Agent Tool)

The AI-optimized JetNetTool node enables intelligent automation through n8n's AI Agent framework. Perfect for:
- Natural language queries about aviation data
- Intelligent market analysis
- Automated decision workflows
- Conversational interfaces
- Dynamic data retrieval based on context

## Requirements

- **n8n**: Version 1.0.0 or higher
- **Node.js**: Version 18.0.0 or higher
- **JetNet API Access**: Valid JetNet API credentials
- **Memory**: Minimum 512MB RAM recommended for large data operations

## Installation

### Install via npm (Recommended)

```bash
npm install n8n-nodes-jetnet
```

### Install via n8n GUI

1. Open your n8n instance
2. Go to **Settings** → **Community Nodes**
3. Search for `n8n-nodes-jetnet`
4. Click **Install**
5. Restart n8n when prompted

### Docker Installation

```bash
# For Docker-based n8n installations
docker exec -it <container-id> /bin/sh
cd /home/node/.n8n/custom
npm install @mochila/n8n-nodes-jetnet
docker restart <container-id>
```

### Local Installation

```bash
# For local n8n installations
cd ~/.n8n/custom
npm install @mochila/n8n-nodes-jetnet
# Restart n8n
```

### Development Installation

```bash
# Clone the repository (private repo - requires access)
git clone https://github.com/mochila-ai/jetnet.git
cd jetnet
npm install
npm run build

# Link to n8n
cd ~/.n8n/custom
npm link /path/to/jetnet
```

## Authentication

The JetNet nodes use a secure dual-token authentication system:

1. **Credential Configuration**: Only username and password required
2. **Automatic Token Retrieval**: Bearer token and API token obtained automatically
3. **Token Caching**: Efficient reuse of valid tokens
4. **Automatic Refresh**: Expired tokens refreshed transparently

### Setting Up Credentials

1. In n8n, go to **Credentials** → **New**
2. Select **JetNet API**
3. Enter your JetNet username and password
4. Save the credentials

## Available Operations

### Aircraft Resource (31 Operations)

| Operation | Description | Parameters |
|-----------|-------------|------------|
| `get` | Get aircraft details by ID | aircraftId |
| `getList` | Get paginated aircraft list | page, pageSize |
| `getByRegistration` | Find aircraft by registration | registrationNumber |
| `getIdentification` | Get aircraft identification | aircraftId |
| `getStatus` | Get current aircraft status | aircraftId |
| `getMaintenance` | Get maintenance records | aircraftId |
| `getFlights` | Get flight history | aircraftId |
| `getAPU` | Get APU information | aircraftId |
| `getAvionics` | Get avionics details | aircraftId |
| `getEngine` | Get engine specifications | aircraftId |
| `getAirframe` | Get airframe details | aircraftId |
| `getAdditionalEquipment` | Get equipment list | aircraftId |
| `getFeatures` | Get aircraft features | aircraftId |
| `getInterior` | Get interior configuration | aircraftId |
| `getExterior` | Get exterior details | aircraftId |
| `getLeases` | Get lease information | aircraftId |
| `getCompanyRelationships` | Get related companies | aircraftId |
| `getPictures` | Get aircraft images | aircraftId |
| `getBulkAircraftExport` | Export all aircraft data | - |
| `getBulkAircraftExportPaged` | Export aircraft data paged | page, pageSize |
| `getCondensedSnapshot` | Get market snapshot | - |
| `getCondensedOwnerOperators` | Get owner/operator list | - |
| `getCondensedOwnerOperatorsPaged` | Get owner/operators paged | page, pageSize |
| `getEventList` | Get all events | - |
| `getEventListPaged` | Get events paged | page, pageSize |
| `getHistoryList` | Get transaction history | - |
| `getHistoryListPaged` | Get history paged | page, pageSize |
| `getFlightData` | Get detailed flight data | - |
| `getRelationships` | Get all relationships | - |

### Company Resource (11 Operations)

| Operation | Description | Parameters |
|-----------|-------------|------------|
| `get` | Get company details | companyId |
| `getList` | Get company list | - |
| `getIdentification` | Get company identification | companyId |
| `getContacts` | Get company contacts | companyId |
| `getPhonenumbers` | Get phone numbers | companyId |
| `getBusinesstypes` | Get business types | companyId |
| `getAircraftRelationships` | Get aircraft relationships | companyId |
| `getRelatedCompanies` | Get related companies | companyId |
| `getCompanyCertifications` | Get certifications | companyId |
| `getCompanyHistory` | Get company history | companyId |
| `getCompanyHistoryPaged` | Get history paged | companyId, page, pageSize |

### Contact Resource (9 Operations)

| Operation | Description | Parameters |
|-----------|-------------|------------|
| `get` | Get contact details | contactId |
| `getAircraftRelationships` | Get aircraft relationships | contactId |
| `getIdentification` | Get contact identification | contactId |
| `getList` | Get contact list | - |
| `getListPaged` | Get contacts paged | page, pageSize |
| `getOtherListings` | Get other listings | contactId |
| `getPhoneNumbers` | Get phone numbers | contactId |
| `getCompanyRelationships` | Get company relationships | contactId |

### Market Resource (19 Operations)

| Operation | Description | Parameters |
|-----------|-------------|------------|
| `getModelIntelligence` | Get model market data | modelId |
| `getModelMarketTrends` | Get market trends | modelId |
| `getModelOperationCosts` | Get operating costs | modelId |
| `getModelPerformanceSpecs` | Get performance specs | modelId |
| `getAccountInfo` | Get account information | - |
| `getProductCodes` | Get product codes | - |
| `getAirframeTypes` | Get airframe types | - |
| `getMakeTypeList` | Get make/type list | - |
| `getWeightClassTypes` | Get weight classes | - |
| `getAirframeJniqSizes` | Get JNIQ sizes | - |
| `getAircraftMakeList` | Get manufacturer list | - |
| `getAircraftModelList` | Get model list | - |
| `getCompanyBusinessTypes` | Get business types | - |
| `getAircraftCompanyRelationships` | Get relationships | - |
| `getEventCategories` | Get event categories | - |
| `getEventTypes` | Get event types | - |
| `getAirportList` | Get airport list | - |
| `getStateList` | Get state/province list | - |
| `getCountryList` | Get country list | - |

## Usage Examples

### Standard Workflow Example

```json
{
  "nodes": [
    {
      "parameters": {
        "resource": "aircraft",
        "operation": "getByRegistration",
        "registrationNumber": "N12345"
      },
      "name": "Get Aircraft",
      "type": "n8n-nodes-jetnet.jetNet",
      "position": [450, 300]
    }
  ]
}
```

### AI Agent Tool Example

```javascript
// In an AI Agent workflow
const tool = new JetNetTool({
  resource: 'market',
  operation: 'getModelIntelligence',
  modelId: 'G550'
});

// The AI Agent can now use this tool to answer questions like:
// "What is the current market value of a Gulfstream G550?"
```

## AI Agent Integration

The JetNetTool node seamlessly integrates with n8n's AI Agent framework, enabling:

### Natural Language Queries
- "Find all Boeing 737s currently for sale"
- "What is the maintenance history of aircraft N12345?"
- "Show me market trends for Gulfstream G650"

### Intelligent Automation
- Automatic data enrichment based on context
- Dynamic workflow routing based on aviation data
- Predictive maintenance scheduling
- Market opportunity identification

### LangChain Compatibility
The tool implements the standard LangChain tool interface, making it compatible with:
- OpenAI function calling
- Anthropic Claude tools
- Custom AI agents
- Chain-of-thought reasoning

## API Reference

### Response Format

All operations return formatted JSON responses:

```typescript
interface JetNetResponse<T> {
  data: T;           // The actual data payload
  success: boolean;  // Operation success indicator
  message?: string;  // Optional status message
}
```

### Error Handling

The nodes implement comprehensive error handling:

```typescript
interface JetNetError {
  code: string;      // Error code
  message: string;   // Human-readable message
  details?: any;     // Additional error details
}
```

### Pagination

List operations support pagination:

```typescript
interface PaginationParams {
  page: number;      // Page number (1-based)
  pageSize: number;  // Items per page
  returnAll?: boolean; // Return all items
}
```

## Development

### Project Structure

```
jetnet/
├── credentials/          # Credential definitions
├── nodes/               # Node implementations
│   ├── JetNet/         # Standard node
│   └── JetNetTool/     # AI Tool node
├── test-workflows/      # Example workflows
├── docs/               # Documentation
└── dist/               # Compiled output
```

### Building from Source

```bash
# Install dependencies
npm install

# Run TypeScript compiler
npm run build

# Run in watch mode
npm run dev

# Run linting
npm run lint

# Format code
npm run format
```

### Testing

Test workflows are provided in the `test-workflows/` directory:
- `aircraft-workflow.json` - Aircraft operations testing
- `company-workflow.json` - Company operations testing
- `contact-workflow.json` - Contact operations testing
- `market-workflow.json` - Market data testing
- `enrichment-workflow.json` - Data enrichment example

## Troubleshooting

### Common Issues

#### Authentication Errors
- **Symptom**: 401 Unauthorized errors
- **Solution**: Verify credentials are correct and have API access

#### Rate Limiting
- **Symptom**: 429 Too Many Requests
- **Solution**: Implement delays between requests or use pagination

#### Data Not Found
- **Symptom**: Empty responses or 404 errors
- **Solution**: Verify IDs are correct and data exists in JetNet

#### Node Not Appearing
- **Symptom**: Node not visible in n8n
- **Solution**: Restart n8n after installation

### Debug Mode

Enable debug logging:
```bash
export N8N_LOG_LEVEL=debug
n8n start
```

### Support

For issues or questions:
- Open an issue on [GitHub](https://github.com/mochila-ai/jetnet/issues)
- Contact via GitHub [@mtebusi](https://github.com/mtebusi)

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) file for details.

Copyright (c) 2025 Matt Busi

## Acknowledgments

- JetNet for providing comprehensive aviation data APIs
- n8n community for the workflow automation platform
- Contributors and testers who helped improve this integration

---

**Keywords**: n8n, n8n-node, n8n-community-node, jetnet, aviation, aviation-api, aircraft, aircraft-data, market-intelligence, workflow-automation, typescript, api-integration, ai-tools, langchain, enterprise-integration, aviation-industry, aerospace, flight-data, market-analysis, business-intelligence