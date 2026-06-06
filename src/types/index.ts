export type InquiryStatus = '未対応' | '対応中' | '完了' | '保留';
export type InquiryType = '予約相談' | '料金確認' | 'キャンセル' | '変更依頼' | 'サービス内容確認' | 'その他';
export type Priority = '高' | '中' | '低';
export type HandoverStatus = '未確認' | '確認済み';
export type CustomerTag = '新規' | 'リピーター' | 'VIP' | '対応注意';
export type WorkStatus = '稼働中' | '休憩中' | '本日休み' | '停止中';
export type UserRole = 'admin' | 'staff';

export type TemplateCategory =
  | '初回案内'
  | '予約確認'
  | 'キャンセル案内'
  | '料金案内'
  | '営業時間案内'
  | 'お礼'
  | 'その他';

export type HandoverCategory =
  | '問い合わせ対応'
  | '予約関連'
  | '顧客対応'
  | 'システム確認'
  | 'その他';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Inquiry {
  id: string;
  receivedAt: string;
  customerName: string;
  contact: string;
  type: InquiryType;
  status: InquiryStatus;
  priority: Priority;
  assignedStaffId: string;
  content: string;
  memo: string;
  updatedAt: string;
}

export interface ResponseTemplate {
  id: string;
  title: string;
  category: TemplateCategory;
  body: string;
  usageCount: number;
  updatedAt: string;
}

export interface Handover {
  id: string;
  createdAt: string;
  createdById: string;
  targetStaffId: string;
  category: HandoverCategory;
  priority: Priority;
  subject: string;
  body: string;
  status: HandoverStatus;
  relatedCustomerName: string;
  relatedInquiryId: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  inquiryCount: number;
  lastInquiryDate: string;
  tags: CustomerTag[];
  memo: string;
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  email: string;
  workStatus: WorkStatus;
  todayCount: number;
  monthCount: number;
}

export interface Settings {
  businessName: string;
  businessHours: string;
  closedDays: string;
  notificationEmail: string;
  targetResponseTime: number;
  autoReplyTemplateId: string;
  itemsPerPage: number;
}
