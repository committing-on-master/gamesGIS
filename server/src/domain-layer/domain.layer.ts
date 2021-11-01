import { singleton } from "tsyringe";
import { UsersService } from "./users/users.service"

@singleton()
class DomainLayer {
    usersService: UsersService;

    constructor(userService: UsersService) {
        this.usersService = userService;
    }
}

export { DomainLayer };