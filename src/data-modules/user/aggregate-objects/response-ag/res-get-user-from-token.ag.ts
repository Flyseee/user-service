import { JwtPayload } from 'jsonwebtoken';

export class ResGetUserFromTokenAg implements JwtPayload {
    id!: string;
    role!: string;
}