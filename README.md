# JetNet n8n Integration

Private n8n nodes for integrating with the JetNet API, providing comprehensive aviation industry data including aircraft, company, contact, and market intelligence information.

## Overview

This repository contains two n8n nodes for JetNet API integration:

### 1. JetNet Node (Standard Node)
A comprehensive n8n node for standard workflow automation with JetNet's aviation data platform. This node provides structured access to all JetNet API endpoints through a resource-based interface.

### 2. JetNetTool Node (AI Agent Tool)
An AI-optimized version designed specifically for use with n8n's AI Agent nodes. This tool node provides seamless integration with AI workflows, enabling intelligent data retrieval and processing from JetNet's aviation database.

## Features

- **Comprehensive Aviation Data Access**: Full integration with JetNet's extensive aviation database
- **Dual Node Architecture**: Choose between standard workflow automation or AI-powered processing
- **Resource-Based Organization**: Intuitive grouping of operations by data type
- **AI Tools Framework Compatible**: JetNetTool node fully supports n8n's AI Agent framework
- **Robust Error Handling**: Comprehensive error management and validation
- **Type-Safe Implementation**: Full TypeScript support with proper typing

## Authentication

Both nodes use JetNet's username/password authentication system:
- Automatic token management
- Secure credential storage through n8n's credential system
- Session handling with automatic renewal

## Available Operations

### Aircraft Resource (31 Operations)
- **get** - Get aircraft details by ID
- **getList** - Get list of aircraft
- **getByRegistration** - Get aircraft by registration number
- **getIdentification** - Get aircraft identification details
- **getStatus** - Get aircraft status information
- **getMaintenance** - Get maintenance records
- **getFlights** - Get flight history
- **getAPU** - Get APU information
- **getAvionics** - Get avionics details
- **getEngine** - Get engine information
- **getAirframe** - Get airframe details
- **getAdditionalEquipment** - Get additional equipment list
- **getFeatures** - Get aircraft features
- **getInterior** - Get interior configuration
- **getExterior** - Get exterior details
- **getLeases** - Get lease information
- **getCompanyRelationships** - Get related companies
- **getPictures** - Get aircraft pictures
- **getBulkAircraftExport** - Export bulk aircraft data
- **getBulkAircraftExportPaged** - Export paged bulk aircraft data
- **getCondensedSnapshot** - Get condensed aircraft snapshot
- **getCondensedOwnerOperators** - Get owner/operator summary
- **getCondensedOwnerOperatorsPaged** - Get paged owner/operator data
- **getEventList** - Get aircraft events
- **getEventListPaged** - Get paged aircraft events
- **getHistoryList** - Get aircraft history
- **getHistoryListPaged** - Get paged aircraft history
- **getFlightData** - Get detailed flight data
- **getRelationships** - Get aircraft relationships
- **search** - Search aircraft
- **advancedSearch** - Advanced aircraft search

### Company Resource (11 Operations)
- **get** - Get company details by ID
- **getList** - Get list of companies
- **getIdentification** - Get company identification
- **getContacts** - Get company contacts
- **getPhonenumbers** - Get phone numbers
- **getBusinesstypes** - Get business types
- **getAircraftRelationships** - Get related aircraft
- **getRelatedCompanies** - Get related companies
- **getCompanyCertifications** - Get certifications
- **getCompanyHistory** - Get company history
- **getCompanyHistoryPaged** - Get paged company history

### Contact Resource (9 Operations)
- **get** - Get contact details by ID
- **getAircraftRelationships** - Get aircraft relationships
- **getIdentification** - Get contact identification
- **getList** - Get list of contacts
- **getListPaged** - Get paged list of contacts
- **getOtherListings** - Get other contact listings
- **getPhoneNumbers** - Get phone numbers
- **search** - Search contacts
- **advancedSearch** - Advanced contact search

### Market Resource (19 Operations)
- **getModelIntelligence** - Get model intelligence data
- **getModelMarketTrends** - Get market trends by model
- **getModelOperationCosts** - Get operation costs by model
- **getModelPerformanceSpecs** - Get performance specifications
- **getAccountInfo** - Get account information
- **getProductCodes** - Get product codes
- **getAirframeTypes** - Get airframe types
- **getMakeTypeList** - Get make/type list
- **getWeightClassTypes** - Get weight class types
- **getAirframeJniqSizes** - Get airframe JNIQ sizes
- **getAircraftMakeList** - Get aircraft makes
- **getAircraftModelList** - Get aircraft models
- **getCompanyBusinessTypes** - Get company business types
- **getAircraftCompanyRelationships** - Get aircraft-company relationships
- **getEventCategories** - Get event categories
- **getEventTypes** - Get event types
- **getAirportList** - Get airport list
- **getStateList** - Get state list
- **getCountryList** - Get country list

## Node Architecture

### JetNet Node
- Declarative-style implementation for standard REST operations
- Resource-based routing with operation mapping
- Support for pagination on list operations
- Comprehensive parameter validation
- Rich UI with helpful descriptions and defaults

### JetNetTool Node
- Optimized for AI Agent integration
- Simplified operation structure for AI context
- Enhanced response formatting for AI processing
- Automatic data structuring for AI consumption
- Compatible with n8n's AI Tools framework

## Technical Details

- **n8n Version**: Compatible with n8n v1.19.0+
- **Node API Version**: 1
- **Language**: TypeScript
- **License**: MIT
- **Author**: Matt Busi (matt@shadowrock.io)

## Development

This is a private node package developed for internal use. The nodes follow n8n's best practices for node development including:

- TypeScript for type safety
- Proper credential management
- Comprehensive error handling
- Modular operation structure
- Full API endpoint coverage

## API Coverage

The nodes provide complete coverage of the JetNet API with:
- 70+ total operations across all resources
- Full CRUD operations where applicable
- Bulk data export capabilities
- Advanced search functionality
- Pagination support for large datasets
- Comprehensive filtering options

## Testing

The repository includes test workflows for each resource type:
- Aircraft operations testing
- Company data retrieval
- Contact management
- Market intelligence queries
- Data enrichment workflows

Test workflows are available in the `test-workflows/` directory.

## Support

For issues, questions, or feature requests related to these nodes, please contact the development team.

---

*Note: This is a private repository for internal use. The nodes are not published to npm and are intended for use in controlled environments with proper JetNet API credentials.*