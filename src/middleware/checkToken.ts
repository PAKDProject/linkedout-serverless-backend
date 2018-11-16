import { Request, Response, NextFunction } from "express";
import { ValidateToken, TokenTypes, CheckExpiry } from "../lib/tokenFunc";
import * as jwt from 'jsonwebtoken'
import { IToken } from "../interfaces/IAWSResponse";
import { RefreshTokens } from "../lib/userCheck";

export const CheckAccessToken = async (req: Request, res: Response, next: NextFunction) => {
    let token = req.headers['authorization']

    let isValid = ValidateToken(token, TokenTypes.ACCESS_TOKEN)

    if (!isValid) {
        res.status(403).clearCookie('inf_check').send()
    }
    else {
        let decodedToken = jwt.decode(token)
        let convertedToken = decodedToken as IToken
        const FIFTEEN_MINUTES = 60 * 15

        if ((convertedToken.exp - (Date.now() / 1000)) < FIFTEEN_MINUTES) {
            try {
                let response = await RefreshTokens(token)

                let tokens = {
                    access_token: response.AccessToken,
                    id_token: response.IdToken
                }

                res.header('X-Auth-Tokens', JSON.stringify(tokens))
                next()
            } catch (error) {
                res.status(403).clearCookie('inf_check').send()
                next(error)
            }

        }
        else next()
    }
}