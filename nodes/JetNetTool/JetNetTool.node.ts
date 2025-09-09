import {
	ISupplyDataFunctions,
	INodeType,
	INodeTypeDescription,
	IDataObject,
	IHttpRequestMethods,
	SupplyData,
} from 'n8n-workflow';
import { Tool } from '@langchain/core/tools';

export class JetNetTool implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'JetNet Tool',
		name: 'jetNetTool',
		icon: 'file:../JetNet/JetNet.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Access JetNet aviation data for AI Agents',
		defaults: {
			name: 'JetNet Tool',
		},
		inputs: ['main'],
		// eslint-disable-next-line n8n-nodes-base/node-class-description-outputs-wrong
	outputs: ['ai_tool'],
		outputNames: ['Tool'],
		credentials: [
			{
				name: 'jetNetApi',
				required: true,
			},
		],
		properties: [
			// Tool Description Configuration
			{
				displayName: 'Tool Description',
				name: 'descriptionType',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Set Automatically',
						value: 'auto',
						description: 'Automatically set based on resource and operation',
					},
					{
						name: 'Set Manually',
						value: 'manual',
						description: 'Manually set the description',
					},
				],
				default: 'auto',
			},
			{
				displayName: 'Description',
				name: 'toolDescription',
				type: 'string',
				default: 'Access JetNet aviation industry data including aircraft specifications, company information, contact details, and market intelligence',
				required: true,
				typeOptions: {
					rows: 2,
				},
				description: 'Explain to the LLM what this tool does, a good, specific description would allow LLMs to produce expected results much more often',
				displayOptions: {
					show: {
						descriptionType: ['manual'],
					},
				},
			},

			// Resource selector
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Aircraft',
						value: 'aircraft',
						description: 'Search and retrieve aircraft data',
					},
					{
						name: 'Company',
						value: 'company',
						description: 'Search and retrieve company information',
					},
					{
						name: 'Contact',
						value: 'contact',
						description: 'Search and retrieve contact information',
					},
					{
						name: 'Market',
						value: 'market',
						description: 'Access market intelligence and valuation data',
					},
				],
				default: 'aircraft',
				description: 'The type of aviation data to access',
			},

			// Aircraft Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['aircraft'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get all aircraft data by ID',
						action: 'Get aircraft',
					},
					{
						name: 'Get List',
						value: 'getList',
						description: 'Get list of all aircraft',
						action: 'Get aircraft list',
					},
					{
						name: 'Get by Registration',
						value: 'getByRegistration',
						description: 'Get aircraft by registration number',
						action: 'Get aircraft by registration',
					},
					{
						name: 'Get Identification',
						value: 'getIdentification',
						description: 'Get aircraft identification data',
						action: 'Get aircraft identification',
					},
					{
						name: 'Get Status',
						value: 'getStatus',
						description: 'Get aircraft status information',
						action: 'Get aircraft status',
					},
					{
						name: 'Get Maintenance',
						value: 'getMaintenance',
						description: 'Get aircraft maintenance information',
						action: 'Get aircraft maintenance',
					},
					{
						name: 'Get Flights',
						value: 'getFlights',
						description: 'Get aircraft flight history',
						action: 'Get aircraft flights',
					},
					{
						name: 'Get APU',
						value: 'getAPU',
						description: 'Get aircraft APU (Auxiliary Power Unit) information',
						action: 'Get aircraft APU',
					},
					{
						name: 'Get Avionics',
						value: 'getAvionics',
						description: 'Get aircraft avionics equipment',
						action: 'Get aircraft avionics',
					},
					{
						name: 'Get Engine',
						value: 'getEngine',
						description: 'Get aircraft engine information',
						action: 'Get aircraft engine',
					},
					{
						name: 'Get Airframe',
						value: 'getAirframe',
						description: 'Get aircraft airframe information',
						action: 'Get aircraft airframe',
					},
					{
						name: 'Get Additional Equipment',
						value: 'getAdditionalEquipment',
						description: 'Get aircraft additional equipment details',
						action: 'Get aircraft additional equipment',
					},
					{
						name: 'Get Features',
						value: 'getFeatures',
						description: 'Get aircraft features and capabilities',
						action: 'Get aircraft features',
					},
					{
						name: 'Get Interior',
						value: 'getInterior',
						description: 'Get aircraft interior configuration and details',
						action: 'Get aircraft interior',
					},
					{
						name: 'Get Exterior',
						value: 'getExterior',
						description: 'Get aircraft exterior paint and details',
						action: 'Get aircraft exterior',
					},
					{
						name: 'Get Leases',
						value: 'getLeases',
						description: 'Get aircraft lease information',
						action: 'Get aircraft leases',
					},
					{
						name: 'Get Company Relationships',
						value: 'getCompanyRelationships',
						description: 'Get companies related to this aircraft',
						action: 'Get aircraft company relationships',
					},
					{
						name: 'Get Pictures',
						value: 'getPictures',
						description: 'Get aircraft pictures and image URLs',
						action: 'Get aircraft pictures',
					},
					{
						name: 'Get Bulk Aircraft Export',
						value: 'getBulkAircraftExport',
						description: 'Export all aircraft data in bulk',
						action: 'Get bulk aircraft export',
					},
					{
						name: 'Get Bulk Aircraft Export Paged',
						value: 'getBulkAircraftExportPaged',
						description: 'Export aircraft data in pages',
						action: 'Get bulk aircraft export paged',
					},
					{
						name: 'Get Condensed Snapshot',
						value: 'getCondensedSnapshot',
						description: 'Get condensed aircraft market snapshot',
						action: 'Get condensed snapshot',
					},
					{
						name: 'Get Condensed Owner Operators',
						value: 'getCondensedOwnerOperators',
						description: 'Get condensed owner/operator information',
						action: 'Get condensed owner operators',
					},
					{
						name: 'Get Condensed Owner Operators Paged',
						value: 'getCondensedOwnerOperatorsPaged',
						description: 'Get condensed owner/operator info with pagination',
						action: 'Get condensed owner operators paged',
					},
					{
						name: 'Get Event List',
						value: 'getEventList',
						description: 'Get aircraft event list',
						action: 'Get event list',
					},
					{
						name: 'Get Event List Paged',
						value: 'getEventListPaged',
						description: 'Get aircraft event list with pagination',
						action: 'Get event list paged',
					},
					{
						name: 'Get History List',
						value: 'getHistoryList',
						description: 'Get aircraft history list',
						action: 'Get history list',
					},
					{
						name: 'Get History List Paged',
						value: 'getHistoryListPaged',
						description: 'Get aircraft history list with pagination',
						action: 'Get history list paged',
					},
					{
						name: 'Get Flight Data',
						value: 'getFlightData',
						description: 'Get comprehensive flight data',
						action: 'Get flight data',
					},
					{
						name: 'Get Relationships',
						value: 'getRelationships',
						description: 'Get all aircraft relationships',
						action: 'Get relationships',
					},
				],
				default: 'getList',
			},

			// Company Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['company'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get all company data by ID',
						action: 'Get company',
					},
					{
						name: 'Get List',
						value: 'getList',
						description: 'Get list of all companies',
						action: 'Get company list',
					},
					{
						name: 'Get Identification',
						value: 'getIdentification',
						description: 'Get company identification data',
						action: 'Get company identification',
					},
					{
						name: 'Get Contacts',
						value: 'getContacts',
						description: 'Get list of contacts associated with company',
						action: 'Get company contacts',
					},
					{
						name: 'Get Phone Numbers',
						value: 'getPhonenumbers',
						description: 'Get company phone numbers',
						action: 'Get company phone numbers',
					},
					{
						name: 'Get Business Types',
						value: 'getBusinesstypes',
						description: 'Get business types/roles the company plays',
						action: 'Get company business types',
					},
					{
						name: 'Get Aircraft Relationships',
						value: 'getAircraftRelationships',
						description: 'Get aircraft relationships for this company',
						action: 'Get company aircraft relationships',
					},
					{
						name: 'Get Related Companies',
						value: 'getRelatedCompanies',
						description: 'Get companies related to this company',
						action: 'Get related companies',
					},
					{
						name: 'Get Company Certifications',
						value: 'getCompanyCertifications',
						description: 'Get company accreditations and certifications',
						action: 'Get company certifications',
					},
					{
						name: 'Get Company History',
						value: 'getCompanyHistory',
						description: 'Get company history and transaction records',
						action: 'Get company history',
					},
					{
						name: 'Get Company History Paged',
						value: 'getCompanyHistoryPaged',
						description: 'Get company history with pagination',
						action: 'Get company history paged',
					},
				],
				default: 'getList',
			},

			// Contact Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['contact'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get all contact data by ID',
						action: 'Get contact',
					},
					{
						name: 'Get Aircraft Relationships',
						value: 'getAircraftRelationships',
						description: 'Get aircraft relationships for a contact',
						action: 'Get contact aircraft relationships',
					},
					{
						name: 'Get Identification',
						value: 'getIdentification',
						description: 'Get contact identification details',
						action: 'Get contact identification',
					},
					{
						name: 'Get List',
						value: 'getList',
						description: 'Get list of all contacts',
						action: 'Get contact list',
					},
					{
						name: 'Get List Paged',
						value: 'getListPaged',
						description: 'Get paginated list of contacts',
						action: 'Get contact list paged',
					},
					{
						name: 'Get Other Listings',
						value: 'getOtherListings',
						description: 'Get other company listings for a contact',
						action: 'Get contact other listings',
					},
					{
						name: 'Get Phone Numbers',
						value: 'getPhoneNumbers',
						description: 'Get phone numbers for a contact',
						action: 'Get contact phone numbers',
					},
				],
				default: 'getList',
			},

			// Market Operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['market'],
					},
				},
				options: [
					{
						name: 'Get Model Intelligence',
						value: 'getModelIntelligence',
						description: 'Get model intelligence data including specs and market metrics',
						action: 'Get model intelligence',
					},
					{
						name: 'Get Model Market Trends',
						value: 'getModelMarketTrends',
						description: 'Get model market trend data and analytics',
						action: 'Get model market trends',
					},
					{
						name: 'Get Model Operation Costs',
						value: 'getModelOperationCosts',
						description: 'Get aircraft model operation costs data',
						action: 'Get model operation costs',
					},
					{
						name: 'Get Model Performance Specs',
						value: 'getModelPerformanceSpecs',
						description: 'Get aircraft model performance specifications',
						action: 'Get model performance specs',
					},
					{
						name: 'Get Account Info',
						value: 'getAccountInfo',
						description: 'Get current user account information',
						action: 'Get account info',
					},
					{
						name: 'Get Product Codes',
						value: 'getProductCodes',
						description: 'Get available product codes for your account',
						action: 'Get product codes',
					},
					{
						name: 'Get Airframe Types',
						value: 'getAirframeTypes',
						description: 'Get list of aircraft airframe types',
						action: 'Get airframe types',
					},
					{
						name: 'Get Make Type List',
						value: 'getMakeTypeList',
						description: 'Get list of aircraft make types',
						action: 'Get make type list',
					},
					{
						name: 'Get Weight Class Types',
						value: 'getWeightClassTypes',
						description: 'Get list of aircraft weight classes',
						action: 'Get weight class types',
					},
					{
						name: 'Get Airframe JNIQ Sizes',
						value: 'getAirframeJniqSizes',
						description: 'Get aircraft JNIQ size categories',
						action: 'Get airframe JNIQ sizes',
					},
					{
						name: 'Get Aircraft Make List',
						value: 'getAircraftMakeList',
						description: 'Get list of all aircraft makes',
						action: 'Get aircraft make list',
					},
					{
						name: 'Get Aircraft Model List',
						value: 'getAircraftModelList',
						description: 'Get list of all aircraft models',
						action: 'Get aircraft model list',
					},
					{
						name: 'Get Company Business Types',
						value: 'getCompanyBusinessTypes',
						description: 'Get list of company business types',
						action: 'Get company business types',
					},
					{
						name: 'Get Aircraft Company Relationship Types',
						value: 'getAircraftCompanyRelationships',
						description: 'Get list of aircraft-company relationship types',
						action: 'Get aircraft company relationship types',
					},
					{
						name: 'Get Event Categories',
						value: 'getEventCategories',
						description: 'Get list of aircraft event categories',
						action: 'Get event categories',
					},
					{
						name: 'Get Event Types',
						value: 'getEventTypes',
						description: 'Get list of aircraft event types',
						action: 'Get event types',
					},
					{
						name: 'Get Airport List',
						value: 'getAirportList',
						description: 'Get list of airports',
						action: 'Get airport list',
					},
					{
						name: 'Get State List',
						value: 'getStateList',
						description: 'Get list of states',
						action: 'Get state list',
					},
					{
						name: 'Get Country List',
						value: 'getCountryList',
						description: 'Get list of countries',
						action: 'Get country list',
					},
					{
						name: 'Get Aircraft Lifecycle Status',
						value: 'getAircraftLifecycleStatus',
						description: 'Get list of aircraft lifecycle status types',
						action: 'Get aircraft lifecycle status',
					},
					{
						name: 'Get Aircraft History Transaction Types',
						value: 'getAircraftHistoryTransTypes',
						description: 'Get list of aircraft history transaction types',
						action: 'Get aircraft history transaction types',
					},
				],
				default: 'getModelIntelligence',
			},
		],
	};

	async supplyData(this: ISupplyDataFunctions, itemIndex: number): Promise<SupplyData> {
		const resource = this.getNodeParameter('resource', itemIndex) as string;
		const operation = this.getNodeParameter('operation', itemIndex) as string;
		const descriptionType = this.getNodeParameter('descriptionType', itemIndex) as string;
		
		// Get the description based on configuration
		let description: string;
		if (descriptionType === 'manual') {
			description = this.getNodeParameter('toolDescription', itemIndex) as string;
		} else {
			// Generate automatic description based on resource and operation
			const autoDescriptions: { [key: string]: string } = {
				// Aircraft operations
				'aircraft.get': 'Get all aircraft data by ID from JetNet',
				'aircraft.getList': 'Get list of all aircraft from JetNet database',
				'aircraft.getByRegistration': 'Get aircraft details by registration number from JetNet',
				'aircraft.getIdentification': 'Get aircraft identification data from JetNet',
				'aircraft.getStatus': 'Get aircraft status information from JetNet',
				'aircraft.getMaintenance': 'Get aircraft maintenance information from JetNet',
				'aircraft.getFlights': 'Get aircraft flight history from JetNet',
				'aircraft.getAPU': 'Get aircraft APU information from JetNet',
				'aircraft.getAvionics': 'Get aircraft avionics equipment from JetNet',
				'aircraft.getEngine': 'Get aircraft engine information from JetNet',
				'aircraft.getAirframe': 'Get aircraft airframe information from JetNet',
				'aircraft.getAdditionalEquipment': 'Get aircraft additional equipment details from JetNet',
				'aircraft.getFeatures': 'Get aircraft features and capabilities from JetNet',
				'aircraft.getInterior': 'Get aircraft interior configuration from JetNet',
				'aircraft.getExterior': 'Get aircraft exterior paint and details from JetNet',
				'aircraft.getLeases': 'Get aircraft lease information from JetNet',
				'aircraft.getCompanyRelationships': 'Get companies related to this aircraft from JetNet',
				'aircraft.getPictures': 'Get aircraft pictures and image URLs from JetNet',
				'aircraft.getBulkAircraftExport': 'Export all aircraft data in bulk from JetNet',
				'aircraft.getBulkAircraftExportPaged': 'Export aircraft data in pages from JetNet',
				'aircraft.getCondensedSnapshot': 'Get condensed aircraft market snapshot from JetNet',
				'aircraft.getCondensedOwnerOperators': 'Get condensed owner/operator information from JetNet',
				'aircraft.getCondensedOwnerOperatorsPaged': 'Get condensed owner/operator info with pagination from JetNet',
				'aircraft.getEventList': 'Get aircraft event list from JetNet',
				'aircraft.getEventListPaged': 'Get aircraft event list with pagination from JetNet',
				'aircraft.getHistoryList': 'Get aircraft history list from JetNet',
				'aircraft.getHistoryListPaged': 'Get aircraft history list with pagination from JetNet',
				'aircraft.getFlightData': 'Get comprehensive flight data from JetNet',
				'aircraft.getRelationships': 'Get all aircraft relationships from JetNet',
				// Company operations
				'company.get': 'Get all company data by ID from JetNet',
				'company.getList': 'Get list of all companies from JetNet database',
				'company.getIdentification': 'Get company identification data from JetNet',
				'company.getContacts': 'Get list of contacts associated with company from JetNet',
				'company.getPhonenumbers': 'Get company phone numbers from JetNet',
				'company.getBusinesstypes': 'Get business types/roles the company plays from JetNet',
				'company.getAircraftRelationships': 'Get aircraft relationships for this company from JetNet',
				'company.getRelatedCompanies': 'Get companies related to this company from JetNet',
				'company.getCompanyCertifications': 'Get company accreditations and certifications from JetNet',
				'company.getCompanyHistory': 'Get company history and transaction records from JetNet',
				'company.getCompanyHistoryPaged': 'Get company history with pagination from JetNet',
				// Contact operations
				'contact.get': 'Get all contact data by ID from JetNet',
				'contact.getAircraftRelationships': 'Get aircraft relationships for a contact from JetNet',
				'contact.getIdentification': 'Get contact identification details from JetNet',
				'contact.getList': 'Get list of all contacts from JetNet database',
				'contact.getListPaged': 'Get paginated list of contacts from JetNet',
				'contact.getOtherListings': 'Get other company listings for a contact from JetNet',
				'contact.getPhoneNumbers': 'Get phone numbers for a contact from JetNet',
				// Market operations
				'market.getModelIntelligence': 'Get model intelligence data including specs and market metrics from JetNet',
				'market.getModelMarketTrends': 'Get model market trend data and analytics from JetNet',
				'market.getModelOperationCosts': 'Get aircraft model operation costs data from JetNet',
				'market.getModelPerformanceSpecs': 'Get aircraft model performance specifications from JetNet',
				'market.getAccountInfo': 'Get current user account information from JetNet',
				'market.getProductCodes': 'Get available product codes for your account from JetNet',
				'market.getAirframeTypes': 'Get list of aircraft airframe types from JetNet',
				'market.getMakeTypeList': 'Get list of aircraft make types from JetNet',
				'market.getWeightClassTypes': 'Get list of aircraft weight classes from JetNet',
				'market.getAirframeJniqSizes': 'Get aircraft JNIQ size categories from JetNet',
				'market.getAircraftMakeList': 'Get list of all aircraft manufacturers from JetNet',
				'market.getAircraftModelList': 'Get list of all aircraft models from JetNet',
				'market.getCompanyBusinessTypes': 'Get list of company business types from JetNet',
				'market.getAircraftCompanyRelationships': 'Get list of aircraft-company relationship types from JetNet',
				'market.getEventCategories': 'Get list of aircraft event categories from JetNet',
				'market.getEventTypes': 'Get list of aircraft event types from JetNet',
				'market.getAirportList': 'Get list of airports from JetNet',
				'market.getStateList': 'Get list of states from JetNet',
				'market.getCountryList': 'Get list of countries from JetNet',
				'market.getAircraftLifecycleStatus': 'Get list of aircraft lifecycle status types from JetNet',
				'market.getAircraftHistoryTransTypes': 'Get list of aircraft history transaction types from JetNet',
			};
			description = autoDescriptions[`${resource}.${operation}`] || `Execute ${operation} on ${resource} resource`;
		}

		// Create the tool instance
		const executeFunctions = this as unknown as ISupplyDataFunctions;
		
		const tool = new JetNetApiTool(
			executeFunctions,
			resource,
			operation,
			description
		);

		return {
			response: tool,
		};
	}
}

// Custom Tool implementation for JetNet API
class JetNetApiTool extends Tool {
	name: string;
	description: string;

	constructor(
		private executeFunctions: ISupplyDataFunctions,
		private resource: string,
		private operation: string,
		description: string
	) {
		super();
		this.name = `jetnet_${resource}_${operation}`;
		this.description = description;
	}

	// Helper method to make API requests
	private async makeApiRequest(
		method: IHttpRequestMethods,
		endpoint: string,
		body: IDataObject,
		qs: IDataObject
	): Promise<any> {
		// Access credentials
		const credentials = await this.executeFunctions.getCredentials('jetNetApi');
		
		// Build the full URL with security token
		const baseUrl = 'https://customer.jetnetconnect.com';
		const securityToken = credentials.securityToken as string;
		const fullUrl = `${baseUrl}${endpoint}/${securityToken}`;
		
		// Prepare options for the HTTP request
		const options: any = {
			method,
			uri: fullUrl,
			json: true,
			headers: {
				'Authorization': `Bearer ${credentials.bearerToken}`,
				'Content-Type': 'application/json',
			},
		};
		
		if (method === 'GET') {
			options.qs = qs;
		} else {
			options.body = body;
		}
		
		// Make the request using the helper function
		const helpers = this.executeFunctions.helpers;
		const response = await helpers.httpRequest(options);
		
		return response;
	}

	async _call(input: string | { [key: string]: any }): Promise<string> {
		try {
			let parsedInput: any = {};
			
			// Parse input if it's a string
			if (typeof input === 'string') {
				// Try to parse as JSON first
				try {
					parsedInput = JSON.parse(input);
				} catch (e) {
					// If not JSON, treat as plain text input
					// For registration number searches, extract the registration
					if (this.operation === 'getByRegistration') {
						// Extract registration number from natural language
						const match = input.match(/\b[A-Z0-9-]+\b/);
						if (match) {
							parsedInput.registrationNumber = match[0];
						}
					}
				}
			} else {
				parsedInput = input;
			}

			let endpoint = '';
			let method: IHttpRequestMethods = 'GET';
			let body: IDataObject = {};
			let qs: IDataObject = {};

			// Build the endpoint based on resource and operation
			if (this.resource === 'aircraft') {
				switch (this.operation) {
					case 'get':
						const aircraftId = parsedInput.aircraftId || parsedInput.id || '';
						if (!aircraftId) {
							throw new Error('Aircraft ID is required for this operation');
						}
						endpoint = `/api/Aircraft/getAircraft/${aircraftId}`;
						break;
					case 'getList':
						endpoint = '/api/Aircraft/getAircraftList';
						method = 'POST';
						body = {
							aircraftid: parsedInput.aircraftId || 0,
							airframetype: parsedInput.airframeType || 'None',
							maketype: parsedInput.makeType || 'None',
							modelid: parsedInput.modelId || 0,
							make: parsedInput.make || '',
							companyid: parsedInput.companyId || 0,
							isnewaircraft: parsedInput.isNewAircraft || 'Ignore',
							allrelationships: parsedInput.allRelationships !== false,
						};
						break;
					case 'getByRegistration': {
						const regNum = parsedInput.registrationNumber || parsedInput.registration || parsedInput.reg || '';
						if (!regNum) {
							throw new Error('Registration number is required for this operation');
						}
						endpoint = `/api/Aircraft/getRegNumber/${regNum}`;
						break;
					}
					case 'getIdentification':
						endpoint = `/api/Aircraft/getIdentification/${parsedInput.aircraftId || parsedInput.id}`;
						break;
					case 'getStatus':
						endpoint = `/api/Aircraft/getStatus/${parsedInput.aircraftId || parsedInput.id}`;
						break;
					case 'getMaintenance':
						endpoint = `/api/Aircraft/getMaintenance/${parsedInput.aircraftId || parsedInput.id}`;
						break;
					case 'getFlights':
						endpoint = `/api/Aircraft/getFlights/${parsedInput.aircraftId || parsedInput.id}`;
						break;
					case 'getAPU':
						endpoint = `/api/Aircraft/getApu/${parsedInput.aircraftId || parsedInput.id}`;
						break;
					case 'getAvionics':
						endpoint = `/api/Aircraft/getAvionics/${parsedInput.aircraftId || parsedInput.id}`;
						break;
					case 'getEngine':
						endpoint = `/api/Aircraft/getEngine/${parsedInput.aircraftId || parsedInput.id}`;
						break;
					case 'getAirframe':
						endpoint = `/api/Aircraft/getAirframe/${parsedInput.aircraftId || parsedInput.id}`;
						break;
					case 'getAdditionalEquipment':
						endpoint = `/api/Aircraft/getAdditionalEquipment/${parsedInput.aircraftId || parsedInput.id}`;
						break;
					case 'getFeatures':
						endpoint = `/api/Aircraft/getFeatures/${parsedInput.aircraftId || parsedInput.id}`;
						break;
					case 'getInterior':
						endpoint = `/api/Aircraft/getInterior/${parsedInput.aircraftId || parsedInput.id}`;
						break;
					case 'getExterior':
						endpoint = `/api/Aircraft/getExterior/${parsedInput.aircraftId || parsedInput.id}`;
						break;
					case 'getLeases':
						endpoint = `/api/Aircraft/getLeases/${parsedInput.aircraftId || parsedInput.id}`;
						break;
					case 'getCompanyRelationships':
						endpoint = `/api/Aircraft/getCompanyrelationships/${parsedInput.aircraftId || parsedInput.id}`;
						break;
					case 'getPictures':
						endpoint = `/api/Aircraft/getPictures/${parsedInput.aircraftId || parsedInput.id}`;
						break;
					case 'getBulkAircraftExport':
						endpoint = '/api/Aircraft/getBulkAircraftExport';
						method = 'POST';
						body = parsedInput;
						break;
					case 'getBulkAircraftExportPaged':
						endpoint = `/api/Aircraft/getBulkAircraftExportPaged/${parsedInput.pageSize || 100}/${parsedInput.page || 1}`;
						method = 'POST';
						body = parsedInput;
						break;
					case 'getCondensedSnapshot':
						endpoint = '/api/Aircraft/getCondensedSnapshot';
						method = 'POST';
						body = parsedInput;
						break;
					case 'getCondensedOwnerOperators':
						endpoint = '/api/Aircraft/getCondensedOwnerOperators';
						method = 'POST';
						body = parsedInput;
						break;
					case 'getCondensedOwnerOperatorsPaged':
						endpoint = `/api/Aircraft/getCondensedOwnerOperatorsPaged/${parsedInput.pageSize || 100}/${parsedInput.page || 1}`;
						method = 'POST';
						body = parsedInput;
						break;
					case 'getEventList':
						endpoint = '/api/Aircraft/getEventList';
						method = 'POST';
						body = parsedInput;
						break;
					case 'getEventListPaged':
						endpoint = `/api/Aircraft/getEventListPaged/${parsedInput.pageSize || 100}/${parsedInput.page || 1}`;
						method = 'POST';
						body = parsedInput;
						break;
					case 'getHistoryList':
						endpoint = '/api/Aircraft/getHistoryList';
						method = 'POST';
						body = parsedInput;
						break;
					case 'getHistoryListPaged':
						endpoint = `/api/Aircraft/getHistoryListPaged/${parsedInput.pageSize || 100}/${parsedInput.page || 1}`;
						method = 'POST';
						body = parsedInput;
						break;
					case 'getFlightData':
						endpoint = '/api/Aircraft/getFlightData';
						method = 'POST';
						body = parsedInput;
						break;
					case 'getRelationships':
						endpoint = '/api/Aircraft/getRelationships';
						method = 'POST';
						body = parsedInput;
						break;
					default:
						throw new Error(`Unknown aircraft operation: ${this.operation}`);
				}
			} else if (this.resource === 'company') {
				switch (this.operation) {
					case 'get':
						const companyId = parsedInput.companyId || parsedInput.id || '';
						if (!companyId) {
							throw new Error('Company ID is required for this operation');
						}
						endpoint = `/api/Company/getCompany/${companyId}`;
						break;
					case 'getList':
						endpoint = '/api/Company/getCompanyList';
						method = 'POST';
						body = {
							companyid: parsedInput.companyId || 0,
							companyname: parsedInput.companyName || '',
							parentid: parsedInput.parentId || 0,
							companytype: parsedInput.companyType || '',
							businesstype: parsedInput.businessType || '',
						};
						break;
					case 'getIdentification':
						endpoint = `/api/Company/getIdentification/${parsedInput.companyId || parsedInput.id}`;
						break;
					case 'getContacts':
						endpoint = `/api/Company/getContacts/${parsedInput.companyId || parsedInput.id}`;
						break;
					case 'getPhonenumbers':
						endpoint = `/api/Company/getPhonenumbers/${parsedInput.companyId || parsedInput.id}`;
						break;
					case 'getBusinesstypes':
						endpoint = `/api/Company/getBusinesstypes/${parsedInput.companyId || parsedInput.id}`;
						break;
					case 'getAircraftRelationships':
						endpoint = `/api/Company/getAircraftrelationships/${parsedInput.companyId || parsedInput.id}`;
						break;
					case 'getRelatedCompanies':
						endpoint = `/api/Company/getRelatedcompanies/${parsedInput.companyId || parsedInput.id}`;
						break;
					case 'getCompanyCertifications':
						endpoint = `/api/Company/getCompanyCertifications/${parsedInput.companyId || parsedInput.id}`;
						break;
					case 'getCompanyHistory':
						endpoint = '/api/Company/getCompanyHistory';
						method = 'POST';
						body = parsedInput;
						break;
					case 'getCompanyHistoryPaged':
						endpoint = `/api/Company/getCompanyHistoryPaged/${parsedInput.pageSize || 100}/${parsedInput.page || 1}`;
						method = 'POST';
						body = parsedInput;
						break;
					default:
						throw new Error(`Unknown company operation: ${this.operation}`);
				}
			} else if (this.resource === 'contact') {
				switch (this.operation) {
					case 'get':
						const contactId = parsedInput.contactId || parsedInput.id || '';
						if (!contactId) {
							throw new Error('Contact ID is required for this operation');
						}
						endpoint = `/api/Contact/getContact/${contactId}`;
						break;
					case 'getAircraftRelationships':
						endpoint = `/api/Contact/getContAircraftRelationships/${parsedInput.contactId || parsedInput.id}`;
						break;
					case 'getIdentification':
						endpoint = `/api/Contact/getIdentification/${parsedInput.contactId || parsedInput.id}`;
						break;
					case 'getList':
						endpoint = '/api/Contact/getContactList';
						method = 'POST';
						body = {
							aircraftid: parsedInput.aircraftId || [],
							companyid: parsedInput.companyId || 0,
							companyname: parsedInput.companyName || '',
							firstname: parsedInput.firstName || '',
							lastname: parsedInput.lastName || '',
							title: parsedInput.title || '',
							email: parsedInput.email || '',
							actiondate: parsedInput.actionDate || '',
							phonenumber: parsedInput.phoneNumber || '',
							contactchanges: parsedInput.contactChanges || false,
							contlist: parsedInput.contactList || [],
							complist: parsedInput.companyList || [],
						};
						break;
					case 'getListPaged':
						endpoint = `/api/Contact/getContactListPaged/${parsedInput.pageSize || 100}/${parsedInput.page || 1}`;
						method = 'POST';
						body = {
							aircraftid: parsedInput.aircraftId || [],
							companyid: parsedInput.companyId || 0,
							companyname: parsedInput.companyName || '',
							firstname: parsedInput.firstName || '',
							lastname: parsedInput.lastName || '',
							title: parsedInput.title || '',
							email: parsedInput.email || '',
							actiondate: parsedInput.actionDate || '',
							phonenumber: parsedInput.phoneNumber || '',
							contactchanges: parsedInput.contactChanges || false,
							contlist: parsedInput.contactList || [],
							complist: parsedInput.companyList || [],
						};
						break;
					case 'getOtherListings':
						endpoint = `/api/Contact/getOtherlistings/${parsedInput.contactId || parsedInput.id}`;
						break;
					case 'getPhoneNumbers':
						endpoint = `/api/Contact/getPhonenumbers/${parsedInput.contactId || parsedInput.id}`;
						break;
					default:
						throw new Error(`Unknown contact operation: ${this.operation}`);
				}
			} else if (this.resource === 'market') {
				switch (this.operation) {
					case 'getModelIntelligence':
						endpoint = '/api/Model/getModelIntelligence';
						method = 'POST';
						body = parsedInput;
						break;
					case 'getModelMarketTrends':
						endpoint = '/api/Model/getModelMarketTrends';
						method = 'POST';
						body = parsedInput;
						break;
					case 'getModelOperationCosts':
						endpoint = '/api/Model/getModelOperationCosts';
						method = 'POST';
						body = parsedInput;
						break;
					case 'getModelPerformanceSpecs':
						endpoint = '/api/Model/getModelPerformanceSpecs';
						method = 'POST';
						body = parsedInput;
						break;
					case 'getAccountInfo':
						endpoint = '/api/Utility/getAccountInfo';
						break;
					case 'getProductCodes':
						endpoint = '/api/Utility/getProductCodes';
						break;
					case 'getAirframeTypes':
						endpoint = '/api/Utility/getAirframeTypes';
						break;
					case 'getMakeTypeList':
						endpoint = '/api/Utility/getMakeTypeList';
						break;
					case 'getWeightClassTypes':
						endpoint = '/api/Utility/getWeightClassTypes';
						break;
					case 'getAirframeJniqSizes':
						endpoint = '/api/Utility/getAirframeJniqSizes';
						break;
					case 'getAircraftMakeList':
						endpoint = '/api/Utility/getAircraftMakeList';
						break;
					case 'getAircraftModelList':
						endpoint = '/api/Utility/getAircraftModelList';
						break;
					case 'getCompanyBusinessTypes':
						endpoint = '/api/Utility/getCompanyBusinessTypes';
						break;
					case 'getAircraftCompanyRelationships':
						endpoint = '/api/Utility/getAircraftCompanyRelationships';
						break;
					case 'getEventCategories':
						endpoint = '/api/Utility/getEventCategories';
						break;
					case 'getEventTypes':
						endpoint = '/api/Utility/getEventTypes';
						break;
					case 'getAirportList':
						endpoint = '/api/Utility/getAirportList';
						break;
					case 'getStateList':
						endpoint = '/api/Utility/getStateList';
						break;
					case 'getCountryList':
						endpoint = '/api/Utility/getCountryList';
						break;
					case 'getAircraftLifecycleStatus':
						endpoint = '/api/Utility/getAircraftLifecycleStatus';
						break;
					case 'getAircraftHistoryTransTypes':
						endpoint = '/api/Utility/getAircraftHistoryTransTypes';
						break;
					default:
						throw new Error(`Unknown market operation: ${this.operation}`);
				}
			} else {
				throw new Error(`Unknown resource: ${this.resource}`);
			}

			// Make the API request using the executor functions
			// We need to create a wrapper that adapts ISupplyDataFunctions to IExecuteFunctions
			const responseData = await this.makeApiRequest(
				method,
				endpoint,
				body,
				qs
			);

			// Return the response as a formatted string
			return JSON.stringify({
				success: true,
				resource: this.resource,
				operation: this.operation,
				data: responseData,
				timestamp: new Date().toISOString(),
			}, null, 2);

		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
			return JSON.stringify({
				success: false,
				error: errorMessage,
				resource: this.resource,
				operation: this.operation,
				timestamp: new Date().toISOString(),
			}, null, 2);
		}
	}
}