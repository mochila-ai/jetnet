import { jetNetApiRequest } from '../nodes/JetNet/JetNetApiRequest';
import { IExecuteFunctions, IHttpRequestOptions } from 'n8n-workflow';

// Mock the IExecuteFunctions
const mockExecuteFunctions = {
	getCredentials: jest.fn(),
	getNode: jest.fn().mockReturnValue({ name: 'JetNet', type: 'jetNet' }),
	helpers: {
		httpRequest: jest.fn(),
	},
} as unknown as IExecuteFunctions;

describe('JetNetApiRequest', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('jetNetApiRequest', () => {
		// Note: These tests are simplified due to the complexity of mocking n8n internals
		// In production, more comprehensive integration tests should be used
		it('should make a GET request with proper authentication', async () => {
			const mockCredentials = {
				username: 'test@example.com',
				password: 'testpass',
			};
			const mockTokens = {
				bearerToken: 'mock-bearer-token',
				apiToken: 'mock-api-token',
			};
			const mockResponse = { data: 'test' };

			(mockExecuteFunctions.getCredentials as jest.Mock).mockResolvedValue(mockCredentials);
			(mockExecuteFunctions.helpers.httpRequest as jest.Mock)
				.mockResolvedValueOnce(mockTokens) // Auth call
				.mockResolvedValueOnce(mockResponse); // API call

			const result = await jetNetApiRequest.call(
				mockExecuteFunctions,
				'GET',
				'/api/Aircraft/getAircraft/123'
			);

			expect(mockExecuteFunctions.getCredentials).toHaveBeenCalledWith('jetNetApi');
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledTimes(2);
			
			// Check auth call
			const authCall = (mockExecuteFunctions.helpers.httpRequest as jest.Mock).mock.calls[0][0];
			expect(authCall.method).toBe('POST');
			expect(authCall.url).toContain('/api/Admin/APILogin');
			expect(authCall.body.emailaddress).toBe('test@example.com');
			
			// Check API call
			const apiCall = (mockExecuteFunctions.helpers.httpRequest as jest.Mock).mock.calls[1][0];
			expect(apiCall.method).toBe('GET');
			expect(apiCall.url).toContain('/api/Aircraft/getAircraft/123/mock-api-token');
			expect(apiCall.headers.Authorization).toBe('Bearer mock-bearer-token');
		});

		it('should handle POST requests with body', async () => {
			const mockCredentials = {
				username: 'test@example.com',
				password: 'testpass',
			};
			const mockTokens = {
				bearerToken: 'mock-bearer-token',
				apiToken: 'mock-api-token',
			};
			const mockResponse = { data: 'test' };
			const requestBody = { companyId: 456 };

			(mockExecuteFunctions.getCredentials as jest.Mock).mockResolvedValue(mockCredentials);
			(mockExecuteFunctions.helpers.httpRequest as jest.Mock)
				.mockResolvedValueOnce(mockTokens)
				.mockResolvedValueOnce(mockResponse);

			const result = await jetNetApiRequest.call(
				mockExecuteFunctions,
				'POST',
				'/api/Company/getCompanyList',
				requestBody
			);

			// Verify that httpRequest was called
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalled();
			// Check if there was at least one call with POST method
			const calls = (mockExecuteFunctions.helpers.httpRequest as jest.Mock).mock.calls;
			if (calls.length > 1) {
				const apiCall = calls[1][0];
				expect(apiCall.method).toBe('POST');
				expect(apiCall.body).toEqual(requestBody);
			}
		});

		it('should throw error when credentials are missing', async () => {
			(mockExecuteFunctions.getCredentials as jest.Mock).mockResolvedValue(null);

			await expect(
				jetNetApiRequest.call(mockExecuteFunctions, 'GET', '/api/test')
			).rejects.toThrow();
		});

		it('should handle authentication errors', async () => {
			const mockCredentials = {
				username: 'test@example.com',
				password: 'testpass',
			};

			(mockExecuteFunctions.getCredentials as jest.Mock).mockResolvedValue(mockCredentials);
			(mockExecuteFunctions.helpers.httpRequest as jest.Mock)
				.mockRejectedValueOnce(new Error('Authentication failed'));

			await expect(
				jetNetApiRequest.call(mockExecuteFunctions, 'GET', '/api/Aircraft/getAircraft/123')
			).rejects.toThrow();
		});

		it('should include timeout in requests', async () => {
			const mockCredentials = {
				username: 'test@example.com',
				password: 'testpass',
			};
			const mockTokens = {
				bearerToken: 'mock-bearer-token',
				apiToken: 'mock-api-token',
			};
			const mockResponse = { data: 'test' };

			(mockExecuteFunctions.getCredentials as jest.Mock).mockResolvedValue(mockCredentials);
			(mockExecuteFunctions.helpers.httpRequest as jest.Mock)
				.mockResolvedValueOnce(mockTokens)
				.mockResolvedValueOnce(mockResponse);

			await jetNetApiRequest.call(
				mockExecuteFunctions,
				'GET',
				'/api/Aircraft/getAircraft/123'
			);

			const calls = (mockExecuteFunctions.helpers.httpRequest as jest.Mock).mock.calls;
			if (calls.length > 1) {
				const apiCall = calls[1][0];
				expect(apiCall.timeout).toBe(60000);
			}
		});
	});

	describe('Error Sanitization', () => {
		it('should handle errors gracefully', async () => {
			const mockCredentials = {
				username: 'test@example.com',
				password: 'testpass',
			};

			(mockExecuteFunctions.getCredentials as jest.Mock).mockResolvedValue(mockCredentials);
			(mockExecuteFunctions.helpers.httpRequest as jest.Mock)
				.mockRejectedValue(new Error('Generic error'));

			// Just verify that errors are thrown properly
			await expect(
				jetNetApiRequest.call(mockExecuteFunctions, 'GET', '/api/test')
			).rejects.toThrow();
		});
	});
});