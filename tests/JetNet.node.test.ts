import { INodeType } from 'n8n-workflow';
import { JetNet } from '../nodes/JetNet/JetNet.node';

describe('JetNet Node', () => {
	let jetNetNode: INodeType;

	beforeEach(() => {
		jetNetNode = new JetNet();
	});

	describe('Node Description', () => {
		it('should have correct basic properties', () => {
			expect(jetNetNode.description.displayName).toBe('JetNet');
			expect(jetNetNode.description.name).toBe('jetNet');
			expect(jetNetNode.description.version).toBe(1);
			expect(jetNetNode.description.group).toEqual(['transform']);
		});

		it('should have credentials configured', () => {
			expect(jetNetNode.description.credentials).toHaveLength(1);
			expect(jetNetNode.description.credentials![0].name).toBe('jetNetApi');
			expect(jetNetNode.description.credentials![0].required).toBe(true);
		});

		it('should have correct inputs and outputs', () => {
			expect(jetNetNode.description.inputs).toEqual(['main']);
			expect(jetNetNode.description.outputs).toEqual(['main']);
		});

		it('should have resource property', () => {
			const resourceProperty = jetNetNode.description.properties.find(
				prop => prop.name === 'resource'
			);
			expect(resourceProperty).toBeDefined();
			expect(resourceProperty?.type).toBe('options');
			expect(resourceProperty?.options).toHaveLength(4);
		});

		it('should have all required resources', () => {
			const resourceProperty = jetNetNode.description.properties.find(
				prop => prop.name === 'resource'
			);
			const resourceNames = resourceProperty?.options?.map((opt: any) => opt.value);
			expect(resourceNames).toContain('aircraft');
			expect(resourceNames).toContain('company');
			expect(resourceNames).toContain('contact');
			expect(resourceNames).toContain('market');
		});
	});

	describe('Aircraft Resource', () => {
		it('should have aircraft operations', () => {
			const operationProperty = jetNetNode.description.properties.find(
				prop => prop.name === 'operation' && prop.displayOptions?.show?.resource?.includes('aircraft')
			);
			expect(operationProperty).toBeDefined();
			expect(operationProperty?.type).toBe('options');
		});

		it('should have required aircraft operations', () => {
			const operationProperty = jetNetNode.description.properties.find(
				prop => prop.name === 'operation' && prop.displayOptions?.show?.resource?.includes('aircraft')
			);
			const operations = operationProperty?.options?.map((opt: any) => opt.value);
			expect(operations).toContain('get');
			expect(operations).toContain('getList');
			expect(operations).toContain('getByRegistration');
		});
	});

	describe('Company Resource', () => {
		it('should have company operations', () => {
			const operationProperty = jetNetNode.description.properties.find(
				prop => prop.name === 'operation' && prop.displayOptions?.show?.resource?.includes('company')
			);
			expect(operationProperty).toBeDefined();
			expect(operationProperty?.type).toBe('options');
		});
	});

	describe('Contact Resource', () => {
		it('should have contact operations', () => {
			const operationProperty = jetNetNode.description.properties.find(
				prop => prop.name === 'operation' && prop.displayOptions?.show?.resource?.includes('contact')
			);
			expect(operationProperty).toBeDefined();
			expect(operationProperty?.type).toBe('options');
		});
	});

	describe('Market Resource', () => {
		it('should have market operations', () => {
			const operationProperty = jetNetNode.description.properties.find(
				prop => prop.name === 'operation' && prop.displayOptions?.show?.resource?.includes('market')
			);
			expect(operationProperty).toBeDefined();
			expect(operationProperty?.type).toBe('options');
		});
	});

	describe('Execute Method', () => {
		it('should have execute method', () => {
			expect(typeof jetNetNode.execute).toBe('function');
		});
	});
});