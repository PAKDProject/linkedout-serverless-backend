import { CognitoUserPool, AuthenticationDetails, CognitoUser, CognitoUserAttribute } from 'amazon-cognito-identity-js';
import * as AWS from 'aws-sdk'
import { config } from "dotenv";
import { error } from '../helpers/logger';

export let LoginUser = (Username: string, Password: string): string => {
    const userPool: CognitoUserPool = new CognitoUserPool({ UserPoolId: process.env.POOL_ID, ClientId: process.env.APP_CLIENT_ID })
    let auth: AuthenticationDetails = new AuthenticationDetails({
        Username,
        Password
    })
    let cognitoUser: CognitoUser = new CognitoUser({
        Username,
        Pool: userPool
    })

    cognitoUser.authenticateUser(auth, {
        onSuccess: (result) => {
            const jwt = result.getAccessToken().getJwtToken()

            return jwt;
        },
        onFailure: (result) => {
            error(result.message)
            return null;
        }
    })

    return
}

export let RegisterUser = (email: string, password: string, firstName: string, surname: string): any => {
    const userPool: CognitoUserPool = new CognitoUserPool({ UserPoolId: process.env.POOL_ID, ClientId: process.env.APP_CLIENT_ID })
    let registrationAttr: CognitoUserAttribute[] = [
        new CognitoUserAttribute({
            Name: 'email',
            Value: email
        }),
        new CognitoUserAttribute({
            Name: 'name',
            Value: firstName
        }),
        new CognitoUserAttribute({
            Name: 'family_name',
            Value: surname
        })
    ]

    userPool.signUp(email, password, registrationAttr, null, (err, result) => {
        if (err)
            return err
        else
            return true
    })

    return
}

export let ConfirmRegistration = (Username: string, confirmationCode: string) => {
    const userPool: CognitoUserPool = new CognitoUserPool({ UserPoolId: process.env.POOL_ID, ClientId: process.env.APP_CLIENT_ID })
    const cognitoUser: CognitoUser = new CognitoUser({
        Username,
        Pool: userPool
    })

    cognitoUser.confirmRegistration(confirmationCode, true, (err, results) => {
        if(err)
            return err
        else
            return 
    })   
    return
}