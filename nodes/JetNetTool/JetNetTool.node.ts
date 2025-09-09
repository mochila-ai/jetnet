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
						name: 'Get List',
						value: 'getList',
						description: 'Get list of all companies',
						action: 'Get company list',
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
						name: 'Get List',
						value: 'getList',
						description: 'Get list of all contacts',
						action: 'Get contact list',
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
				],
				default: 'getAircraftMakeList',
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
				'aircraft.getList': 'Get list of all aircraft from JetNet database',
				'aircraft.getByRegistration': 'Get aircraft details by registration number from JetNet',
				'company.getList': 'Get list of all companies from JetNet database',
				'contact.getList': 'Get list of all contacts from JetNet database',
				'market.getAircraftMakeList': 'Get list of all aircraft manufacturers from JetNet',
				'market.getAircraftModelList': 'Get list of all aircraft models from JetNet',
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
		try {
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
		} catch (error) {
			throw error;
		}
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
						const match = input.match(/\b[A-Z0-9\-]+\b/);
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
					case 'getByRegistration':
						const regNum = parsedInput.registrationNumber || parsedInput.registration || parsedInput.reg || '';
						if (!regNum) {
							throw new Error('Registration number is required for this operation');
						}
						endpoint = `/api/Aircraft/getRegNumber/${regNum}`;
						break;
					default:
						throw new Error(`Unknown aircraft operation: ${this.operation}`);
				}
			} else if (this.resource === 'company') {
				switch (this.operation) {
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
					default:
						throw new Error(`Unknown company operation: ${this.operation}`);
				}
			} else if (this.resource === 'contact') {
				switch (this.operation) {
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
					default:
						throw new Error(`Unknown contact operation: ${this.operation}`);
				}
			} else if (this.resource === 'market') {
				switch (this.operation) {
					case 'getAircraftMakeList':
						endpoint = '/api/Utility/getAircraftMakeList';
						break;
					case 'getAircraftModelList':
						endpoint = '/api/Utility/getAircraftModelList';
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