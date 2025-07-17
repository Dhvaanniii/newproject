const { docClient, TABLES } = require('../config/dynamodb');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

class User {
  static async create(userData) {
    const userId = `USER#${uuidv4()}`;
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    const user = {
      userId,
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
      realname: userData.realname,
      language: userData.language,
      school: userData.school,
      standard: userData.standard,
      board: userData.board,
      country: userData.country,
      state: userData.state,
      city: userData.city,
      coins: 100, // Starting coins
      userType: 'user',
      createdAt: new Date().toISOString(),
      lastLogin: null
    };

    const params = {
      TableName: TABLES.USERS,
      Item: user,
      ConditionExpression: 'attribute_not_exists(userId)'
    };

    try {
      await docClient.put(params).promise();
      // Remove password from returned user
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      throw error;
    }
  }

  static async findByEmail(email) {
    const params = {
      TableName: TABLES.USERS,
      IndexName: 'EmailIndex',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email
      }
    };

    try {
      const result = await docClient.query(params).promise();
      return result.Items[0] || null;
    } catch (error) {
      throw error;
    }
  }

  static async findByUsername(username) {
    const params = {
      TableName: TABLES.USERS,
      IndexName: 'UsernameIndex',
      KeyConditionExpression: 'username = :username',
      ExpressionAttributeValues: {
        ':username': username
      }
    };

    try {
      const result = await docClient.query(params).promise();
      return result.Items[0] || null;
    } catch (error) {
      throw error;
    }
  }

  static async findById(userId) {
    const params = {
      TableName: TABLES.USERS,
      Key: { userId }
    };

    try {
      const result = await docClient.get(params).promise();
      return result.Item || null;
    } catch (error) {
      throw error;
    }
  }

  static async updateLastLogin(userId) {
    const params = {
      TableName: TABLES.USERS,
      Key: { userId },
      UpdateExpression: 'SET lastLogin = :lastLogin',
      ExpressionAttributeValues: {
        ':lastLogin': new Date().toISOString()
      }
    };

    try {
      await docClient.update(params).promise();
    } catch (error) {
      throw error;
    }
  }

  static async updateCoins(userId, coins) {
    const params = {
      TableName: TABLES.USERS,
      Key: { userId },
      UpdateExpression: 'ADD coins :coins',
      ExpressionAttributeValues: {
        ':coins': coins
      }
    };

    try {
      await docClient.update(params).promise();
    } catch (error) {
      throw error;
    }
  }

  static async updateProfile(userId, updateData) {
    const updateExpression = [];
    const expressionAttributeValues = {};
    
    Object.keys(updateData).forEach(key => {
      if (key !== 'userId' && key !== 'password') {
        updateExpression.push(`${key} = :${key}`);
        expressionAttributeValues[`:${key}`] = updateData[key];
      }
    });

    const params = {
      TableName: TABLES.USERS,
      Key: { userId },
      UpdateExpression: `SET ${updateExpression.join(', ')}`,
      ExpressionAttributeValues: expressionAttributeValues
    };

    try {
      await docClient.update(params).promise();
    } catch (error) {
      throw error;
    }
  }

  static async getAllUsers() {
    const params = {
      TableName: TABLES.USERS
    };

    try {
      const result = await docClient.scan(params).promise();
      return result.Items.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
    } catch (error) {
      throw error;
    }
  }

  static async validatePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = User;