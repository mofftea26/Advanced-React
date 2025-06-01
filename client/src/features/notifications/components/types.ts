import { Notification } from "@advanced-react/server/database/schema";

export type NotificationWithContent = Notification & { content: string };
export type NotificationForList = NotificationWithContent;
