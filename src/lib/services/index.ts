import { accountService } from "./accountService";
import { connectionGroupService } from "./connectionGroupService";
import { connectionService } from "./connectionService";
import { traitService } from "./traitService";

export const services = {
  accounts: accountService,
  connections: connectionService,
  groups: connectionGroupService,
  traits: traitService,
};
