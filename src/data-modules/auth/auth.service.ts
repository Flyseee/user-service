import jwt, {JwtPayload, SignOptions} from 'jsonwebtoken';
import {ReqRegisterAg} from "./aggregate-objects/request-ag/req-register.ag";
import bcrypt from 'bcrypt';
import {UserService} from "../user/user.service";
import {User} from "../user/entities/user.entity";
import {ReqLoginAg} from "./aggregate-objects/request-ag/req-login.ag";
import {ResLoginAg} from "./aggregate-objects/response-ag/res-login.ag";
import {ResRegisterAg} from "./aggregate-objects/response-ag/res-register.ag";
import {ResRefreshTokenAg} from "./aggregate-objects/response-ag/res-refresh-token.ag";
import {UnauthorizedError} from "../../common-modules/errors";

export class AuthService {
    constructor(private readonly userService: UserService) {}
    async register(registerAg: ReqRegisterAg): Promise<ResRegisterAg> {
        try {
            const hashedPassword: string = await bcrypt.hash(registerAg.password, 10);
            return await this.userService.create({...registerAg, password: hashedPassword});
        } catch (error) {
            throw error;
        }
    }

    async login(loginAg: ReqLoginAg): Promise<ResLoginAg> {
        try {
            const user: User = await this.userService.getByEmail(loginAg.email);

            const isMatch: boolean = await bcrypt.compare(loginAg.password, user.password)
            if (!isMatch) throw new UnauthorizedError('Invalid credentials');

            const accessToken: string = this.generateAccessToken(user.id, user.role);
            const refreshToken: string = this.generateRefreshToken(user.id);
            return { accessToken, refreshToken, user };
        } catch (error) {
            throw error;
        }
    }

    refreshToken(token: string): Promise<ResRefreshTokenAg> {
        return new Promise((resolve, reject) => {
            jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
                if (err) reject(new UnauthorizedError('Invalid access token'));

                const userPayload = user as JwtPayload;
                const newAccessToken = this.generateAccessToken(userPayload.id, userPayload.role);
                const newRefreshToken = this.generateRefreshToken(userPayload.id);

                resolve({ accessToken: newAccessToken, refreshToken: newRefreshToken });
            });
        });
    };

    private generateAccessToken(id: string, role: string): string {
        const expiresIn = "15m";
        const options: SignOptions = { expiresIn };

        return jwt.sign({ id, role }, process.env.JWT_SECRET!, options);
    }

    private generateRefreshToken(id: string): string {
        const expiresIn = "7d";
        const options: SignOptions = { expiresIn };

        return jwt.sign({ id }, process.env.JWT_SECRET!, options);
    }
}