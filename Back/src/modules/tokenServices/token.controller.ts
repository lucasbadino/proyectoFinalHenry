import { Body, Controller, HttpStatus, Param, ParseUUIDPipe, Post, Res } from "@nestjs/common";
import { Response } from "express";
import { TokenService } from "./token.service";

@Controller('token')
export class TokenController {
    constructor(private readonly tokenService: TokenService) { }


    @Post('check/:id')
    async checkToken(@Body() body, @Param('id', new ParseUUIDPipe()) id: string, @Res() res: Response) {
        console.log(body, 'body', id, 'id');

        try {
            const check = await this.tokenService.checkToken(body, id);
            return res.status(HttpStatus.OK).send(check);
        } catch (error) {
            return res.status(HttpStatus.NOT_FOUND).send(error);

        }
    }
}