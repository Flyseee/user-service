import {UserService} from "../data-modules/user/user.service";
import {AuthService} from "../data-modules/auth/auth.service";

const userService = new UserService();
const authService = new AuthService(userService);

export {userService, authService};
