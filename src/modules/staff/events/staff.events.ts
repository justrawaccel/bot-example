import type { Logger } from "pino";
import type { EventBus } from "../../../app/event-bus";
import { AppEventKeys } from "../../../app/events/keys";

export function registerStaffEvents(bus: EventBus, logger: Logger) {
  bus.on(AppEventKeys.StaffUserBanned, async (payload) => {
    logger.info({ payload }, "event staff.user.banned");
  });
}
