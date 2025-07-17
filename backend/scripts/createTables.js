const { dynamodb, TABLES } = require('../config/dynamodb');

const createTables = async () => {
  try {
    // 1. Users Table
    await createUsersTable();
    
    // 2. UserProgress Table
    await createUserProgressTable();
    
    // 3. UserSubscriptions Table
    await createUserSubscriptionsTable();
    
    // 4. Levels Table
    await createLevelsTable();
    
    // 5. Content Table
    await createContentTable();
    
    console.log('All tables created successfully!');
  } catch (error) {
    console.error('Error creating tables:', error);
  }
};

const createUsersTable = async () => {
  const params = {
    TableName: TABLES.USERS,
    KeySchema: [
      {
        AttributeName: 'userId',
        KeyType: 'HASH' // Partition key
      }
    ],
    AttributeDefinitions: [
      {
        AttributeName: 'userId',
        AttributeType: 'S'
      },
      {
        AttributeName: 'email',
        AttributeType: 'S'
      },
      {
        AttributeName: 'username',
        AttributeType: 'S'
      }
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'EmailIndex',
        KeySchema: [
          {
            AttributeName: 'email',
            KeyType: 'HASH'
          }
        ],
        Projection: {
          ProjectionType: 'ALL'
        },
        BillingMode: 'PAY_PER_REQUEST'
      },
      {
        IndexName: 'UsernameIndex',
        KeySchema: [
          {
            AttributeName: 'username',
            KeyType: 'HASH'
          }
        ],
        Projection: {
          ProjectionType: 'ALL'
        },
        BillingMode: 'PAY_PER_REQUEST'
      }
    ],
    BillingMode: 'PAY_PER_REQUEST'
  };

  try {
    await dynamodb.createTable(params).promise();
    console.log('Users table created successfully');
  } catch (error) {
    if (error.code === 'ResourceInUseException') {
      console.log('Users table already exists');
    } else {
      throw error;
    }
  }
};

const createUserProgressTable = async () => {
  const params = {
    TableName: TABLES.USER_PROGRESS,
    KeySchema: [
      {
        AttributeName: 'userId',
        KeyType: 'HASH' // Partition key
      },
      {
        AttributeName: 'progressKey',
        KeyType: 'RANGE' // Sort key
      }
    ],
    AttributeDefinitions: [
      {
        AttributeName: 'userId',
        AttributeType: 'S'
      },
      {
        AttributeName: 'progressKey',
        AttributeType: 'S'
      }
    ],
    BillingMode: 'PAY_PER_REQUEST'
  };

  try {
    await dynamodb.createTable(params).promise();
    console.log('UserProgress table created successfully');
  } catch (error) {
    if (error.code === 'ResourceInUseException') {
      console.log('UserProgress table already exists');
    } else {
      throw error;
    }
  }
};

const createUserSubscriptionsTable = async () => {
  const params = {
    TableName: TABLES.USER_SUBSCRIPTIONS,
    KeySchema: [
      {
        AttributeName: 'userId',
        KeyType: 'HASH' // Partition key
      },
      {
        AttributeName: 'subscriptionKey',
        KeyType: 'RANGE' // Sort key
      }
    ],
    AttributeDefinitions: [
      {
        AttributeName: 'userId',
        AttributeType: 'S'
      },
      {
        AttributeName: 'subscriptionKey',
        AttributeType: 'S'
      }
    ],
    BillingMode: 'PAY_PER_REQUEST'
  };

  try {
    await dynamodb.createTable(params).promise();
    console.log('UserSubscriptions table created successfully');
  } catch (error) {
    if (error.code === 'ResourceInUseException') {
      console.log('UserSubscriptions table already exists');
    } else {
      throw error;
    }
  }
};

const createLevelsTable = async () => {
  const params = {
    TableName: TABLES.LEVELS,
    KeySchema: [
      {
        AttributeName: 'levelId',
        KeyType: 'HASH' // Partition key
      }
    ],
    AttributeDefinitions: [
      {
        AttributeName: 'levelId',
        AttributeType: 'S'
      },
      {
        AttributeName: 'category',
        AttributeType: 'S'
      },
      {
        AttributeName: 'levelNumber',
        AttributeType: 'N'
      }
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'CategoryIndex',
        KeySchema: [
          {
            AttributeName: 'category',
            KeyType: 'HASH'
          },
          {
            AttributeName: 'levelNumber',
            KeyType: 'RANGE'
          }
        ],
        Projection: {
          ProjectionType: 'ALL'
        },
        BillingMode: 'PAY_PER_REQUEST'
      }
    ],
    BillingMode: 'PAY_PER_REQUEST'
  };

  try {
    await dynamodb.createTable(params).promise();
    console.log('Levels table created successfully');
  } catch (error) {
    if (error.code === 'ResourceInUseException') {
      console.log('Levels table already exists');
    } else {
      throw error;
    }
  }
};

const createContentTable = async () => {
  const params = {
    TableName: TABLES.CONTENT,
    KeySchema: [
      {
        AttributeName: 'contentId',
        KeyType: 'HASH' // Partition key
      }
    ],
    AttributeDefinitions: [
      {
        AttributeName: 'contentId',
        AttributeType: 'S'
      },
      {
        AttributeName: 'category',
        AttributeType: 'S'
      }
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'CategoryIndex',
        KeySchema: [
          {
            AttributeName: 'category',
            KeyType: 'HASH'
          }
        ],
        Projection: {
          ProjectionType: 'ALL'
        },
        BillingMode: 'PAY_PER_REQUEST'
      }
    ],
    BillingMode: 'PAY_PER_REQUEST'
  };

  try {
    await dynamodb.createTable(params).promise();
    console.log('Content table created successfully');
  } catch (error) {
    if (error.code === 'ResourceInUseException') {
      console.log('Content table already exists');
    } else {
      throw error;
    }
  }
};

// Run the script
if (require.main === module) {
  createTables();
}

module.exports = { createTables };