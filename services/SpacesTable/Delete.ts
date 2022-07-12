import { DynamoDB } from "aws-sdk";
import { APIGatewayProxyEvent,APIGatewayProxyResult, Context } from "aws-lambda";

const TABLE_NAME = process.env.TABLE_NAME as string;
const PRIMARY_KEY = process.env.PRIMARY_KEY as string;
const dbClient = new DynamoDB.DocumentClient();

const handler = async (event: APIGatewayProxyEvent, context: Context) : Promise<APIGatewayProxyResult> => {

  const result: APIGatewayProxyResult = {
    statusCode: 200,
    body: 'Hello from DynamoDB'
  }

  const primaryValue = event.queryStringParameters?.[PRIMARY_KEY];

  if (primaryValue) {
    try {
      const deleteResult = await dbClient.delete({
        TableName: TABLE_NAME,
        Key: {
          [PRIMARY_KEY]: primaryValue
        }
      }).promise();
      
      result.body = JSON.stringify(deleteResult);
    } catch (error) {
      result.body = JSON.stringify(error);
      
    }
   
  }

  return result;

} 

export { handler };