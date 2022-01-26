import {UsersDAO} from "../../src/data-layer/models/users.dao";
import {PermissionFlag} from "../../src/services-layer/users/models/permission.flag";

const userAdmin = new UsersDAO();
userAdmin.email = "tarkov@gachi.com";
userAdmin.name = "Billy Harington";
userAdmin.permissionFlag = PermissionFlag.ADMIN_PERMISSION | PermissionFlag.REGISTERED_USER | PermissionFlag.APPROVED_USER;

// password: password
userAdmin.passwordHash = "$argon2i$v=19$m=4096,t=3,p=1$6nf1uB9/1fBANz3DKoMc3w$aY6EXMUhOeXWOwKa1z4uq4GvNmJ11FQGPCv2hdlT/ys";

export {userAdmin};
