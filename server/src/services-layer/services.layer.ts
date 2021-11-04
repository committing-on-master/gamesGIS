import { singleton } from "tsyringe";
import { UsersService } from "./users/users.service"

@singleton()
class ServicesLayer {
    usersService: UsersService;

    constructor(userService: UsersService) {
        this.usersService = userService;
    }
}

export { ServicesLayer };