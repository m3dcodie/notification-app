export interface Notification {
  notification_id: string;
  fk_user_id: string;
  channel: string;
  status: string;
  sent_at: string;
  delivered_at: string;
  error_message?: string;
  retry_count: number;
}
