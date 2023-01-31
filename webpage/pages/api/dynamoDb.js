//import {addToQueue, deleteFromQueue, getQuery} from './dynamodb_crud'
import {DynamoDBClient, PutItemCommand, GetItemCommand, UpdateItemCommand, DeleteItemCommand, AttributeValueUpdate} from '@aws-sdk/client-dynamodb';


const client = new DynamoDBClient({
    credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_DYNAMODB_ACCESS_KEY,
        secretAccessKey: process.env.NEXT_PUBLIC_DYNAMODB_SECRET_KEY
    },
    region: process.env.NEXT_PUBLIC_DYNAMODB_REGION
});


export default async function handler(req , res) {
    let result;
    let obj;
    let requester;
    let { uniqueEmail, userType, queue, action} = req.query;
    if(req.body !== "")
    {
        obj = JSON.parse(req.body);
        requester = obj.action;
        uniqueEmail = obj.uniqueEmail;
        userType = obj.userType;
        //TODO: create a queue instead of array
        queue = ['newItem1', 'test'];
        //queue.pop()
        //queue.push(obj.newItemForQueue)


    }
    else
        requester = action;

    switch(requester) {
        case 'PUT':
            queue.unshift(obj.newItemForQueue);
            await putItemAttribute(uniqueEmail, userType, queue);
            res.status(200).json({message: `Item added to queue successfully.`, success:true});
            return res;
        case 'DELETE-QUEUE-ELEM':
            queue.pop();
            await deleteQueueElement(uniqueEmail, userType, queue);
            res.status(200).json({message: `Element removed from queue`})
            return res;
        case 'DELETE-ITEM':
            await deleteItem(uniqueEmail, userType);
            res.status(200).json({message: `Item deleted from table successfully.`, success:true});
            return res;
        case 'GET':
            queue = await getItem(uniqueEmail, userType);
            res.status(200).json({message: JSON.parse(JSON.stringify(queue))});
            return res;
        case 'POST':
            queue.unshift(obj.newItemForQueue);
            result = await updateItemAttribute(uniqueEmail, userType, queue);
            res.status(200).json({message: `Retrieved query: ${result}`, success:true});
            return result;
        default:
            res.status(404).json({message: `Invalid action: ${action}`});
    }
}



async function getItem(email, userType) {
    const params = {
        TableName: 'fairQueue',
        Key: {
            uniqueEmailKey: { S: email },
            userType: { S: userType }
        }
    };
    try {
        const { Item } = await client.send(new GetItemCommand( params));
        //TODO: handle when Item is indefined - all items/attributes dne
        return Item.queue.L;
    } catch (error) {
        console.error(error.name)
        console.error(error.message)
        throw new Error(error);
    }
}

async function putItemAttribute(email, userType, queue){
    const params = {
        TableName: 'fairQueue',
        Item: {
            uniqueEmailKey: {S: email},
            userType: { S: userType},
            queue: {L: queue.map((name) => ({S: name}))}
        }
    };

    try {
        const { Item } = await client.send( new PutItemCommand(params));
        console.log( `Item added to queue successfully.` );
    } catch (error) {

        console.error(error.name);
        console.error(error.message);
        throw new Error(error);

    }
}

async function updateItemAttribute(email, userType, queue) {
    const params = {
        TableName: 'fairQueue',
        Key: {
            uniqueEmailKey: { S: email },
            userType: { S: userType }
        },
        UpdateExpression: 'SET queue = :q',
        ExpressionAttributeValues: {
            ':q': { L: queue }
        },
        ReturnValues: 'ALL_NEW'
    };
    try {
        const { Attributes } = await client.send(
            new UpdateItemCommand(params)
        );

        console.log(`Item added to queue successfully.`);
        return Attributes
    } catch (error) {
        console.error(error.name);
        console.error(error.message);
        throw new Error(error);
    }
}


async function deleteItem(email, userType) {
    const params = {
        TableName: 'fairQueue',
        Key: {
            uniqueEmailKey: { S: email },
            userType: { S: userType }
        }
    };
    try {
        await client.send(
            new DeleteItemCommand(params)
        );

        console.log("successfully deleted item")
    } catch (error) {
        console.error(error.errorStackTrace);
        console.error(error.name);
        console.error(error.message);
        throw new Error(error);
    }
}

async function deleteQueueElement(email, userType, queue){
    const params = {
        TableName: 'fairQueue',
        Key: {
            uniqueEmailKey: { S: email },
            userType: { S: userType }
        },
        UpdateExpression: 'SET queue = :q',
        ExpressionAttributeValues: {
            ':q': {L: queue.map((name) => ({S: name}))}
        },
        ReturnValues: 'ALL_NEW'
    };

    try{
    await client.send(new UpdateItemCommand(params));
        console.log("Successfully removed item from queue");
    } catch (error) {
        console.error(error.name);
        console.error(error.message);
        throw new Error(error);
    }
}

