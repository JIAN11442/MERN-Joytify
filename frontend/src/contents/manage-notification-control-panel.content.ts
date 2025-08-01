import { NotificationTypeOptions } from "@joytify/shared-types/constants";
import { NotificationCountsResponse, NotificationType } from "@joytify/shared-types/types";
import { ScopedFormatMessage } from "../hooks/intl.hook";

type ControlPanelItem = {
  id: string;
  key: NotificationType;
  title: string;
  count: number;
};

export const getManageNotificationControlPanelContent = (
  fm: ScopedFormatMessage,
  notificationCounts: NotificationCountsResponse
): ControlPanelItem[] => {
  const manageNotificationControlPanelFm = fm("manage.notification.controlPanel");
  const { ALL, MONTHLY_STATISTIC, FOLLOWING_ARTIST_UPDATE, SYSTEM_ANNOUNCEMENT } =
    NotificationTypeOptions;

  return [
    {
      id: "manage-notification-control-panel-all",
      key: ALL,
      title: manageNotificationControlPanelFm("all"),
      count: notificationCounts.all ?? 0,
    },
    {
      id: "manage-notification-control-panel-monthly-stats",
      key: MONTHLY_STATISTIC,
      title: manageNotificationControlPanelFm("monthlyStats"),
      count: notificationCounts.monthlyStatistic ?? 0,
    },
    {
      id: "manage-notification-control-panel-artist-updates",
      key: FOLLOWING_ARTIST_UPDATE,
      title: manageNotificationControlPanelFm("artistUpdates"),
      count: notificationCounts.followingArtistUpdate ?? 0,
    },
    {
      id: "manage-notification-control-panel-system-announcements",
      key: SYSTEM_ANNOUNCEMENT,
      title: manageNotificationControlPanelFm("systemAnnouncements"),
      count: notificationCounts.systemAnnouncement ?? 0,
    },
  ];
};
