import { catalogBatchProcess } from './handler';
import { mockClient } from 'aws-sdk-client-mock';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns'

describe('catalogBatchProcess', () => {
    it('should return correct successful response', async () => {
        const mockEvent = {
            Records: [{
                body: '[{"title":"Product 1","description":"This is product 1","price":2,"count":2}]',
            }],
        }
        const snsClient = new SNSClient({})
        const snsMock = mockClient(snsClient);
        snsMock
            .on(PublishCommand)
            .resolves({
                MessageId: '12345678-1111-2222-3333-111122223333',
            });
        const result = await catalogBatchProcess(mockEvent);
        expect(result.statusCode).toEqual(200);
    });

    it('should return 500  response', async () => {
        const mockEvent = undefined;
        const result = await catalogBatchProcess(mockEvent);
        expect(result.statusCode).toEqual(500);
    });
});