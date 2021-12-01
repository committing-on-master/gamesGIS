import {singleton} from "tsyringe";
import {AgreementsService} from "./agreements/agreements.service";
import {UsersService} from "./users/users.service";

@singleton()
class ServicesLayer {
    private readonly usersService: UsersService;
    private readonly agreementsService: AgreementsService;

    constructor(userService: UsersService,
        agreementService: AgreementsService) {
        this.usersService = userService;
        this.agreementsService = agreementService;
    }

    public get Agreements() : AgreementsService {
        return this.agreementsService;
    }

    public get Users(): UsersService {
        return this.usersService;
    }
}

export {ServicesLayer};
