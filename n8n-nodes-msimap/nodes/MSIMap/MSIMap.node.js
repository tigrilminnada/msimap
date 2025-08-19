const { quickLoginCheck, quickInboxCount, quickSearch } = require('msimap-pro');

class MSIMap {
    description = {
        displayName: 'MSIMap',
        name: 'msimap',
        icon: 'file:msimap.svg',
        group: ['communication'],
        version: 1,
        subtitle: '={{$parameter["operation"]}}',
        description: 'Professional IMAP email validation and mass checking',
        defaults: {
            name: 'MSIMap',
        },
        inputs: ['main'],
        outputs: ['main'],
        credentials: [],
        properties: [
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Login Check',
                        value: 'loginCheck',
                        description: 'Validate email credentials',
                        action: 'Check email login credentials',
                    },
                    {
                        name: 'Inbox Count',
                        value: 'inboxCount',
                        description: 'Get inbox statistics',
                        action: 'Get inbox count and statistics',
                    },
                    {
                        name: 'Keyword Search',
                        value: 'keywordSearch',
                        description: 'Search emails by keyword',
                        action: 'Search emails for specific keywords',
                    },
                ],
                default: 'loginCheck',
            },
            {
                displayName: 'Email',
                name: 'email',
                type: 'string',
                default: '',
                placeholder: 'user@example.com',
                description: 'The email address to validate',
                required: true,
            },
            {
                displayName: 'Password',
                name: 'password',
                type: 'string',
                typeOptions: {
                    password: true,
                },
                default: '',
                description: 'The password for the email account',
                required: true,
            },
            {
                displayName: 'Keyword',
                name: 'keyword',
                type: 'string',
                default: '',
                placeholder: 'invoice',
                description: 'Keyword to search for in emails',
                displayOptions: {
                    show: {
                        operation: ['keywordSearch'],
                    },
                },
                required: true,
            },
        ],
    };

    async execute() {
        const items = this.getInputData();
        const returnData = [];
        const operation = this.getNodeParameter('operation', 0);

        for (let i = 0; i < items.length; i++) {
            try {
                const email = this.getNodeParameter('email', i);
                const password = this.getNodeParameter('password', i);

                let result;

                switch (operation) {
                    case 'loginCheck':
                        result = await quickLoginCheck(email, password);
                        break;
                    
                    case 'inboxCount':
                        result = await quickInboxCount(email, password);
                        break;
                    
                    case 'keywordSearch':
                        const keyword = this.getNodeParameter('keyword', i);
                        result = await quickSearch(email, password, keyword);
                        break;
                    
                    default:
                        throw new Error(`Unknown operation: ${operation}`);
                }

                returnData.push({
                    json: {
                        operation,
                        email,
                        ...result,
                        timestamp: new Date().toISOString(),
                    },
                });
            } catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({
                        json: {
                            error: error.message,
                            email: this.getNodeParameter('email', i),
                            operation,
                        },
                    });
                    continue;
                }
                throw error;
            }
        }

        return [returnData];
    }
}

module.exports = { nodeTypes: { MSIMap } };
