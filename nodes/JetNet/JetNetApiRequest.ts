import {
	IExecuteFunctions,
	IHttpRequestOptions,
	IHttpRequestMethods,
	IDataObject,
	NodeApiError,
	JsonObject,
} from 'n8n-workflow';

// Security: Sanitize error messages to remove sensitive information
function sanitizeError(error: any): string {
	let message = error.message || error.toString();
	// Remove Bearer tokens
	message = message.replace(/Bearer\s+[\w\-.]+/gi, 'Bearer [REDACTED]');
	// Remove API tokens
	message = message.replace(/apiToken[=:]\s*[\w-]+/gi, 'apiToken=[REDACTED]');
	// Remove URLs with tokens
	message = message.replace(/https?:\/\/[^\s]*token[^\s]*/gi, '[URL_REDACTED]');
	// Remove passwords
	message = message.replace(/password[=:]\s*["']?[\w-]+["']?/gi, 'password=[REDACTED]');
	// Remove email addresses in auth context
	message = message.replace(/emailaddress[=:]\s*["']?[^"'\s]+["']?/gi, 'emailaddress=[REDACTED]');
	return message;
}

// Cache for tokens (stores both Bearer token and API token)
interface TokenCache {
	bearerToken: string;
	apiToken: string;
	expiry: number;
}

const tokenCache: Map<string, TokenCache> = new Map();

export async function jetNetApiRequest(
	this: IExecuteFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body?: IDataObject,
	qs?: IDataObject,
): Promise<any> {
	const credentials = await this.getCredentials('jetNetApi');
	
	if (!credentials) {
		throw new NodeApiError(this.getNode(), {
			message: 'No credentials provided',
			description: 'Please add JetNet API credentials',
		});
	}

	// Get both tokens (from cache or generate new ones)
	const tokens = await getTokens.call(this, credentials);
	
	// Append security token to the endpoint
	const urlWithToken = `${endpoint}/${tokens.apiToken}`;
	
	const options: IHttpRequestOptions = {
		method,
		url: `https://customer.jetnetconnect.com${urlWithToken}`,
		headers: {
			'Authorization': `Bearer ${tokens.bearerToken}`,
			'Content-Type': 'application/json',
			'Accept': 'application/json',
		},
		body,
		qs,
		json: true,
		timeout: 60000, // 60 seconds default timeout
	};

	try {
		const response = await this.helpers.httpRequest(options);
		// Format the response to extract data from wrapper fields
		return formatJetNetResponse(response);
	} catch (error: any) {
		// If authentication failed, clear cache and retry once
		if (error.statusCode === 401) {
			const cacheKey = `${credentials.username}`;
			tokenCache.delete(cacheKey);
			
			// Get new tokens and retry
			const newTokens = await getTokens.call(this, credentials, true);
			options.headers!['Authorization'] = `Bearer ${newTokens.bearerToken}`;
			// Update URL with new API token
			const newUrlWithToken = `${endpoint}/${newTokens.apiToken}`;
			options.url = `https://customer.jetnetconnect.com${newUrlWithToken}`;
			
			const response = await this.helpers.httpRequest(options);
			// Format the response to extract data from wrapper fields
			return formatJetNetResponse(response);
		}
		
		throw new NodeApiError(this.getNode(), {
			message: sanitizeError(error),
			description: error.description ? sanitizeError(error.description) : undefined,
		} as JsonObject);
	}
}

async function getTokens(
	this: IExecuteFunctions,
	credentials: IDataObject,
	forceRefresh = false,
): Promise<TokenCache> {
	const cacheKey = `${credentials.username}`;
	
	// Check cache first (unless forced refresh)
	if (!forceRefresh && tokenCache.has(cacheKey)) {
		const cached = tokenCache.get(cacheKey)!;
		// Check if tokens are still valid (with 5 minute buffer)
		if (cached.expiry > Date.now() + 5 * 60 * 1000) {
			return cached;
		}
	}
	
	// Authenticate and get both tokens
	const authOptions: IHttpRequestOptions = {
		method: 'POST',
		url: 'https://customer.jetnetconnect.com/api/Admin/APILogin',
		body: {
			emailaddress: credentials.username as string,  // API expects 'emailaddress' field
			password: credentials.password as string,
		},
		headers: {
			'Content-Type': 'application/json',
		},
		json: true,
	};
	
	try {
		const response = await this.helpers.httpRequest(authOptions);
		
		// Extract both tokens from response
		// According to the API, response should contain:
		// { "bearerToken": "...", "apiToken": "..." }
		if (!response || typeof response !== 'object') {
			throw new Error('Invalid authentication response format');
		}
		
		const bearerToken = response.bearerToken;
		const apiToken = response.apiToken;
		
		if (!bearerToken || !apiToken) {
			throw new Error(`Missing tokens in authentication response. Got: ${JSON.stringify(response)}`);
		}
		
		// Calculate expiry time (default 24 hours)
		let expiryTime = Date.now() + 24 * 60 * 60 * 1000;
		
		// Parse expiry if provided in response
		if (response.expires_in) {
			expiryTime = Date.now() + (response.expires_in * 1000);
		} else if (response.expiry) {
			expiryTime = new Date(response.expiry).getTime();
		}
		
		// Cache both tokens
		const tokens: TokenCache = {
			bearerToken,
			apiToken,
			expiry: expiryTime,
		};
		
		tokenCache.set(cacheKey, tokens);
		
		return tokens;
	} catch (error: any) {
		throw new NodeApiError(this.getNode(), {
			message: 'Authentication failed',
			description: `Failed to authenticate with JetNet API: ${sanitizeError(error)}`,
		} as JsonObject);
	}
}

/**
 * Format JetNet API responses to extract actual data from wrapper fields
 * Removes wrapper fields (responseid, responsestatus) and extracts the actual data
 */
export function formatJetNetResponse(response: any): any {
	// If response is not an object or is null, return as-is
	if (!response || typeof response !== 'object') {
		return response;
	}

	// If response is an array, format each item
	if (Array.isArray(response)) {
		return response.map(item => formatJetNetResponse(item));
	}

	// Check if this is a wrapped response with responsestatus
	if ('responsestatus' in response) {
		// Check for error status
		if (response.responsestatus !== 'SUCCESS' && response.responsestatus !== 'Success') {
			// Keep error responses intact
			return response;
		}

		// Identify and extract the actual data field
		// Common patterns: aircraftresult, companyresult, contactresult, etc.
		const resultFields = [
			'aircraftresult',
			'aircraftlist',
			'companyresult',
			'companylist',
			'contactresult',
			'contactlist',
			'modelresult',
			'modellist',
			'utilityresult',
			'eventlist',
			'historylist',
			'flightdata',
			'relationships',
			'pictures',
			'contacts',
			'phonenumbers',
			'businesstypes',
			'certifications',
			'relatedcompanies',
			'aircraftrelationships',
			'companyrelationships',
			'otherlistings',
			'accountinfo',
			'productcodes',
			'airframetypes',
			'maketypes',
			'weightclasses',
			'jniqsizes',
			'makes',
			'models',
			'businesstypes',
			'relationshiptypes',
			'eventcategories',
			'eventtypes',
			'airports',
			'states',
			'countries',
			'lifecyclestatus',
			'transactiontypes',
		];

		// Find the first matching result field
		for (const field of resultFields) {
			if (field in response) {
				const data = response[field];
				
				// If the data is an array, return it directly
				if (Array.isArray(data)) {
					return data;
				}
				
				// If the data is an object, return it
				if (data && typeof data === 'object') {
					return data;
				}
				
				// Otherwise return the value as-is
				return data;
			}
		}

		// Special handling for paged responses
		if ('page' in response || 'pagesize' in response || 'totalcount' in response) {
			// Look for the data array in paged responses
			const dataFields = Object.keys(response).filter(key => 
				!['responseid', 'responsestatus', 'page', 'pagesize', 'totalcount', 'totalpages'].includes(key)
			);
			
			if (dataFields.length === 1) {
				// Return the single data field with pagination metadata
				const dataField = dataFields[0];
				const data = response[dataField];
				
				// If we need to preserve pagination metadata, include it
				if (Array.isArray(data)) {
					// Add pagination metadata as properties to the array
					const result = data;
					(result as any)._pagination = {
						page: response.page,
						pageSize: response.pagesize,
						totalCount: response.totalcount,
						totalPages: response.totalpages,
					};
					return result;
				}
				
				return data;
			}
		}

		// If no specific result field found, remove wrapper fields and return the rest
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { responseid, responsestatus, ...cleanedData } = response;
		
		// If there's only one remaining field, extract its value
		const remainingKeys = Object.keys(cleanedData);
		if (remainingKeys.length === 1) {
			return cleanedData[remainingKeys[0]];
		}
		
		// Otherwise return the cleaned object
		return cleanedData;
	}

	// Not a wrapped response, return as-is
	return response;
}

export async function jetNetApiRequestAllItems(
	this: IExecuteFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body?: IDataObject,
	qs?: IDataObject,
): Promise<any> {
	// For paginated endpoints, this would handle fetching all pages
	// For now, just use the regular request
	const response = await jetNetApiRequest.call(this, method, endpoint, body, qs);
	return formatJetNetResponse(response);
}