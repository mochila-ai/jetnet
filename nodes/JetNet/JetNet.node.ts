import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
	IDataObject,
	IHttpRequestMethods,
	IHttpRequestOptions,
	ICredentialsDecrypted,
	ICredentialDataDecryptedObject,
} from 'n8n-workflow';

import { jetNetApiRequest, jetNetApiRequestAllItems, formatJetNetResponse } from './JetNetApiRequest';

export class JetNet implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'JetNet',
		name: 'jetNet',
		icon: 'file:JetNet.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with JetNet API for aviation industry data',
		defaults: {
			name: 'JetNet',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'jetNetApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://customer.jetnetconnect.com',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
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
						description: 'Manage aircraft data including identification, status, maintenance, and flights',
					},
					{
						name: 'Company',
						value: 'company',
						description: 'Manage company information, certifications, and history',
					},
					{
						name: 'Contact',
						value: 'contact',
						description: 'Manage contact information and relationships',
					},
					{
						name: 'Market',
						value: 'market',
						description: 'Access market intelligence and valuation data',
					},
				],
				default: 'aircraft',
				description: 'The resource to operate on',
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
						routing: {
							request: {
								method: 'GET',
								url: '=/api/Aircraft/getAircraft/{{$parameter.aircraftId}}/{{$credentials.apiToken}}',
							},
						},
					},
					{
						name: 'Get List',
						value: 'getList',
						description: 'Get list of all aircraft',
						action: 'Get aircraft list',
						routing: {
							request: {
								method: 'POST',
								url: '=/api/Aircraft/getAircraftList/{{$credentials.apiToken}}',
								body: '={{Object.assign({aircraftid: 0, airframetype: "None", maketype: "None", modelid: 0, make: "", companyid: 0, isnewaircraft: "Ignore", allrelationships: true}, $parameter.additionalFields || {})}}',
							},
						},
					},
					{
						name: 'Get by Registration',
						value: 'getByRegistration',
						description: 'Get aircraft by registration number',
						action: 'Get aircraft by registration',
						routing: {
							request: {
								method: 'GET',
								url: '=/api/Aircraft/getRegNumber/{{$parameter.registrationNumber}}/{{$credentials.apiToken}}',
							},
						},
					},
					{
						name: 'Get Identification',
						value: 'getIdentification',
						description: 'Get aircraft identification data',
						action: 'Get aircraft identification',
						routing: {
							request: {
								method: 'GET',
								url: '=/api/Aircraft/getIdentification/{{$parameter.aircraftId}}/{{$credentials.apiToken}}',
							},
						},
					},
					{
						name: 'Get Status',
						value: 'getStatus',
						description: 'Get aircraft status information',
						action: 'Get aircraft status',
						routing: {
							request: {
								method: 'GET',
								url: '=/api/Aircraft/getStatus/{{$parameter.aircraftId}}/{{$credentials.apiToken}}',
							},
						},
					},
					{
						name: 'Get Maintenance',
						value: 'getMaintenance',
						description: 'Get aircraft maintenance information',
						action: 'Get aircraft maintenance',
						routing: {
							request: {
								method: 'GET',
								url: '=/api/Aircraft/getMaintenance/{{$parameter.aircraftId}}/{{$credentials.apiToken}}',
							},
						},
					},
					{
						name: 'Get Flights',
						value: 'getFlights',
						description: 'Get aircraft flight history',
						action: 'Get aircraft flights',
						routing: {
							request: {
								method: 'GET',
								url: '=/api/Aircraft/getFlights/{{$parameter.aircraftId}}/{{$credentials.apiToken}}',
							},
						},
					},
					// Aircraft Details
					{
						name: 'Get APU',
						value: 'getAPU',
						description: 'Get aircraft APU (Auxiliary Power Unit) information',
						action: 'Get aircraft APU',
						routing: {
							request: {
								method: 'GET',
								url: '=/api/Aircraft/getApu/{{$parameter.aircraftId}}/{{$credentials.apiToken}}',
							},
						},
					},
					{
						name: 'Get Avionics',
						value: 'getAvionics',
						description: 'Get aircraft avionics equipment',
						action: 'Get aircraft avionics',
						routing: {
							request: {
								method: 'GET',
								url: '=/api/Aircraft/getAvionics/{{$parameter.aircraftId}}/{{$credentials.apiToken}}',
							},
						},
					},
					{
						name: 'Get Engine',
						value: 'getEngine',
						description: 'Get aircraft engine information',
						action: 'Get aircraft engine',
						routing: {
							request: {
								method: 'GET',
								url: '=/api/Aircraft/getEngine/{{$parameter.aircraftId}}/{{$credentials.apiToken}}',
							},
						},
					},
					{
						name: 'Get Airframe',
						value: 'getAirframe',
						description: 'Get aircraft airframe information',
						action: 'Get aircraft airframe',
						routing: {
							request: {
								method: 'GET',
								url: '=/api/Aircraft/getAirframe/{{$parameter.aircraftId}}/{{$credentials.apiToken}}',
							},
						},
					},
					{
						name: 'Get Additional Equipment',
						value: 'getAdditionalEquipment',
						description: 'Get aircraft additional equipment details',
						action: 'Get aircraft additional equipment',
						routing: {
							request: {
								method: 'GET',
								url: '=/api/Aircraft/getAdditionalEquipment/{{$parameter.aircraftId}}/{{$credentials.apiToken}}',
							},
						},
					},
					{
						name: 'Get Features',
						value: 'getFeatures',
						description: 'Get aircraft features and capabilities',
						action: 'Get aircraft features',
						routing: {
							request: {
								method: 'GET',
								url: '=/api/Aircraft/getFeatures/{{$parameter.aircraftId}}/{{$credentials.apiToken}}',
							},
						},
					},
					{
						name: 'Get Interior',
						value: 'getInterior',
						description: 'Get aircraft interior configuration and details',
						action: 'Get aircraft interior',
						routing: {
							request: {
								method: 'GET',
								url: '=/api/Aircraft/getInterior/{{$parameter.aircraftId}}/{{$credentials.apiToken}}',
							},
						},
					},
					{
						name: 'Get Exterior',
						value: 'getExterior',
						description: 'Get aircraft exterior paint and details',
						action: 'Get aircraft exterior',
						routing: {
							request: {
								method: 'GET',
								url: '=/api/Aircraft/getExterior/{{$parameter.aircraftId}}/{{$credentials.apiToken}}',
							},
						},
					},
					{
						name: 'Get Leases',
						value: 'getLeases',
						description: 'Get aircraft lease information',
						action: 'Get aircraft leases',
						routing: {
							request: {
								method: 'GET',
								url: '=/api/Aircraft/getLeases/{{$parameter.aircraftId}}/{{$credentials.apiToken}}',
							},
						},
					},
					// Business Data
					{
						name: 'Get Company Relationships',
						value: 'getCompanyRelationships',
						description: 'Get companies related to this aircraft (owners, operators, brokers)',
						action: 'Get aircraft company relationships',
						routing: {
							request: {
								method: 'GET',
								url: '=/api/Aircraft/getCompanyrelationships/{{$parameter.aircraftId}}/{{$credentials.apiToken}}',
							},
						},
					},
					{
						name: 'Get Pictures',
						value: 'getPictures',
						description: 'Get aircraft pictures and image URLs',
						action: 'Get aircraft pictures',
						routing: {
							request: {
								method: 'GET',
								url: '=/api/Aircraft/getPictures/{{$parameter.aircraftId}}/{{$credentials.apiToken}}',
							},
						},
					},
					// Bulk Export Operations
					{
						name: 'Get Bulk Aircraft Export',
						value: 'getBulkAircraftExport',
						description: 'Export all aircraft data in bulk',
						action: 'Get bulk aircraft export',
						routing: {
							request: {
								method: 'POST',
								url: '=/api/Aircraft/getBulkAircraftExport/{{$credentials.apiToken}}',
								body: '={{Object.assign({aircraftid: 0, airframetype: "None", maketype: "None", modelid: 0, make: "", companyid: 0, isnewaircraft: "Ignore", allrelationships: true}, $parameter.additionalFields || {})}}',
							},
						},
					},
					{
						name: 'Get Bulk Aircraft Export Paged',
						value: 'getBulkAircraftExportPaged',
						description: 'Export aircraft data in pages',
						action: 'Get bulk aircraft export paged',
						routing: {
							request: {
								method: 'POST',
								url: '=/api/Aircraft/getBulkAircraftExportPaged/{{$credentials.apiToken}}/{{$parameter.pageSize}}/{{$parameter.page}}',
								body: '={{Object.assign({aircraftid: 0, airframetype: "None", maketype: "None", modelid: 0, make: "", companyid: 0, isnewaircraft: "Ignore", allrelationships: true}, $parameter.additionalFields || {})}}',
							},
						},
					},
					// Condensed Data Operations
					{
						name: 'Get Condensed Snapshot',
						value: 'getCondensedSnapshot',
						description: 'Get condensed aircraft market snapshot',
						action: 'Get condensed snapshot',
						routing: {
							request: {
								method: 'POST',
								url: '=/api/Aircraft/getCondensedSnapshot/{{$credentials.apiToken}}',
								body: '={{Object.assign({aircraftid: 0, airframetype: "None", maketype: "None", modelid: 0, make: "", companyid: 0, isnewaircraft: "Ignore", allrelationships: true}, $parameter.additionalFields || {})}}',
							},
						},
					},
					{
						name: 'Get Condensed Owner Operators',
						value: 'getCondensedOwnerOperators',
						description: 'Get condensed owner/operator information',
						action: 'Get condensed owner operators',
						routing: {
							request: {
								method: 'POST',
								url: '=/api/Aircraft/getCondensedOwnerOperators/{{$credentials.apiToken}}',
								body: '={{Object.assign({aircraftid: 0, airframetype: "None", maketype: "None", modelid: 0, make: "", companyid: 0, isnewaircraft: "Ignore", allrelationships: true}, $parameter.additionalFields || {})}}',
							},
						},
					},
					{
						name: 'Get Condensed Owner Operators Paged',
						value: 'getCondensedOwnerOperatorsPaged',
						description: 'Get condensed owner/operator information with pagination',
						action: 'Get condensed owner operators paged',
						routing: {
							request: {
								method: 'POST',
								url: '=/api/Aircraft/getCondensedOwnerOperatorsPaged/{{$credentials.apiToken}}/{{$parameter.pageSize}}/{{$parameter.page}}',
								body: '={{Object.assign({aircraftid: 0, airframetype: "None", maketype: "None", modelid: 0, make: "", companyid: 0, isnewaircraft: "Ignore", allrelationships: true}, $parameter.additionalFields || {})}}',
							},
						},
					},
					// Events and History
					{
						name: 'Get Event List',
						value: 'getEventList',
						description: 'Get aircraft event list',
						action: 'Get event list',
						routing: {
							request: {
								method: 'POST',
								url: '=/api/Aircraft/getEventList/{{$credentials.apiToken}}',
								body: '={{Object.assign({aircraftid: 0, airframetype: "None", maketype: "None", modelid: 0, make: "", companyid: 0, isnewaircraft: "Ignore", allrelationships: true}, $parameter.additionalFields || {})}}',
							},
						},
					},
					{
						name: 'Get Event List Paged',
						value: 'getEventListPaged',
						description: 'Get aircraft event list with pagination',
						action: 'Get event list paged',
						routing: {
							request: {
								method: 'POST',
								url: '=/api/Aircraft/getEventListPaged/{{$credentials.apiToken}}/{{$parameter.pageSize}}/{{$parameter.page}}',
								body: '={{Object.assign({aircraftid: 0, airframetype: "None", maketype: "None", modelid: 0, make: "", companyid: 0, isnewaircraft: "Ignore", allrelationships: true}, $parameter.additionalFields || {})}}',
							},
						},
					},
					{
						name: 'Get History List',
						value: 'getHistoryList',
						description: 'Get aircraft history list',
						action: 'Get history list',
						routing: {
							request: {
								method: 'POST',
								url: '=/api/Aircraft/getHistoryList/{{$credentials.apiToken}}',
								body: '={{Object.assign({aircraftid: 0, airframetype: "None", maketype: "None", modelid: 0, make: "", companyid: 0, isnewaircraft: "Ignore", allrelationships: true}, $parameter.additionalFields || {})}}',
							},
						},
					},
					{
						name: 'Get History List Paged',
						value: 'getHistoryListPaged',
						description: 'Get aircraft history list with pagination',
						action: 'Get history list paged',
						routing: {
							request: {
								method: 'POST',
								url: '=/api/Aircraft/getHistoryListPaged/{{$credentials.apiToken}}/{{$parameter.pageSize}}/{{$parameter.page}}',
								body: '={{Object.assign({aircraftid: 0, airframetype: "None", maketype: "None", modelid: 0, make: "", companyid: 0, isnewaircraft: "Ignore", allrelationships: true}, $parameter.additionalFields || {})}}',
							},
						},
					},
					// Flight Data
					{
						name: 'Get Flight Data',
						value: 'getFlightData',
						description: 'Get comprehensive flight data',
						action: 'Get flight data',
						routing: {
							request: {
								method: 'POST',
								url: '=/api/Aircraft/getFlightData/{{$credentials.apiToken}}',
								body: '={{Object.assign({aircraftid: 0, airframetype: "None", maketype: "None", modelid: 0, make: "", companyid: 0, isnewaircraft: "Ignore", allrelationships: true}, $parameter.additionalFields || {})}}',
							},
						},
					},
					// Relationships
					{
						name: 'Get Relationships',
						value: 'getRelationships',
						description: 'Get all aircraft relationships',
						action: 'Get relationships',
						routing: {
							request: {
								method: 'POST',
								url: '=/api/Aircraft/getRelationships/{{$credentials.apiToken}}',
								body: '={{Object.assign({aircraftid: 0, airframetype: "None", maketype: "None", modelid: 0, make: "", companyid: 0, isnewaircraft: "Ignore", allrelationships: true}, $parameter.additionalFields || {})}}',
							},
						},
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
						routing: {
							request: {
								method: 'GET',
								url: '=/api/Company/getCompany/{{$parameter.companyId}}/{{$credentials.apiToken}}',
							},
						},
					},
					{
						name: 'Get List',
						value: 'getList',
						description: 'Get list of all companies',
						action: 'Get company list',
						routing: {
							request: {
								method: 'POST',
								url: '=/api/Company/getCompanyList/{{$credentials.apiToken}}',
								body: '={{Object.assign({companyid: 0, companyname: "", parentid: 0, companytype: "", businesstype: ""}, $parameter.additionalFields || {})}}',
							},
						},
					},
					{
						name: 'Get Identification',
						value: 'getIdentification',
						description: 'Get company identification data',
						action: 'Get company identification',
						routing: {
							request: {
								method: 'GET',
								url: '=/api/Company/getIdentification/{{$parameter.companyId}}/{{$credentials.apiToken}}',
							},
						},
					},
					{
						name: 'Get Contacts',
						value: 'getContacts',
						description: 'Get list of contacts associated with company',
						action: 'Get company contacts',
						routing: {
							request: {
								method: 'GET',
								url: '=/api/Company/getContacts/{{$parameter.companyId}}/{{$credentials.apiToken}}',
							},
						},
					},
					{
						name: 'Get Phone Numbers',
						value: 'getPhonenumbers',
						description: 'Get company phone numbers',
						action: 'Get company phone numbers',
						routing: {
							request: {
								method: 'GET',
								url: '=/api/Company/getPhonenumbers/{{$parameter.companyId}}/{{$credentials.apiToken}}',
							},
						},
					},
					{
						name: 'Get Business Types',
						value: 'getBusinesstypes',
						description: 'Get business types/roles the company plays',
						action: 'Get company business types',
						routing: {
							request: {
								method: 'GET',
								url: '=/api/Company/getBusinesstypes/{{$parameter.companyId}}/{{$credentials.apiToken}}',
							},
						},
					},
					{
						name: 'Get Aircraft Relationships',
						value: 'getAircraftRelationships',
						description: 'Get aircraft relationships for this company',
						action: 'Get company aircraft relationships',
						routing: {
							request: {
								method: 'GET',
								url: '=/api/Company/getAircraftrelationships/{{$parameter.companyId}}/{{$credentials.apiToken}}',
							},
						},
					},
					{
						name: 'Get Related Companies',
						value: 'getRelatedCompanies',
						description: 'Get companies related to this company',
						action: 'Get related companies',
						routing: {
							request: {
								method: 'GET',
								url: '=/api/Company/getRelatedcompanies/{{$parameter.companyId}}/{{$credentials.apiToken}}',
							},
						},
					},
					{
						name: 'Get Company Certifications',
						value: 'getCompanyCertifications',
						description: 'Get company accreditations, memberships and certifications',
						action: 'Get company certifications',
						routing: {
							request: {
								method: 'GET',
								url: '=/api/Company/getCompanyCertifications/{{$parameter.companyId}}/{{$credentials.apiToken}}',
							},
						},
					},
					{
						name: 'Get Company History',
						value: 'getCompanyHistory',
						description: 'Get company history and transaction records',
						action: 'Get company history',
						routing: {
							request: {
								method: 'POST',
								url: '=/api/Company/getCompanyHistory/{{$credentials.apiToken}}',
								body: '={{Object.assign({companyid: 0, complist: [], aircraftid: 0, aclist: [], transtype: [], relationship: [], startdate: "", enddate: "", lastactionstartdate: "", lastactionenddate: "", isinternaltrans: "Ignore", isoperator: "Ignore"}, $parameter.additionalFields || {})}}',
							},
						},
					},
					{
						name: 'Get Company History Paged',
						value: 'getCompanyHistoryPaged',
						description: 'Get company history with pagination',
						action: 'Get company history paged',
						routing: {
							request: {
								method: 'POST',
								url: '=/api/Company/getCompanyHistoryPaged/{{$credentials.apiToken}}/{{$parameter.pageSize}}/{{$parameter.page}}',
								body: '={{Object.assign({companyid: 0, complist: [], aircraftid: 0, aclist: [], transtype: [], relationship: [], startdate: "", enddate: "", lastactionstartdate: "", lastactionenddate: "", isinternaltrans: "Ignore", isoperator: "Ignore"}, $parameter.additionalFields || {})}}',
							},
						},
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
						routing: {
							request: {
								method: 'GET',
								url: '=/api/Contact/getContact/{{$parameter.contactId}}/{{$credentials.apiToken}}',
							},
						},
					},
					{
						name: 'Get Aircraft Relationships',
						value: 'getAircraftRelationships',
						description: 'Get aircraft relationships for a contact',
						action: 'Get contact aircraft relationships',
						routing: {
							request: {
								method: 'GET',
								url: '=/api/Contact/getContAircraftRelationships/{{$parameter.contactId}}/{{$credentials.apiToken}}',
							},
						},
					},
					{
						name: 'Get Identification',
						value: 'getIdentification',
						description: 'Get contact identification details',
						action: 'Get contact identification',
						routing: {
							request: {
								method: 'GET',
								url: '=/api/Contact/getIdentification/{{$parameter.contactId}}/{{$credentials.apiToken}}',
							},
						},
					},
					{
						name: 'Get List',
						value: 'getList',
						description: 'Get list of all contacts',
						action: 'Get contact list',
						routing: {
							request: {
								method: 'POST',
								url: '=/api/Contact/getContactList/{{$credentials.apiToken}}',
								body: '={{{"aircraftid": $parameter.additionalFields?.aircraftIds || [], "companyid": $parameter.additionalFields?.companyId || 0, "companyname": $parameter.additionalFields?.companyName || "", "firstname": $parameter.additionalFields?.firstName || "", "lastname": $parameter.additionalFields?.lastName || "", "title": $parameter.additionalFields?.title || "", "email": $parameter.additionalFields?.email || "", "actiondate": $parameter.additionalFields?.actionDate || "", "phonenumber": $parameter.additionalFields?.phoneNumber || "", "contactchanges": $parameter.additionalFields?.contactChanges || false, "contlist": $parameter.additionalFields?.contactList || [], "complist": $parameter.additionalFields?.companyList || []}}}',
							},
						},
					},
					{
						name: 'Get List Paged',
						value: 'getListPaged',
						description: 'Get paginated list of contacts',
						action: 'Get contact list paged',
						routing: {
							request: {
								method: 'POST',
								url: '=/api/Contact/getContactListPaged/{{$credentials.apiToken}}/{{$parameter.pageSize}}/{{$parameter.page}}',
								body: '={{{"aircraftid": $parameter.additionalFields?.aircraftIds || [], "companyid": $parameter.additionalFields?.companyId || 0, "companyname": $parameter.additionalFields?.companyName || "", "firstname": $parameter.additionalFields?.firstName || "", "lastname": $parameter.additionalFields?.lastName || "", "title": $parameter.additionalFields?.title || "", "email": $parameter.additionalFields?.email || "", "actiondate": $parameter.additionalFields?.actionDate || "", "phonenumber": $parameter.additionalFields?.phoneNumber || "", "contactchanges": $parameter.additionalFields?.contactChanges || false, "contlist": $parameter.additionalFields?.contactList || [], "complist": $parameter.additionalFields?.companyList || []}}}',
							},
						},
					},
					{
						name: 'Get Other Listings',
						value: 'getOtherListings',
						description: 'Get other company listings for a contact',
						action: 'Get contact other listings',
						routing: {
							request: {
								method: 'GET',
								url: '=/api/Contact/getOtherlistings/{{$parameter.contactId}}/{{$credentials.apiToken}}',
							},
						},
					},
					{
						name: 'Get Phone Numbers',
						value: 'getPhoneNumbers',
						description: 'Get phone numbers for a contact',
						action: 'Get contact phone numbers',
						routing: {
							request: {
								method: 'GET',
								url: '=/api/Contact/getPhonenumbers/{{$parameter.contactId}}/{{$credentials.apiToken}}',
							},
						},
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
					// Model Market Intelligence Operations
					{
						name: 'Get Model Intelligence',
						value: 'getModelIntelligence',
						description: 'Get model intelligence data including specs and market metrics',
						action: 'Get model intelligence',
						routing: {
							request: {
								method: 'POST',
								url: '=/api/Model/getModelIntelligence/{{$credentials.apiToken}}',
								body: '={{Object.assign({}, $parameter.additionalFields || {})}}',
							},
						},
					},
					{
						name: 'Get Model Market Trends',
						value: 'getModelMarketTrends',
						description: 'Get model market trend data and analytics',
						action: 'Get model market trends',
						routing: {
							request: {
								method: 'POST',
								url: '=/api/Model/getModelMarketTrends/{{$credentials.apiToken}}',
								body: '={{Object.assign({}, $parameter.additionalFields || {})}}',
							},
						},
					},
					{
						name: 'Get Model Operation Costs',
						value: 'getModelOperationCosts',
						description: 'Get aircraft model operation costs data',
						action: 'Get model operation costs',
						routing: {
							request: {
								method: 'POST',
								url: '=/api/Model/getModelOperationCosts/{{$credentials.apiToken}}',
								body: '={{Object.assign({}, $parameter.additionalFields || {})}}',
							},
						},
					},
					{
						name: 'Get Model Performance Specs',
						value: 'getModelPerformanceSpecs',
						description: 'Get aircraft model performance specifications',
						action: 'Get model performance specs',
						routing: {
							request: {
								method: 'POST',
								url: '=/api/Model/getModelPerformanceSpecs/{{$credentials.apiToken}}',
								body: '={{Object.assign({}, $parameter.additionalFields || {})}}',
							},
						},
					},
					
					// Utility Reference Data Operations
					{
						name: 'Get Account Info',
						value: 'getAccountInfo',
						description: 'Get current user account information',
						action: 'Get account info',
						routing: {
							request: {
								method: 'GET',
								url: '=/api/Utility/getAccountInfo/{{$credentials.apiToken}}',
							},
						},
					},
					{
						name: 'Get Product Codes',
						value: 'getProductCodes',
						description: 'Get available product codes for your account',
						action: 'Get product codes',
						routing: {
							request: {
								method: 'GET',
								url: '=/api/Utility/getProductCodes/{{$credentials.apiToken}}',
							},
						},
					},
					{
						name: 'Get Airframe Types',
						value: 'getAirframeTypes',
						description: 'Get list of aircraft airframe types',
						action: 'Get airframe types',
						routing: {
							request: {
								method: 'GET',
								url: '=/api/Utility/getAirframeTypes/{{$credentials.apiToken}}',
							},
						},
					},
					{
						name: 'Get Make Type List',
						value: 'getMakeTypeList',
						description: 'Get list of aircraft make types',
						action: 'Get make type list',
						routing: {
							request: {
								method: 'GET',
								url: '=/api/Utility/getMakeTypeList/{{$credentials.apiToken}}',
							},
						},
					},
					{
						name: 'Get Weight Class Types',
						value: 'getWeightClassTypes',
						description: 'Get list of aircraft weight classes',
						action: 'Get weight class types',
						routing: {
							request: {
								method: 'GET',
								url: '=/api/Utility/getWeightClassTypes/{{$credentials.apiToken}}',
							},
						},
					},
					{
						name: 'Get Airframe JNIQ Sizes',
						value: 'getAirframeJniqSizes',
						description: 'Get aircraft JNIQ size categories',
						action: 'Get airframe JNIQ sizes',
						routing: {
							request: {
								method: 'GET',
								url: '=/api/Utility/getAirframeJniqSizes/{{$credentials.apiToken}}',
							},
						},
					},
					{
						name: 'Get Aircraft Make List',
						value: 'getAircraftMakeList',
						description: 'Get list of all aircraft makes',
						action: 'Get aircraft make list',
						routing: {
							request: {
								method: 'GET',
								url: '=/api/Utility/getAircraftMakeList/{{$credentials.apiToken}}',
							},
						},
					},
					{
						name: 'Get Aircraft Model List',
						value: 'getAircraftModelList',
						description: 'Get list of all aircraft models',
						action: 'Get aircraft model list',
						routing: {
							request: {
								method: 'GET',
								url: '=/api/Utility/getAircraftModelList/{{$credentials.apiToken}}',
							},
						},
					},
					{
						name: 'Get Company Business Types',
						value: 'getCompanyBusinessTypes',
						description: 'Get list of company business types',
						action: 'Get company business types',
						routing: {
							request: {
								method: 'GET',
								url: '=/api/Utility/getCompanyBusinessTypes/{{$credentials.apiToken}}',
							},
						},
					},
					{
						name: 'Get Aircraft Company Relationship Types',
						value: 'getAircraftCompanyRelationships',
						description: 'Get list of aircraft-company relationship types',
						action: 'Get aircraft company relationship types',
						routing: {
							request: {
								method: 'GET',
								url: '=/api/Utility/getAircraftCompanyRelationships/{{$credentials.apiToken}}',
							},
						},
					},
					{
						name: 'Get Event Categories',
						value: 'getEventCategories',
						description: 'Get list of aircraft event categories',
						action: 'Get event categories',
						routing: {
							request: {
								method: 'GET',
								url: '=/api/Utility/getEventCategories/{{$credentials.apiToken}}',
							},
						},
					},
					{
						name: 'Get Event Types',
						value: 'getEventTypes',
						description: 'Get list of aircraft event types',
						action: 'Get event types',
						routing: {
							request: {
								method: 'GET',
								url: '=/api/Utility/getEventTypes/{{$credentials.apiToken}}',
							},
						},
					},
					{
						name: 'Get Airport List',
						value: 'getAirportList',
						description: 'Get list of airports',
						action: 'Get airport list',
						routing: {
							request: {
								method: 'GET',
								url: '=/api/Utility/getAirportList/{{$credentials.apiToken}}',
							},
						},
					},
					{
						name: 'Get State List',
						value: 'getStateList',
						description: 'Get list of states',
						action: 'Get state list',
						routing: {
							request: {
								method: 'GET',
								url: '=/api/Utility/getStateList/{{$credentials.apiToken}}',
							},
						},
					},
					{
						name: 'Get Country List',
						value: 'getCountryList',
						description: 'Get list of countries',
						action: 'Get country list',
						routing: {
							request: {
								method: 'GET',
								url: '=/api/Utility/getCountryList/{{$credentials.apiToken}}',
							},
						},
					},
					{
						name: 'Get Aircraft Lifecycle Status',
						value: 'getAircraftLifecycleStatus',
						description: 'Get list of aircraft lifecycle status types',
						action: 'Get aircraft lifecycle status',
						routing: {
							request: {
								method: 'GET',
								url: '=/api/Utility/getAircraftLifecycleStatus/{{$credentials.apiToken}}',
							},
						},
					},
					{
						name: 'Get Aircraft History Transaction Types',
						value: 'getAircraftHistoryTransTypes',
						description: 'Get list of aircraft history transaction types',
						action: 'Get aircraft history transaction types',
						routing: {
							request: {
								method: 'GET',
								url: '=/api/Utility/getAircraftHistoryTransTypes/{{$credentials.apiToken}}',
							},
						},
					},
				],
				default: 'getModelIntelligence',
			},

			// Parameters for operations
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

			// Additional Fields for Company operations
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['company'],
						operation: ['getList', 'getCompanyHistory', 'getCompanyHistoryPaged'],
					},
				},
				options: [
					// For getList operation
					{
						displayName: 'Company ID',
						name: 'companyid',
						type: 'number',
						displayOptions: {
							show: {
								'/operation': ['getList'],
							},
						},
						default: 0,
						description: 'Filter by specific company ID',
					},
					{
						displayName: 'Company Name',
						name: 'companyname',
						type: 'string',
						displayOptions: {
							show: {
								'/operation': ['getList'],
							},
						},
						default: '',
						description: 'Filter by company name',
					},
					{
						displayName: 'Parent ID',
						name: 'parentid',
						type: 'number',
						displayOptions: {
							show: {
								'/operation': ['getList'],
							},
						},
						default: 0,
						description: 'Filter by parent company ID',
					},
					{
						displayName: 'Company Type',
						name: 'companytype',
						type: 'string',
						displayOptions: {
							show: {
								'/operation': ['getList'],
							},
						},
						default: '',
						description: 'Filter by company type',
					},
					{
						displayName: 'Business Type',
						name: 'businesstype',
						type: 'string',
						displayOptions: {
							show: {
								'/operation': ['getList'],
							},
						},
						default: '',
						description: 'Filter by business type',
					},
					// For getCompanyHistory and getCompanyHistoryPaged operations
					{
						displayName: 'Company ID',
						name: 'companyid',
						type: 'number',
						displayOptions: {
							show: {
								'/operation': ['getCompanyHistory', 'getCompanyHistoryPaged'],
							},
						},
						default: 0,
						description: 'Filter by specific company ID',
					},
					{
						displayName: 'Company List',
						name: 'complist',
						type: 'string',
						displayOptions: {
							show: {
								'/operation': ['getCompanyHistory', 'getCompanyHistoryPaged'],
							},
						},
						typeOptions: {
							multipleValues: true,
						},
						default: [],
						description: 'List of company IDs to filter',
					},
					{
						displayName: 'Aircraft ID',
						name: 'aircraftid',
						type: 'number',
						displayOptions: {
							show: {
								'/operation': ['getCompanyHistory', 'getCompanyHistoryPaged'],
							},
						},
						default: 0,
						description: 'Filter by aircraft ID',
					},
					{
						displayName: 'Aircraft List',
						name: 'aclist',
						type: 'string',
						displayOptions: {
							show: {
								'/operation': ['getCompanyHistory', 'getCompanyHistoryPaged'],
							},
						},
						typeOptions: {
							multipleValues: true,
						},
						default: [],
						description: 'List of aircraft IDs to filter',
					},
					{
						displayName: 'Transaction Type',
						name: 'transtype',
						type: 'string',
						displayOptions: {
							show: {
								'/operation': ['getCompanyHistory', 'getCompanyHistoryPaged'],
							},
						},
						typeOptions: {
							multipleValues: true,
						},
						default: [],
						description: 'Filter by transaction types',
					},
					{
						displayName: 'Relationship',
						name: 'relationship',
						type: 'string',
						displayOptions: {
							show: {
								'/operation': ['getCompanyHistory', 'getCompanyHistoryPaged'],
							},
						},
						typeOptions: {
							multipleValues: true,
						},
						default: [],
						description: 'Filter by relationship types',
					},
					{
						displayName: 'Start Date',
						name: 'startdate',
						type: 'string',
						displayOptions: {
							show: {
								'/operation': ['getCompanyHistory', 'getCompanyHistoryPaged'],
							},
						},
						default: '',
						description: 'Start date for history filter (MM/DD/YYYY)',
					},
					{
						displayName: 'End Date',
						name: 'enddate',
						type: 'string',
						displayOptions: {
							show: {
								'/operation': ['getCompanyHistory', 'getCompanyHistoryPaged'],
							},
						},
						default: '',
						description: 'End date for history filter (MM/DD/YYYY)',
					},
					{
						displayName: 'Last Action Start Date',
						name: 'lastactionstartdate',
						type: 'string',
						displayOptions: {
							show: {
								'/operation': ['getCompanyHistory', 'getCompanyHistoryPaged'],
							},
						},
						default: '',
						description: 'Last action start date filter',
					},
					{
						displayName: 'Last Action End Date',
						name: 'lastactionenddate',
						type: 'string',
						displayOptions: {
							show: {
								'/operation': ['getCompanyHistory', 'getCompanyHistoryPaged'],
							},
						},
						default: '',
						description: 'Last action end date filter',
					},
					{
						displayName: 'Is Internal Transaction',
						name: 'isinternaltrans',
						type: 'options',
						displayOptions: {
							show: {
								'/operation': ['getCompanyHistory', 'getCompanyHistoryPaged'],
							},
						},
						options: [
							{
								name: 'Ignore',
								value: 'Ignore',
							},
							{
								name: 'Yes',
								value: 'Yes',
							},
							{
								name: 'No',
								value: 'No',
							},
						],
						default: 'Ignore',
						description: 'Filter by internal transaction status',
					},
					{
						displayName: 'Is Operator',
						name: 'isoperator',
						type: 'options',
						displayOptions: {
							show: {
								'/operation': ['getCompanyHistory', 'getCompanyHistoryPaged'],
							},
						},
						options: [
							{
								name: 'Ignore',
								value: 'Ignore',
							},
							{
								name: 'Yes',
								value: 'Yes',
							},
							{
								name: 'No',
								value: 'No',
							},
						],
						default: 'Ignore',
						description: 'Filter by operator status',
					},
				],
			},

			// Additional Fields for Contact operations
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['contact'],
						operation: ['getList', 'getListPaged'],
					},
				},
				options: [
					{
						displayName: 'Aircraft IDs',
						name: 'aircraftIds',
						type: 'string',
						typeOptions: {
							multipleValues: true,
						},
						default: [],
						description: 'Filter by aircraft IDs',
					},
					{
						displayName: 'Company ID',
						name: 'companyId',
						type: 'number',
						default: 0,
						description: 'Filter by company ID',
					},
					{
						displayName: 'Company Name',
						name: 'companyName',
						type: 'string',
						default: '',
						description: 'Filter by company name',
					},
					{
						displayName: 'First Name',
						name: 'firstName',
						type: 'string',
						default: '',
						description: 'Filter by first name',
					},
					{
						displayName: 'Last Name',
						name: 'lastName',
						type: 'string',
						default: '',
						description: 'Filter by last name',
					},
					{
						displayName: 'Title',
						name: 'title',
						type: 'string',
						default: '',
						description: 'Filter by contact title',
					},
					{
						displayName: 'Email',
						name: 'email',
						type: 'string',
						default: '',
						description: 'Filter by email address',
					},
					{
						displayName: 'Action Date',
						name: 'actionDate',
						type: 'string',
						default: '',
						description: 'Filter by action date',
					},
					{
						displayName: 'Phone Number',
						name: 'phoneNumber',
						type: 'string',
						default: '',
						description: 'Filter by phone number',
					},
					{
						displayName: 'Contact Changes',
						name: 'contactChanges',
						type: 'boolean',
						default: false,
						description: 'Whether to include contact changes',
					},
					{
						displayName: 'Contact List',
						name: 'contactList',
						type: 'string',
						typeOptions: {
							multipleValues: true,
						},
						default: [],
						description: 'List of contact IDs to filter',
					},
					{
						displayName: 'Company List',
						name: 'companyList',
						type: 'string',
						typeOptions: {
							multipleValues: true,
						},
						default: [],
						description: 'List of company IDs to filter',
					},
				],
			},

			// Additional Fields for Market Model Operations
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['market'],
						operation: [
							'getModelIntelligence',
							'getModelMarketTrends',
							'getModelOperationCosts',
							'getModelPerformanceSpecs',
						],
					},
				},
				options: [
					{
						displayName: 'Airframe Type',
						name: 'airframetype',
						type: 'options',
						options: [
							{ name: 'None', value: 'None' },
							{ name: 'Fixed Wing', value: 'FixedWing' },
							{ name: 'Rotary', value: 'Rotary' },
						],
						default: 'None',
						description: 'Type of airframe to filter by',
					},
					{
						displayName: 'Make Type',
						name: 'maketype',
						type: 'options',
						options: [
							{ name: 'None', value: 'None' },
							{ name: 'Business Jet', value: 'BusinessJet' },
							{ name: 'Turboprop', value: 'Turboprop' },
							{ name: 'Piston', value: 'Piston' },
							{ name: 'Jet Airliner', value: 'JetAirliner' },
							{ name: 'Turbo Helicopter', value: 'TurboHelicopter' },
							{ name: 'Piston Helicopter', value: 'PistonHelicopter' },
						],
						default: 'None',
						description: 'Type of aircraft make to filter by',
					},
					{
						displayName: 'Make',
						name: 'make',
						type: 'string',
						typeOptions: {
							multipleValues: true,
						},
						default: [],
						description: 'List of aircraft makes to filter (e.g., GULFSTREAM, BOEING)',
					},
					{
						displayName: 'Model',
						name: 'model',
						type: 'string',
						typeOptions: {
							multipleValues: true,
						},
						default: [],
						description: 'List of aircraft models to filter (e.g., G550, BBJ3)',
					},
					{
						displayName: 'Model ID',
						name: 'modelid',
						type: 'number',
						default: 0,
						description: 'Specific model ID to filter by',
					},
					{
						displayName: 'Year Manufactured',
						name: 'yearmfr',
						type: 'string',
						default: '',
						description: 'Year manufactured (single year: "2020" or range: "2015:2020")',
					},
					{
						displayName: 'Year Delivered',
						name: 'yeardlv',
						type: 'string',
						default: '',
						description: 'Year delivered (single year: "2020" or range: "2015:2020")',
					},
					{
						displayName: 'Category Size',
						name: 'categorysize',
						type: 'string',
						typeOptions: {
							multipleValues: true,
						},
						default: [],
						description: 'List of category sizes (e.g., MJ, ABJ, LGULR)',
					},
					{
						displayName: 'Start Date',
						name: 'startdate',
						type: 'string',
						default: '',
						description: 'Start date for trend data (ISO format)',
						displayOptions: {
							show: {
								'/operation': ['getModelMarketTrends'],
							},
						},
					},
					{
						displayName: 'Display Range',
						name: 'displayRange',
						type: 'string',
						default: '',
						description: 'Display range for trend data',
						displayOptions: {
							show: {
								'/operation': ['getModelMarketTrends'],
							},
						},
					},
					{
						displayName: 'Product Code',
						name: 'productcode',
						type: 'string',
						default: '',
						description: 'Product code to filter by',
						displayOptions: {
							show: {
								'/operation': ['getModelMarketTrends'],
							},
						},
					},
					{
						displayName: 'Model List',
						name: 'modlist',
						type: 'string',
						typeOptions: {
							multipleValues: true,
						},
						default: [],
						description: 'List of specific models for trends',
						displayOptions: {
							show: {
								'/operation': ['getModelMarketTrends'],
							},
						},
					},
				],
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
							const aircraftFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;
							body = Object.assign({
								aircraftid: 0,
								airframetype: 'None',
								maketype: 'None',
								modelid: 0,
								make: '',
								companyid: 0,
								isnewaircraft: 'Ignore',
								allrelationships: true,
							}, aircraftFields);
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
							break;
						case 'getBulkAircraftExportPaged':
							endpoint = `/api/Aircraft/getBulkAircraftExportPaged/${this.getNodeParameter('pageSize', itemIndex)}/${this.getNodeParameter('page', itemIndex)}`;
							method = 'POST';
							break;
						case 'getCondensedSnapshot':
							endpoint = '/api/Aircraft/getCondensedSnapshot';
							method = 'POST';
							break;
						case 'getCondensedOwnerOperators':
							endpoint = '/api/Aircraft/getCondensedOwnerOperators';
							method = 'POST';
							break;
						case 'getCondensedOwnerOperatorsPaged':
							endpoint = `/api/Aircraft/getCondensedOwnerOperatorsPaged/${this.getNodeParameter('pageSize', itemIndex)}/${this.getNodeParameter('page', itemIndex)}`;
							method = 'POST';
							break;
						case 'getEventList':
							endpoint = '/api/Aircraft/getEventList';
							method = 'POST';
							break;
						case 'getEventListPaged':
							endpoint = `/api/Aircraft/getEventListPaged/${this.getNodeParameter('pageSize', itemIndex)}/${this.getNodeParameter('page', itemIndex)}`;
							method = 'POST';
							break;
						case 'getHistoryList':
							endpoint = '/api/Aircraft/getHistoryList';
							method = 'POST';
							break;
						case 'getHistoryListPaged':
							endpoint = `/api/Aircraft/getHistoryListPaged/${this.getNodeParameter('pageSize', itemIndex)}/${this.getNodeParameter('page', itemIndex)}`;
							method = 'POST';
							break;
						case 'getFlightData':
							endpoint = '/api/Aircraft/getFlightData';
							method = 'POST';
							break;
						case 'getRelationships':
							endpoint = '/api/Aircraft/getRelationships';
							method = 'POST';
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
							const companyFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;
							body = Object.assign({
								companyid: 0,
								companyname: '',
								parentid: 0,
								companytype: '',
								businesstype: '',
							}, companyFields);
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
							break;
						case 'getCompanyHistoryPaged':
							endpoint = `/api/Company/getCompanyHistoryPaged/${this.getNodeParameter('pageSize', itemIndex)}/${this.getNodeParameter('page', itemIndex)}`;
							method = 'POST';
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
							const contactFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;
							body = {
								aircraftid: contactFields.aircraftIds || [],
								companyid: contactFields.companyId || 0,
								companyname: contactFields.companyName || '',
								firstname: contactFields.firstName || '',
								lastname: contactFields.lastName || '',
								title: contactFields.title || '',
								email: contactFields.email || '',
								actiondate: contactFields.actionDate || '',
								phonenumber: contactFields.phoneNumber || '',
								contactchanges: contactFields.contactChanges || false,
								contlist: contactFields.contactList || [],
								complist: contactFields.companyList || [],
							};
							break;
						case 'getListPaged':
							endpoint = `/api/Contact/getContactListPaged/${this.getNodeParameter('pageSize', itemIndex)}/${this.getNodeParameter('page', itemIndex)}`;
							method = 'POST';
							const contactPagedFields = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;
							body = {
								aircraftid: contactPagedFields.aircraftIds || [],
								companyid: contactPagedFields.companyId || 0,
								companyname: contactPagedFields.companyName || '',
								firstname: contactPagedFields.firstName || '',
								lastname: contactPagedFields.lastName || '',
								title: contactPagedFields.title || '',
								email: contactPagedFields.email || '',
								actiondate: contactPagedFields.actionDate || '',
								phonenumber: contactPagedFields.phoneNumber || '',
								contactchanges: contactPagedFields.contactChanges || false,
								contlist: contactPagedFields.contactList || [],
								complist: contactPagedFields.companyList || [],
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
							body = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;
							break;
						case 'getModelMarketTrends':
							endpoint = '/api/Model/getModelMarketTrends';
							method = 'POST';
							body = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;
							break;
						case 'getModelOperationCosts':
							endpoint = '/api/Model/getModelOperationCosts';
							method = 'POST';
							body = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;
							break;
						case 'getModelPerformanceSpecs':
							endpoint = '/api/Model/getModelPerformanceSpecs';
							method = 'POST';
							body = this.getNodeParameter('additionalFields', itemIndex, {}) as IDataObject;
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
				// Response will be automatically formatted by jetNetApiRequest
				const responseData = await jetNetApiRequest.call(this, method, endpoint, body, qs);

				// Handle response based on type
				if (Array.isArray(responseData)) {
					// For arrays, each item becomes a separate n8n item
					responseData.forEach((item) => {
						returnData.push({ json: item });
					});
				} else if (responseData && typeof responseData === 'object') {
					// For single objects, wrap in n8n item structure
					returnData.push({ json: responseData });
				} else if (responseData !== null && responseData !== undefined) {
					// For primitive values, wrap in object
					returnData.push({ json: { value: responseData } });
				} else {
					// For null/undefined responses, return empty object
					returnData.push({ json: {} });
				}
			} catch (error) {
				if (this.continueOnFail()) {
					const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
					returnData.push({ json: { error: errorMessage }, pairedItem: itemIndex });
					continue;
				}
				throw new NodeOperationError(this.getNode(), error as Error, { itemIndex });
			}
		}

		return [returnData];
	}
}
