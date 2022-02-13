import {singleton} from "tsyringe";
import {AgreementsService} from "./agreements/agreements.service";
import {MapProfileService} from "./map-profile/map.profile.service";
import {UsersService} from "./users/users.service";

@singleton()
class ServicesLayer {
    private readonly usersService: UsersService;
    private readonly agreementsService: AgreementsService;
    private readonly mapProfileService: MapProfileService;

    constructor(userService: UsersService,
        agreementService: AgreementsService,
        mapProfileService: MapProfileService) {
        this.usersService = userService;
        this.agreementsService = agreementService;
        this.mapProfileService = mapProfileService;
    }

    public get Agreements() : AgreementsService {
        return this.agreementsService;
    }

    public get Users(): UsersService {
        return this.usersService;
    }

    public get MapProfiles(): MapProfileService {
        return this.mapProfileService;
    }
}

export {ServicesLayer};
