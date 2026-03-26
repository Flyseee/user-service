import jwt, {JwtPayload, SignOptions} from 'jsonwebtoken';
import {ReqRegisterAg} from "./aggregate-objects/request-ag/req-register.ag";
import bcrypt from 'bcrypt';
import {UserService} from "../user/user.service";
import {User} from "../user/entities/user.entity";
import {ReqLoginAg} from "./aggregate-objects/request-ag/req-login.ag";
import {ResLoginAg} from "./aggregate-objects/response-ag/res-login.ag";
import {ResUserAg} from "../user/aggregate-objects/response-ag/res-user.ag";
import {ResRefreshTokenAg} from "./aggregate-objects/response-ag/res-refresh-token.ag";
import {UnauthorizedError} from "../../common-modules/errors";
import {UserRoles} from "../enums/user-roles.enum";

export class AuthService {
    constructor(private readonly userService: UserService) {}

    async register(registerAg: ReqRegisterAg): Promise<ResUserAg> {
        const hashedPassword: string = await bcrypt.hash(registerAg.password, 10);
        return this.userService.create({
            ...registerAg,
            role: UserRoles.USER,
            password: hashedPassword,
        });
    }

    async login(loginAg: ReqLoginAg): Promise<ResLoginAg> {
        const user: User = await this.userService.getByEmail(loginAg.email);

        const isMatch: boolean = await bcrypt.compare(loginAg.password, user.password);
        if (!isMatch) throw new UnauthorizedError('Invalid credentials');

        const accessToken: string = this.generateAccessToken(user.id, user.role);
        const refreshToken: string = this.generateRefreshToken(user.id);

        const { password: _, ...userWithoutPassword } = user;
        return { accessToken, refreshToken, user: userWithoutPassword };
    }

    refreshToken(token: string): Promise<ResRefreshTokenAg> {
        return new Promise((resolve, reject) => {
            jwt.verify(token, process.env.JWT_REFRESH_SECRET!, (err, decoded) => {
                if (err) return reject(new UnauthorizedError('Invalid refresh token'));

                const payload = decoded as JwtPayload;
                const newAccessToken = this.generateAccessToken(payload.id, payload.role);
                const newRefreshToken = this.generateRefreshToken(payload.id);

                resolve({ accessToken: newAccessToken, refreshToken: newRefreshToken });
            });
        });
    }

    private generateAccessToken(id: string, role: string): string {
        const options: SignOptions = { expiresIn: '15m' };
        return jwt.sign({ id, role }, process.env.JWT_SECRET!, options);
    }

    private generateRefreshToken(id: string): string {
        const options: SignOptions = { expiresIn: '7d' };
        return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET!, options);
    }
}