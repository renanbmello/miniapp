// import { GET } from '../route';
// import { JsonService } from '@/lib/services';
// import { NextResponse } from 'next/server';

// // Mock do JsonService
// jest.mock('@/lib/services', () => ({
//   JsonService: {
//     readJson: jest.fn(),
//   },
// }));

// describe('Proposals API', () => {
//   beforeEach(() => {
//     // Limpa todos os mocks antes de cada teste
//     jest.clearAllMocks();
//   });

//   it('should return proposals successfully', async () => {
//     // Mock data
//     const mockProposals = {
//       data: {
//         proposals: [
//           {
//             id: '1',
//             title: 'Test Proposal',
//             body: 'Test Body',
//             author: '0x123',
//             state: 'open',
//             votes: 10
//           }
//         ]
//       }
//     };

//     // Configure o mock para retornar os dados
//     (JsonService.readJson as jest.Mock).mockResolvedValue(mockProposals);

//     // Execute a função
//     const response = await GET();
//     const responseData = await response.json();

//     // Verificações
//     expect(JsonService.readJson).toHaveBeenCalledWith('proposals.json');
//     expect(responseData).toEqual({
//       data: mockProposals.data,
//       success: true
//     });
//   });

//   it('should handle errors appropriately', async () => {
//     // Simula um erro
//     const mockError = new Error('Failed to read file');
//     (JsonService.readJson as jest.Mock).mockRejectedValue(mockError);

//     // Execute a função
//     const response = await GET();
//     const responseData = await response.json();

//     // Verificações
//     expect(JsonService.readJson).toHaveBeenCalledWith('proposals.json');
//     expect(response.status).toBe(500);
//     expect(responseData).toEqual({
//       error: mockError
//     });
//   });

//   it('should return empty proposals array when no data is found', async () => {
//     // Mock retornando dados vazios
//     (JsonService.readJson as jest.Mock).mockResolvedValue({
//       data: {
//         proposals: []
//       }
//     });

//     // Execute a função
//     const response = await GET();
//     const responseData = await response.json();

//     // Verificações
//     expect(JsonService.readJson).toHaveBeenCalledWith('proposals.json');
//     expect(responseData).toEqual({
//       data: {
//         proposals: []
//       },
//       success: true
//     });
//   });
// });

import { NextRequest } from 'next/server';
import { JsonRpcProvider, Block } from 'ethers';
import { POST } from '../route';
// import fs from 'fs';

// Mock data para testes
// const mockData = {
//     data: {
//         proposals: [
//             {
//                 id: '0x123',
//                 title: 'Test Proposal',
//                 body: 'Test Body',
//                 author: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
//                 state: 'open',
//                 votes: 10,
//                 space: {
//                     id: 'test.eth',
//                     name: 'Test DAO'
//                 }
//             }
//         ]
//     }
// };

// Mock the external dependencies
jest.mock('ethers', () => {
    const actualEthers = jest.requireActual('ethers');
    return {
        ...actualEthers,
        JsonRpcProvider: jest.fn(),
        Contract: jest.fn(),
        isAddress: jest.fn((address) => address.startsWith('0x') && address.length === 42),
    };
});

jest.mock('limiter', () => ({
    RateLimiter: jest.fn().mockImplementation(() => ({
        tryRemoveTokens: jest.fn().mockResolvedValue(true),
        removeTokens: jest.fn().mockResolvedValue(true)
    }))
}));

// jest.mock('fs', () => ({
//     promises: {
//         readFile: jest.fn().mockImplementation(() => Promise.resolve(Buffer.from(JSON.stringify(mockData))))
//     }
// }));

describe('Proposals API Route', () => {
    const mockValidAddress = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
    let mockProvider: any;
    let mockContract: any;
    let Contract: any;

    beforeEach(() => {
        jest.clearAllMocks();
        
        mockContract = {
            proposals: jest.fn().mockResolvedValue({
                description: 'Test Proposal',
                votingDeadline: { toNumber: () => 1000000 },
                yea: { toNumber: () => 100 },
                nay: { toNumber: () => 50 }
            }),
            getProposal: jest.fn().mockRejectedValue(new Error('Not implemented'))
        };

        // Reset provider mock implementation
        mockProvider = {
            getBlockNumber: jest.fn().mockResolvedValue(1000),
            getBlock: jest.fn().mockResolvedValue({
                number: 1000,
                transactions: [{
                    hash:'0x123',
                    from: mockValidAddress,
                    to: '0x456',
                    data: '0x668f6e'
                }]
            }),
            // getTransaction: jest.fn().mockResolvedValue({
            //     hash: '0x123',
            //     from: mockValidAddress,
            //     to: '0x456',
            //     data: '0x668f6e'
            // })
        };
        
        ({ Contract } = jest.requireMock('ethers'));
        Contract.mockImplementation(() => mockContract);
        (JsonRpcProvider as jest.Mock).mockImplementation(() => mockProvider);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should handle valid address and return proposal data', async () => {
        const request = new NextRequest(
            new Request('http://localhost:3000/api/proposals', {
                method: 'POST',
                body: JSON.stringify({ userAddress: mockValidAddress }),
            })
        );

        // const mockContract = {
        //     proposals: jest.fn().mockResolvedValue({
        //         description: 'Test Proposal',
        //         votingDeadline: { toNumber: () => 1000000 },
        //         yea: { toNumber: () => 100 },
        //         nay: { toNumber: () => 50 }
        //     })
        // };
        
        // (JsonRpcProvider as jest.Mock).mockImplementation(() => mockProvider);
        // const { Contract } = require('ethers');
        // Contract.mockImplementation(() => mockContract);

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
        expect(data.proposalContracts).toBeDefined();
        expect(data.metadata).toEqual(
            expect.objectContaining({
                blocksScanned: expect.any(Number),
                transactionsFound: expect.any(Number),
                contractsAnalyzed: expect.any(Number),
            })
        );
    }); 

    it('should reject invalid ethereum addresses', async () => {
        const request = new NextRequest(
            new Request('http://localhost:3000/api/proposals', {
                method: 'POST',
                body: JSON.stringify({ userAddress: 'invalid-address' }),
            })
        );

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.success).toBe(false);
        expect(data.error).toBe('Invalid Ethereum address provided');
    });

    it('should handle provider errors gracefully', async () => {
        mockProvider.getBlockNumber.mockRejectedValueOnce(new Error('Provider error'));

        const request = new NextRequest(
            new Request('http://localhost:3000/api/proposals', {
                method: 'POST',
                body: JSON.stringify({ userAddress: mockValidAddress }),
            })
        );

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(500);
        expect(data.success).toBe(false);
        expect(data.error).toBe('Provider error');
    });

    it('should handle empty blocks', async () => {

        Contract.mockImplementation(() => ({
            proposals: jest.fn().mockRejectedValue(new Error('Not a proposal')),
            getProposal: jest.fn().mockRejectedValue(new Error('Not a proposal'))
        }));

        mockProvider.getBlock.mockResolvedValueOnce({
            number: 1000,
            transactions: [{
                hash: '0x123',
                from: mockValidAddress,
                to: '0x456',
                data: '0x00000000' // Non-matching signature
            }],
        });

        const request = new NextRequest(
            new Request('http://localhost:3000/api/proposals', {
                method: 'POST',
                body: JSON.stringify({ userAddress: mockValidAddress }),
            })
        );

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
        // expect(Array.isArray(data.proposalContracts)).toBe(true);
        expect(data.proposalContracts).toHaveLength(0);
    });

    it('should handle missing request body', async () => {
        const request = new NextRequest(
            new Request('http://localhost:3000/api/proposals', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                // body: JSON.stringify({}),
            })
        );

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.success).toBe(false);
        expect(data.error).toBe('Invalid JSON payload');
    });
});
