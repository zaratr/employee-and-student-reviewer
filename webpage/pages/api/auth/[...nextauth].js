
import NextAuth from "next-auth";
import CognitoProvider from "next-auth/providers/cognito";


//this can be inside options in NextAuth method below. I refactored to debug.

let providers = [
    CognitoProvider({
        clientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID,
        clientSecret: process.env.NEXT_PUBLIC_COGNITO_CLIENT_SECRET,
        issuer: process.env.NEXT_PUBLIC_COGNTIO_ISSUER,
        })
]
export default NextAuth({
    providers
})

