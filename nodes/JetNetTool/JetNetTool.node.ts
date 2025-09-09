import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
	IDataObject,
	IHttpRequestMethods,
} from 'n8n-workflow';

import { jetNetApiRequest, jetNetApiRequestAllItems, formatJetNetResponse } from '../JetNet/JetNetApiRequest';

function generateAutoDescription(resource: string, operation: string): string {
	const descriptions: { [key: string]: string } = {
		// Aircraft Operations (31)
		'aircraft.get': 'Get all aircraft data by ID',
		'aircraft.getList': 'Get list of all aircraft with filtering options',
		'aircraft.getByRegistration': 'Get aircraft by registration number',
		'aircraft.getIdentification': 'Get aircraft identification data',
		'aircraft.getStatus': 'Get aircraft status information',
		'aircraft.getMaintenance': 'Get aircraft maintenance information',
		'aircraft.getFlights': 'Get aircraft flight history',
		'aircraft.getAPU': 'Get aircraft APU (Auxiliary Power Unit) information',
		'aircraft.getAvionics': 'Get aircraft avionics equipment',
		'aircraft.getEngine': 'Get aircraft engine information',
		'aircraft.getAirframe': 'Get aircraft airframe information',
		'aircraft.getAdditionalEquipment': 'Get aircraft additional equipment details',
		'aircraft.getFeatures': 'Get aircraft features and capabilities',
		'aircraft.getInterior': 'Get aircraft interior configuration and details',
		'aircraft.getExterior': 'Get aircraft exterior paint and details',
		'aircraft.getLeases': 'Get aircraft lease information',
		'aircraft.getCompanyRelationships': 'Get companies related to this aircraft (owners, operators, brokers)',
		'aircraft.getPictures': 'Get aircraft pictures and image URLs',
		'aircraft.getBulkAircraftExport': 'Export all aircraft data in bulk',
		'aircraft.getBulkAircraftExportPaged': 'Export aircraft data in pages',
		'aircraft.getCondensedSnapshot': 'Get condensed aircraft market snapshot',
		'aircraft.getCondensedOwnerOperators': 'Get condensed owner/operator information',
		'aircraft.getCondensedOwnerOperatorsPaged': 'Get condensed owner/operator information with pagination',
		'aircraft.getEventList': 'Get aircraft event list',
		'aircraft.getEventListPaged': 'Get aircraft event list with pagination',
		'aircraft.getHistoryList': 'Get aircraft history list',
		'aircraft.getHistoryListPaged': 'Get aircraft history list with pagination',
		'aircraft.getFlightData': 'Get comprehensive flight data',
		'aircraft.getRelationships': 'Get all aircraft relationships',
		
		// Company Operations (11)
		'company.get': 'Get all company data by ID',
		'company.getList': 'Get list of all companies',
		'company.getIdentification': 'Get company identification data',
		'company.getContacts': 'Get list of contacts associated with company',
		'company.getPhonenumbers': 'Get company phone numbers',
		'company.getBusinesstypes': 'Get business types/roles the company plays',
		'company.getAircraftRelationships': 'Get aircraft relationships for this company',
		'company.getRelatedCompanies': 'Get companies related to this company',
		'company.getCompanyCertifications': 'Get company accreditations, memberships and certifications',
		'company.getCompanyHistory': 'Get company history and transaction records',
		'company.getCompanyHistoryPaged': 'Get company history with pagination',
		
		// Contact Operations (9)
		'contact.get': 'Get all contact data by ID',
		'contact.getAircraftRelationships': 'Get aircraft relationships for a contact',
		'contact.getIdentification': 'Get contact identification details',
		'contact.getList': 'Get list of all contacts',
		'contact.getListPaged': 'Get paginated list of contacts',
		'contact.getOtherListings': 'Get other company listings for a contact',
		'contact.getPhoneNumbers': 'Get phone numbers for a contact',
		
		// Market Operations (19)
		'market.getModelIntelligence': 'Get model intelligence data including specs and market metrics',
		'market.getModelMarketTrends': 'Get model market trend data and analytics',
		'market.getModelOperationCosts': 'Get aircraft model operation costs data',
		'market.getModelPerformanceSpecs': 'Get aircraft model performance specifications',
		'market.getAccountInfo': 'Get current user account information',
		'market.getProductCodes': 'Get available product codes for your account',
		'market.getAirframeTypes': 'Get list of aircraft airframe types',
		'market.getMakeTypeList': 'Get list of aircraft make types',
		'market.getWeightClassTypes': 'Get list of aircraft weight classes',
		'market.getAirframeJniqSizes': 'Get aircraft JNIQ size categories',
		'market.getAircraftMakeList': 'Get list of all aircraft makes',
		'market.getAircraftModelList': 'Get list of all aircraft models',
		'market.getCompanyBusinessTypes': 'Get list of company business types',
		'market.getAircraftCompanyRelationships': 'Get list of aircraft-company relationship types',
		'market.getEventCategories': 'Get list of aircraft event categories',
		'market.getEventTypes': 'Get list of aircraft event types',
		'market.getAirportList': 'Get list of airports',
		'market.getStateList': 'Get list of states',
		'market.getCountryList': 'Get list of countries',
		'market.getAircraftLifecycleStatus': 'Get list of aircraft lifecycle status types',
		'market.getAircraftHistoryTransTypes': 'Get list of aircraft history transaction types',
	};

	return descriptions[`${resource}.${operation}`] || `Execute ${operation} on ${resource} resource`;
}

export class JetNetTool implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'JetNet Tool',
		name: 'jetNetTool',
		icon: 'file:../JetNet/JetNet.svg',
		group: ['output'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Access JetNet aviation data for AI Agents',
		defaults: {
			name: 'JetNet Tool',
		},
		inputs: [],
		outputs: ['ai_tool'],
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

			// Aircraft Operations (31 total)
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
						description: 'Get condensed owner/operator information with pagination',
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

			// Company Operations (11 total)
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
						description: 'Get company accreditations, memberships and certifications',
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

			// Contact Operations (7 total)
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

			// Market Operations (19 total)
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
						name: 'Get Aircraft Company Relationships',
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

			// Dynamic parameters based on operation
			// Aircraft ID parameter
			{
				displayName: 'Aircraft ID',
				name: 'aircraftId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['aircraft'],
						operation: [
							'get',
							'getIdentification',
							'getStatus',
							'getMaintenance',
							'getFlights',
							'getAPU',
							'getAvionics',
							'getEngine',
							'getAirframe',
							'getAdditionalEquipment',
							'getFeatures',
							'getInterior',
							'getExterior',
							'getLeases',
							'getCompanyRelationships',
							'getPictures',
						],
					},
				},
				default: '',
				description: 'The unique ID of the aircraft',
			},

			// Registration Number parameter
			{
				displayName: 'Registration Number',
				name: 'registrationNumber',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['aircraft'],
						operation: ['getByRegistration'],
					},
				},
				default: '',
				description: 'The registration number of the aircraft',
			},

			// Company ID parameter
			{
				displayName: 'Company ID',
				name: 'companyId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['company'],
						operation: [
							'get',
							'getIdentification',
							'getContacts',
							'getPhonenumbers',
							'getBusinesstypes',
							'getAircraftRelationships',
							'getRelatedCompanies',
							'getCompanyCertifications',
						],
					},
				},
				default: '',
				description: 'The unique ID of the company',
			},

			// Contact ID parameter
			{
				displayName: 'Contact ID',
				name: 'contactId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['contact'],
						operation: [
							'get',
							'getAircraftRelationships',
							'getIdentification',
							'getOtherListings',
							'getPhoneNumbers',
						],
					},
				},
				default: '',
				description: 'The unique ID of the contact',
			},

			// Pagination parameters for paged operations
			{
				displayName: 'Page Size',
				name: 'pageSize',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						resource: ['aircraft'],
						operation: [
							'getBulkAircraftExportPaged',
							'getCondensedOwnerOperatorsPaged',
							'getEventListPaged',
							'getHistoryListPaged',
						],
					},
				},
				typeOptions: {
					minValue: 1,
					maxValue: 1000,
				},
				default: 100,
				description: 'Number of results per page',
			},
			{
				displayName: 'Page Size',
				name: 'pageSize',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						resource: ['company'],
						operation: ['getCompanyHistoryPaged'],
					},
				},
				typeOptions: {
					minValue: 1,
					maxValue: 1000,
				},
				default: 100,
				description: 'Number of results per page',
			},
			{
				displayName: 'Page Size',
				name: 'pageSize',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						resource: ['contact'],
						operation: ['getListPaged'],
					},
				},
				typeOptions: {
					minValue: 0,
					maxValue: 1000,
				},
				default: 100,
				description: 'Number of results per page (0 for all results)',
			},
			{
				displayName: 'Page',
				name: 'page',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						resource: ['aircraft'],
						operation: [
							'getBulkAircraftExportPaged',
							'getCondensedOwnerOperatorsPaged',
							'getEventListPaged',
							'getHistoryListPaged',
						],
					},
				},
				typeOptions: {
					minValue: 1,
				},
				default: 1,
				description: 'Page number to retrieve',
			},
			{
				displayName: 'Page',
				name: 'page',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						resource: ['company'],
						operation: ['getCompanyHistoryPaged'],
					},
				},
				typeOptions: {
					minValue: 1,
				},
				default: 1,
				description: 'Page number to retrieve',
			},
			{
				displayName: 'Page',
				name: 'page',
				type: 'number',
				required: true,
				displayOptions: {
					show: {
						resource: ['contact'],
						operation: ['getListPaged'],
					},
				},
				typeOptions: {
					minValue: 0,
				},
				default: 1,
				description: 'Page number to retrieve (0 for all results)',
			},

			// Pagination support for list operations
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['aircraft', 'company', 'contact'],
						operation: ['getList'],
					},
				},
				default: false,
				description: 'Whether to return all results or only up to a given limit',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['aircraft', 'company', 'contact'],
						operation: ['getList'],
						returnAll: [false],
					},
				},
				typeOptions: {
					minValue: 1,
					maxValue: 1000,
				},
				default: 100,
				description: 'Max number of results to return',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				let endpoint = '';
				let method: IHttpRequestMethods = 'GET';
				let body: IDataObject = {};
				let qs: IDataObject = {};

				// Build the endpoint based on resource and operation
				if (resource === 'aircraft') {
					switch (operation) {
						case 'get':
							endpoint = `/api/Aircraft/getAircraft/${this.getNodeParameter('aircraftId', itemIndex)}`;
							break;
						case 'getList':
							endpoint = '/api/Aircraft/getAircraftList';
							method = 'POST';
							body = {
								aircraftid: 0,
								airframetype: 'None',
								maketype: 'None',
								modelid: 0,
								make: '',
								companyid: 0,
								isnewaircraft: 'Ignore',
								allrelationships: true,
							};
							break;
						case 'getByRegistration':
							endpoint = `/api/Aircraft/getRegNumber/${this.getNodeParameter('registrationNumber', itemIndex)}`;
							break;
						case 'getIdentification':
							endpoint = `/api/Aircraft/getIdentification/${this.getNodeParameter('aircraftId', itemIndex)}`;
							break;
						case 'getStatus':
							endpoint = `/api/Aircraft/getStatus/${this.getNodeParameter('aircraftId', itemIndex)}`;
							break;
						case 'getMaintenance':
							endpoint = `/api/Aircraft/getMaintenance/${this.getNodeParameter('aircraftId', itemIndex)}`;
							break;
						case 'getFlights':
							endpoint = `/api/Aircraft/getFlights/${this.getNodeParameter('aircraftId', itemIndex)}`;
							break;
						case 'getAPU':
							endpoint = `/api/Aircraft/getApu/${this.getNodeParameter('aircraftId', itemIndex)}`;
							break;
						case 'getAvionics':
							endpoint = `/api/Aircraft/getAvionics/${this.getNodeParameter('aircraftId', itemIndex)}`;
							break;
						case 'getEngine':
							endpoint = `/api/Aircraft/getEngine/${this.getNodeParameter('aircraftId', itemIndex)}`;
							break;
						case 'getAirframe':
							endpoint = `/api/Aircraft/getAirframe/${this.getNodeParameter('aircraftId', itemIndex)}`;
							break;
						case 'getAdditionalEquipment':
							endpoint = `/api/Aircraft/getAdditionalEquipment/${this.getNodeParameter('aircraftId', itemIndex)}`;
							break;
						case 'getFeatures':
							endpoint = `/api/Aircraft/getFeatures/${this.getNodeParameter('aircraftId', itemIndex)}`;
							break;
						case 'getInterior':
							endpoint = `/api/Aircraft/getInterior/${this.getNodeParameter('aircraftId', itemIndex)}`;
							break;
						case 'getExterior':
							endpoint = `/api/Aircraft/getExterior/${this.getNodeParameter('aircraftId', itemIndex)}`;
							break;
						case 'getLeases':
							endpoint = `/api/Aircraft/getLeases/${this.getNodeParameter('aircraftId', itemIndex)}`;
							break;
						case 'getCompanyRelationships':
							endpoint = `/api/Aircraft/getCompanyrelationships/${this.getNodeParameter('aircraftId', itemIndex)}`;
							break;
						case 'getPictures':
							endpoint = `/api/Aircraft/getPictures/${this.getNodeParameter('aircraftId', itemIndex)}`;
							break;
						case 'getBulkAircraftExport':
							endpoint = '/api/Aircraft/getBulkAircraftExport';
							method = 'POST';
							body = {
								aircraftid: 0,
								airframetype: 'None',
								maketype: 'None',
								modelid: 0,
								make: '',
								companyid: 0,
								isnewaircraft: 'Ignore',
								allrelationships: true,
							};
							break;
						case 'getBulkAircraftExportPaged':
							endpoint = `/api/Aircraft/getBulkAircraftExportPaged/${this.getNodeParameter('pageSize', itemIndex)}/${this.getNodeParameter('page', itemIndex)}`;
							method = 'POST';
							body = {
								aircraftid: 0,
								airframetype: 'None',
								maketype: 'None',
								modelid: 0,
								make: '',
								companyid: 0,
								isnewaircraft: 'Ignore',
								allrelationships: true,
							};
							break;
						case 'getCondensedSnapshot':
							endpoint = '/api/Aircraft/getCondensedSnapshot';
							method = 'POST';
							body = {
								aircraftid: 0,
								airframetype: 'None',
								maketype: 'None',
								modelid: 0,
								make: '',
								companyid: 0,
								isnewaircraft: 'Ignore',
								allrelationships: true,
							};
							break;
						case 'getCondensedOwnerOperators':
							endpoint = '/api/Aircraft/getCondensedOwnerOperators';
							method = 'POST';
							body = {
								aircraftid: 0,
								airframetype: 'None',
								maketype: 'None',
								modelid: 0,
								make: '',
								companyid: 0,
								isnewaircraft: 'Ignore',
								allrelationships: true,
							};
							break;
						case 'getCondensedOwnerOperatorsPaged':
							endpoint = `/api/Aircraft/getCondensedOwnerOperatorsPaged/${this.getNodeParameter('pageSize', itemIndex)}/${this.getNodeParameter('page', itemIndex)}`;
							method = 'POST';
							body = {
								aircraftid: 0,
								airframetype: 'None',
								maketype: 'None',
								modelid: 0,
								make: '',
								companyid: 0,
								isnewaircraft: 'Ignore',
								allrelationships: true,
							};
							break;
						case 'getEventList':
							endpoint = '/api/Aircraft/getEventList';
							method = 'POST';
							body = {
								aircraftid: 0,
								airframetype: 'None',
								maketype: 'None',
								modelid: 0,
								make: '',
								companyid: 0,
								isnewaircraft: 'Ignore',
								allrelationships: true,
							};
							break;
						case 'getEventListPaged':
							endpoint = `/api/Aircraft/getEventListPaged/${this.getNodeParameter('pageSize', itemIndex)}/${this.getNodeParameter('page', itemIndex)}`;
							method = 'POST';
							body = {
								aircraftid: 0,
								airframetype: 'None',
								maketype: 'None',
								modelid: 0,
								make: '',
								companyid: 0,
								isnewaircraft: 'Ignore',
								allrelationships: true,
							};
							break;
						case 'getHistoryList':
							endpoint = '/api/Aircraft/getHistoryList';
							method = 'POST';
							body = {
								aircraftid: 0,
								airframetype: 'None',
								maketype: 'None',
								modelid: 0,
								make: '',
								companyid: 0,
								isnewaircraft: 'Ignore',
								allrelationships: true,
							};
							break;
						case 'getHistoryListPaged':
							endpoint = `/api/Aircraft/getHistoryListPaged/${this.getNodeParameter('pageSize', itemIndex)}/${this.getNodeParameter('page', itemIndex)}`;
							method = 'POST';
							body = {
								aircraftid: 0,
								airframetype: 'None',
								maketype: 'None',
								modelid: 0,
								make: '',
								companyid: 0,
								isnewaircraft: 'Ignore',
								allrelationships: true,
							};
							break;
						case 'getFlightData':
							endpoint = '/api/Aircraft/getFlightData';
							method = 'POST';
							body = {
								aircraftid: 0,
								airframetype: 'None',
								maketype: 'None',
								modelid: 0,
								make: '',
								companyid: 0,
								isnewaircraft: 'Ignore',
								allrelationships: true,
							};
							break;
						case 'getRelationships':
							endpoint = '/api/Aircraft/getRelationships';
							method = 'POST';
							body = {
								aircraftid: 0,
								airframetype: 'None',
								maketype: 'None',
								modelid: 0,
								make: '',
								companyid: 0,
								isnewaircraft: 'Ignore',
								allrelationships: true,
							};
							break;
					}
				} else if (resource === 'company') {
					switch (operation) {
						case 'get':
							endpoint = `/api/Company/getCompany/${this.getNodeParameter('companyId', itemIndex)}`;
							break;
						case 'getList':
							endpoint = '/api/Company/getCompanyList';
							method = 'POST';
							body = {
								companyid: 0,
								companyname: '',
								parentid: 0,
								companytype: '',
								businesstype: '',
							};
							break;
						case 'getIdentification':
							endpoint = `/api/Company/getIdentification/${this.getNodeParameter('companyId', itemIndex)}`;
							break;
						case 'getContacts':
							endpoint = `/api/Company/getContacts/${this.getNodeParameter('companyId', itemIndex)}`;
							break;
						case 'getPhonenumbers':
							endpoint = `/api/Company/getPhonenumbers/${this.getNodeParameter('companyId', itemIndex)}`;
							break;
						case 'getBusinesstypes':
							endpoint = `/api/Company/getBusinesstypes/${this.getNodeParameter('companyId', itemIndex)}`;
							break;
						case 'getAircraftRelationships':
							endpoint = `/api/Company/getAircraftrelationships/${this.getNodeParameter('companyId', itemIndex)}`;
							break;
						case 'getRelatedCompanies':
							endpoint = `/api/Company/getRelatedcompanies/${this.getNodeParameter('companyId', itemIndex)}`;
							break;
						case 'getCompanyCertifications':
							endpoint = `/api/Company/getCompanyCertifications/${this.getNodeParameter('companyId', itemIndex)}`;
							break;
						case 'getCompanyHistory':
							endpoint = '/api/Company/getCompanyHistory';
							method = 'POST';
							body = {
								companyid: 0,
								complist: [],
								aircraftid: 0,
								aclist: [],
								transtype: [],
								relationship: [],
								startdate: '',
								enddate: '',
								lastactionstartdate: '',
								lastactionenddate: '',
								isinternaltrans: 'Ignore',
								isoperator: 'Ignore',
							};
							break;
						case 'getCompanyHistoryPaged':
							endpoint = `/api/Company/getCompanyHistoryPaged/${this.getNodeParameter('pageSize', itemIndex)}/${this.getNodeParameter('page', itemIndex)}`;
							method = 'POST';
							body = {
								companyid: 0,
								complist: [],
								aircraftid: 0,
								aclist: [],
								transtype: [],
								relationship: [],
								startdate: '',
								enddate: '',
								lastactionstartdate: '',
								lastactionenddate: '',
								isinternaltrans: 'Ignore',
								isoperator: 'Ignore',
							};
							break;
					}
				} else if (resource === 'contact') {
					switch (operation) {
						case 'get':
							endpoint = `/api/Contact/getContact/${this.getNodeParameter('contactId', itemIndex)}`;
							break;
						case 'getAircraftRelationships':
							endpoint = `/api/Contact/getContAircraftRelationships/${this.getNodeParameter('contactId', itemIndex)}`;
							break;
						case 'getIdentification':
							endpoint = `/api/Contact/getIdentification/${this.getNodeParameter('contactId', itemIndex)}`;
							break;
						case 'getList':
							endpoint = '/api/Contact/getContactList';
							method = 'POST';
							body = {
								aircraftid: [],
								companyid: 0,
								companyname: '',
								firstname: '',
								lastname: '',
								title: '',
								email: '',
								actiondate: '',
								phonenumber: '',
								contactchanges: false,
								contlist: [],
								complist: [],
							};
							break;
						case 'getListPaged':
							endpoint = `/api/Contact/getContactListPaged/${this.getNodeParameter('pageSize', itemIndex)}/${this.getNodeParameter('page', itemIndex)}`;
							method = 'POST';
							body = {
								aircraftid: [],
								companyid: 0,
								companyname: '',
								firstname: '',
								lastname: '',
								title: '',
								email: '',
								actiondate: '',
								phonenumber: '',
								contactchanges: false,
								contlist: [],
								complist: [],
							};
							break;
						case 'getOtherListings':
							endpoint = `/api/Contact/getOtherlistings/${this.getNodeParameter('contactId', itemIndex)}`;
							break;
						case 'getPhoneNumbers':
							endpoint = `/api/Contact/getPhonenumbers/${this.getNodeParameter('contactId', itemIndex)}`;
							break;
					}
				} else if (resource === 'market') {
					// All market/utility operations
					switch (operation) {
						case 'getModelIntelligence':
							endpoint = '/api/Model/getModelIntelligence';
							method = 'POST';
							body = {};
							break;
						case 'getModelMarketTrends':
							endpoint = '/api/Model/getModelMarketTrends';
							method = 'POST';
							body = {};
							break;
						case 'getModelOperationCosts':
							endpoint = '/api/Model/getModelOperationCosts';
							method = 'POST';
							body = {};
							break;
						case 'getModelPerformanceSpecs':
							endpoint = '/api/Model/getModelPerformanceSpecs';
							method = 'POST';
							body = {};
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
					}
				}

				// Make the API request
				const responseData = await jetNetApiRequest.call(this, method, endpoint, body, qs);

				// Format response for AI Agent
				const toolResponse = {
					json: {
						description: generateAutoDescription(resource, operation),
						data: responseData,
						metadata: {
							resource,
							operation,
							timestamp: new Date().toISOString(),
						},
					},
				};

				returnData.push(toolResponse);

			} catch (error) {
				if (this.continueOnFail()) {
					const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
					returnData.push({ 
						json: { 
							error: errorMessage,
							resource,
							operation,
						}, 
						pairedItem: itemIndex 
					});
					continue;
				}
				throw new NodeOperationError(this.getNode(), error as Error, { itemIndex });
			}
		}

		return [returnData];
	}
}