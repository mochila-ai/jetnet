import {
	ICredentialType,
	INodeProperties,
	ICredentialTestRequest,
} from 'n8n-workflow';

export class JetNetApi implements ICredentialType {
	name = 'jetNetApi';
	displayName = 'JetNet API';
	documentationUrl = 'https://jetnet.com/products/jetnet-api.html';
	properties: INodeProperties[] = [
		{
			displayName: 'Username',
			name: 'username',
			type: 'string',
			default: '',
			required: true,
			placeholder: 'user@example.com',
			description: 'Your JetNet API username (email address)',
		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'Your JetNet API password',
		},
	];

	// Test the credentials by attempting to authenticate
	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://customer.jetnetconnect.com',
			url: '/api/Admin/APILogin',
			method: 'POST',
			body: {
				emailaddress: '={{$credentials.username}}',
				password: '={{$credentials.password}}',
			},
		},
	};
}