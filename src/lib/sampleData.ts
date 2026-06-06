import type {
  User,
  Inquiry,
  ResponseTemplate,
  Handover,
  Customer,
  Staff,
  Settings,
} from '@/types';

const today = '2026-06-06';
const yesterday = '2026-06-05';
const twoDaysAgo = '2026-06-04';
const thisWeek1 = '2026-06-03';
const thisWeek2 = '2026-06-02';
const lastMonth1 = '2026-05-28';
const lastMonth2 = '2026-05-20';
const lastMonth3 = '2026-05-15';

export const sampleStaff: Staff[] = [
  { id: 's001', name: '佐藤 美咲', role: '管理者', email: 'admin@example.com', workStatus: '稼働中', todayCount: 8, monthCount: 52 },
  { id: 's002', name: '田中 翔', role: 'スタッフ', email: 'staff@example.com', workStatus: '稼働中', todayCount: 6, monthCount: 41 },
  { id: 's003', name: '鈴木 彩', role: 'スタッフ', email: 'suzuki@example.com', workStatus: '休憩中', todayCount: 4, monthCount: 38 },
  { id: 's004', name: '高橋 健太', role: 'スタッフ', email: 'takahashi@example.com', workStatus: '本日休み', todayCount: 0, monthCount: 29 },
  { id: 's005', name: '山本 葵', role: 'スタッフ', email: 'yamamoto@example.com', workStatus: '稼働中', todayCount: 5, monthCount: 35 },
];

export const sampleCustomers: Customer[] = [
  { id: 'c001', name: '山田 太郎', phone: '090-1234-5678', email: 'yamada@example.com', inquiryCount: 5, lastInquiryDate: today, tags: ['リピーター'], memo: '丁寧な対応を好まれる' },
  { id: 'c002', name: '佐々木 花子', phone: '080-2345-6789', email: 'sasaki@example.com', inquiryCount: 12, lastInquiryDate: today, tags: ['VIP', 'リピーター'], memo: '優先対応が必要なお客様' },
  { id: 'c003', name: '中村 翔太', phone: '070-3456-7890', email: 'nakamura@example.com', inquiryCount: 1, lastInquiryDate: yesterday, tags: ['新規'], memo: '' },
  { id: 'c004', name: '小林 優子', phone: '090-4567-8901', email: 'kobayashi@example.com', inquiryCount: 3, lastInquiryDate: yesterday, tags: ['対応注意'], memo: '過去にクレームあり。丁寧な対応を心がける' },
  { id: 'c005', name: '加藤 直樹', phone: '080-5678-9012', email: 'kato@example.com', inquiryCount: 7, lastInquiryDate: twoDaysAgo, tags: ['リピーター'], memo: '' },
  { id: 'c006', name: '渡辺 美穂', phone: '070-6789-0123', email: 'watanabe@example.com', inquiryCount: 2, lastInquiryDate: thisWeek1, tags: ['新規'], memo: '初回問い合わせは2週間前' },
  { id: 'c007', name: '伊藤 健', phone: '090-7890-1234', email: 'ito@example.com', inquiryCount: 9, lastInquiryDate: lastMonth1, tags: ['VIP', 'リピーター'], memo: '長期利用のお客様' },
  { id: 'c008', name: '松本 愛', phone: '080-8901-2345', email: 'matsumoto@example.com', inquiryCount: 4, lastInquiryDate: lastMonth2, tags: ['リピーター'], memo: '' },
];

export const sampleInquiries: Inquiry[] = [
  {
    id: 'INQ-001', receivedAt: `${today}T09:15:00`, customerName: '山田 太郎', contact: '090-1234-5678',
    type: '予約相談', status: '未対応', priority: '高', assignedStaffId: 's002',
    content: '来週の予約を希望しています。平日の午前中で空きはありますか？できれば火曜か水曜でお願いしたいです。',
    memo: '', updatedAt: `${today}T09:15:00`,
  },
  {
    id: 'INQ-002', receivedAt: `${today}T10:30:00`, customerName: '佐々木 花子', contact: 'sasaki@example.com',
    type: '料金確認', status: '対応中', priority: '中', assignedStaffId: 's001',
    content: 'プレミアムプランの料金詳細を教えてください。また、複数名での利用の場合の割引はありますか？',
    memo: '料金表をメールで送付済み。割引については確認中。', updatedAt: `${today}T11:00:00`,
  },
  {
    id: 'INQ-003', receivedAt: `${today}T11:45:00`, customerName: '中村 翔太', contact: '070-3456-7890',
    type: 'キャンセル', status: '未対応', priority: '高', assignedStaffId: '',
    content: '明日予約していたサービスをキャンセルしたいです。急な予定が入ってしまいました。',
    memo: '', updatedAt: `${today}T11:45:00`,
  },
  {
    id: 'INQ-004', receivedAt: `${today}T13:00:00`, customerName: '小林 優子', contact: 'kobayashi@example.com',
    type: '変更依頼', status: '対応中', priority: '中', assignedStaffId: 's003',
    content: '今月15日の予約を20日に変更したいのですが可能でしょうか。',
    memo: '20日の空き状況を確認中。', updatedAt: `${today}T13:30:00`,
  },
  {
    id: 'INQ-005', receivedAt: `${today}T14:20:00`, customerName: '加藤 直樹', contact: '080-5678-9012',
    type: 'サービス内容確認', status: '完了', priority: '低', assignedStaffId: 's005',
    content: 'ベーシックプランとスタンダードプランの違いを詳しく教えてください。',
    memo: '各プランの詳細をご案内済み。ご満足いただけた模様。', updatedAt: `${today}T15:00:00`,
  },
  {
    id: 'INQ-006', receivedAt: `${today}T16:00:00`, customerName: '渡辺 美穂', contact: '070-6789-0123',
    type: 'その他', status: '未対応', priority: '低', assignedStaffId: '',
    content: '領収書の再発行をお願いしたいです。先月分の領収書が見当たりません。',
    memo: '', updatedAt: `${today}T16:00:00`,
  },
  {
    id: 'INQ-007', receivedAt: `${yesterday}T09:00:00`, customerName: '伊藤 健', contact: 'ito@example.com',
    type: '予約相談', status: '完了', priority: '中', assignedStaffId: 's002',
    content: '定期利用の割引プランについて相談したいです。毎月2〜3回利用しています。',
    memo: '定期割引プランをご案内。来月から適用することになりました。', updatedAt: `${yesterday}T10:30:00`,
  },
  {
    id: 'INQ-008', receivedAt: `${yesterday}T11:30:00`, customerName: '松本 愛', contact: '080-8901-2345',
    type: '料金確認', status: '保留', priority: '中', assignedStaffId: 's001',
    content: '年間契約の場合の料金を教えてください。また、途中解約の場合のキャンセルポリシーも確認したいです。',
    memo: '詳細確認のため上長に確認中。回答待ち。', updatedAt: `${yesterday}T14:00:00`,
  },
  {
    id: 'INQ-009', receivedAt: `${yesterday}T14:00:00`, customerName: '山田 太郎', contact: '090-1234-5678',
    type: 'キャンセル', status: '完了', priority: '低', assignedStaffId: 's003',
    content: '先日予約していた件ですが、体調不良のためキャンセルさせてください。',
    memo: 'キャンセル受付完了。次回予約の際の優先対応をお約束。', updatedAt: `${yesterday}T15:00:00`,
  },
  {
    id: 'INQ-010', receivedAt: `${twoDaysAgo}T10:00:00`, customerName: '佐々木 花子', contact: 'sasaki@example.com',
    type: 'サービス内容確認', status: '完了', priority: '高', assignedStaffId: 's001',
    content: '新しいオプションサービスについて詳しく教えてください。先日案内をいただきましたが、詳細が知りたいです。',
    memo: 'オプション詳細資料を送付。ご契約いただきました。', updatedAt: `${twoDaysAgo}T12:00:00`,
  },
  {
    id: 'INQ-011', receivedAt: `${thisWeek1}T09:30:00`, customerName: '加藤 直樹', contact: '080-5678-9012',
    type: '変更依頼', status: '完了', priority: '低', assignedStaffId: 's005',
    content: '登録しているメールアドレスを変更したいのですが、手続き方法を教えてください。',
    memo: 'メールアドレス変更手続きをご案内。完了確認済み。', updatedAt: `${thisWeek1}T11:00:00`,
  },
  {
    id: 'INQ-012', receivedAt: `${thisWeek2}T13:00:00`, customerName: '中村 翔太', contact: '070-3456-7890',
    type: '予約相談', status: '対応中', priority: '中', assignedStaffId: 's002',
    content: '初めての利用を考えています。どのプランから始めるのがおすすめですか？',
    memo: 'ニーズヒアリング実施済み。スタンダードプランをご提案中。', updatedAt: `${thisWeek2}T15:00:00`,
  },
  {
    id: 'INQ-013', receivedAt: `${lastMonth1}T10:00:00`, customerName: '渡辺 美穂', contact: '070-6789-0123',
    type: 'その他', status: '完了', priority: '低', assignedStaffId: 's003',
    content: 'サービスの利用規約について質問があります。第三者への転売は禁止されていますか？',
    memo: '規約の該当箇所をご案内済み。', updatedAt: `${lastMonth1}T11:30:00`,
  },
  {
    id: 'INQ-014', receivedAt: `${lastMonth2}T14:00:00`, customerName: '伊藤 健', contact: 'ito@example.com',
    type: '料金確認', status: '完了', priority: '中', assignedStaffId: 's001',
    content: '請求書の内訳を詳しく教えてください。先月の請求が想定より高かったです。',
    memo: '請求内訳を確認・ご説明。誤課金はなかったことを確認。', updatedAt: `${lastMonth2}T16:00:00`,
  },
  {
    id: 'INQ-015', receivedAt: `${lastMonth3}T11:00:00`, customerName: '松本 愛', contact: '080-8901-2345',
    type: 'キャンセル', status: '完了', priority: '高', assignedStaffId: 's002',
    content: '退会手続きをしたいと思っています。手続きの方法と、残りのサービス期間について教えてください。',
    memo: '退会手続きをご案内。残り期間については返金対応実施。', updatedAt: `${lastMonth3}T14:00:00`,
  },
];

export const sampleTemplates: ResponseTemplate[] = [
  {
    id: 't001',
    title: '初回問い合わせへの返信',
    category: '初回案内',
    body: `この度はお問い合わせいただき、誠にありがとうございます。

担当の○○でございます。いただいたお問い合わせの内容を確認し、順次ご案内いたします。

通常、お問い合わせから1営業日以内にご返信しております。
しばらくお待ちいただきますよう、よろしくお願い申し上げます。

ご不明な点がございましたら、お気軽にご連絡ください。

何卒よろしくお願いいたします。`,
    usageCount: 42,
    updatedAt: lastMonth2,
  },
  {
    id: 't002',
    title: '予約確認の返信',
    category: '予約確認',
    body: `この度はご予約いただき、誠にありがとうございます。

以下の内容でご予約を承りました。

【ご予約内容】
・日時：○月○日（○）○:○○〜
・内容：○○
・担当：○○

ご不明な点やご変更がございましたら、ご予約日の前日までにご連絡ください。
当日はお時間の余裕をもってお越しいただきますようお願いいたします。

ご来訪をお待ちしております。`,
    usageCount: 67,
    updatedAt: lastMonth1,
  },
  {
    id: 't003',
    title: 'キャンセル受付の返信',
    category: 'キャンセル案内',
    body: `キャンセルのご連絡を承りました。

ご予約のキャンセルを受け付けいたしましたことをご報告申し上げます。

またのご利用をお待ちしております。
次回ご予約の際は、お気軽にご連絡ください。

ご不便をおかけしてしまい申し訳ございません。
またのご利用を心よりお待ちしております。`,
    usageCount: 35,
    updatedAt: lastMonth2,
  },
  {
    id: 't004',
    title: '料金確認への返信',
    category: '料金案内',
    body: `お問い合わせいただきありがとうございます。

料金についてご案内いたします。

【料金プラン一覧】
・ベーシックプラン：○○円/月
・スタンダードプラン：○○円/月
・プレミアムプラン：○○円/月

各プランの詳細については、添付の資料をご確認ください。
ご不明な点がございましたら、お気軽にお問い合わせください。

また、初回ご利用の方には無料トライアルもご用意しております。
詳細はお気軽にお問い合わせください。`,
    usageCount: 28,
    updatedAt: thisWeek2,
  },
  {
    id: 't005',
    title: '営業時間案内',
    category: '営業時間案内',
    body: `お問い合わせいただきありがとうございます。

営業時間についてご案内いたします。

【営業時間】
平日：9:00〜18:00
土曜：10:00〜17:00
日曜・祝日：定休日

時間外のお問い合わせは、翌営業日に順次ご対応いたします。
緊急の場合は、メールにてご連絡いただければ確認次第ご対応いたします。

ご不明な点がございましたら、お気軽にご連絡ください。`,
    usageCount: 19,
    updatedAt: lastMonth3,
  },
  {
    id: 't006',
    title: '対応完了のお礼',
    category: 'お礼',
    body: `この度はお問い合わせいただき、誠にありがとうございました。

ご対応が完了しましたことをご報告申し上げます。

またご不明な点やご質問がございましたら、いつでもお気軽にご連絡ください。
今後ともよろしくお願いいたします。

引き続きご愛顧いただきますよう、よろしくお願い申し上げます。`,
    usageCount: 56,
    updatedAt: yesterday,
  },
  {
    id: 't007',
    title: '予約変更受付の返信',
    category: '予約確認',
    body: `ご連絡いただきありがとうございます。

予約変更のご依頼を承りました。

【変更後のご予約内容】
・日時：○月○日（○）○:○○〜
・内容：○○

変更後のご予約内容を確認いただき、問題がなければそのままお越しください。
ご不明な点がございましたら、お気軽にご連絡ください。`,
    usageCount: 23,
    updatedAt: twoDaysAgo,
  },
  {
    id: 't008',
    title: '保留・確認中のご連絡',
    category: 'その他',
    body: `お問い合わせいただきありがとうございます。

現在、内容を確認中でございます。
今しばらくお時間をいただきますよう、お願い申し上げます。

確認が取れ次第、改めてご連絡いたします。
ご不便をおかけして大変申し訳ございません。

何卒よろしくお願いいたします。`,
    usageCount: 31,
    updatedAt: lastMonth1,
  },
  {
    id: 't009',
    title: 'サービス内容詳細のご案内',
    category: '初回案内',
    body: `お問い合わせいただきありがとうございます。

サービス内容についてご案内いたします。

【サービス概要】
○○のサービスでは、以下のことが可能です。
・○○機能
・○○サポート
・○○管理

詳しくは、ご案内資料をご確認ください。
ご興味がございましたら、無料相談も承っております。

お気軽にご連絡ください。`,
    usageCount: 14,
    updatedAt: lastMonth2,
  },
  {
    id: 't010',
    title: 'クレーム・ご不満へのお詫び',
    category: 'その他',
    body: `この度はご不便・ご不満をおかけしてしまい、誠に申し訳ございません。

担当の○○でございます。
お客様のご意見を真摯に受け止め、早急に対応いたします。

今後このようなことが起こらないよう、改善に努めてまいります。
また、今回の件につきましては○○の対応をさせていただきます。

重ねてお詫び申し上げます。何卒よろしくお願いいたします。`,
    usageCount: 8,
    updatedAt: thisWeek1,
  },
];

export const sampleHandovers: Handover[] = [
  {
    id: 'H-001', createdAt: `${today}T08:30:00`, createdById: 's001', targetStaffId: 's002',
    category: '問い合わせ対応', priority: '高', subject: '【要対応】INQ-001 山田様の予約相談',
    body: '山田太郎様から来週の予約相談が来ています。優先的に対応をお願いします。希望日は火曜か水曜の午前中とのことです。カレンダーを確認してから折り返し連絡してください。',
    status: '未確認', relatedCustomerName: '山田 太郎', relatedInquiryId: 'INQ-001',
  },
  {
    id: 'H-002', createdAt: `${today}T09:00:00`, createdById: 's001', targetStaffId: 's003',
    category: '顧客対応', priority: '高', subject: '【注意】INQ-003 中村様キャンセル件 速やかに対応を',
    body: '中村翔太様から明日の予約キャンセル依頼が来ています。明日のスケジュールに影響するため、本日中に対応をお願いします。キャンセル後の枠は田中さんに連絡してください。',
    status: '未確認', relatedCustomerName: '中村 翔太', relatedInquiryId: 'INQ-003',
  },
  {
    id: 'H-003', createdAt: `${today}T09:30:00`, createdById: 's003', targetStaffId: 's002',
    category: '予約関連', priority: '中', subject: '小林様の予約変更対応状況',
    body: '小林優子様から20日への変更依頼がきています。現在20日の空き状況を確認中です。確認でき次第、小林様に連絡をお願いします。担当が私から田中さんに変わるので引き継ぎます。',
    status: '未確認', relatedCustomerName: '小林 優子', relatedInquiryId: 'INQ-004',
  },
  {
    id: 'H-004', createdAt: `${yesterday}T17:00:00`, createdById: 's002', targetStaffId: 's001',
    category: '問い合わせ対応', priority: '中', subject: '松本様の年間契約問い合わせ 回答保留中',
    body: '松本愛様から年間契約の料金・キャンセルポリシーについて問い合わせがきています。詳細について管理者への確認が必要なため保留中です。明日中に回答をお願いします。',
    status: '確認済み', relatedCustomerName: '松本 愛', relatedInquiryId: 'INQ-008',
  },
  {
    id: 'H-005', createdAt: `${yesterday}T16:00:00`, createdById: 's001', targetStaffId: 's005',
    category: 'システム確認', priority: '低', subject: '問い合わせフォームの動作確認依頼',
    body: 'お客様から「問い合わせフォームが送信できない」との連絡が1件ありました。現在は解決しているようですが、明日の朝一番に動作確認をお願いします。問題があれば即報告してください。',
    status: '確認済み', relatedCustomerName: '', relatedInquiryId: '',
  },
  {
    id: 'H-006', createdAt: `${twoDaysAgo}T18:00:00`, createdById: 's003', targetStaffId: 's002',
    category: '顧客対応', priority: '高', subject: '【VIP】佐々木様 オプション契約ご検討中',
    body: '佐々木花子様（VIP顧客）がオプションサービスのご契約を検討されています。明日改めてご連絡いただける予定ですので、優先的に対応をお願いします。詳しい提案資料を用意しておいてください。',
    status: '確認済み', relatedCustomerName: '佐々木 花子', relatedInquiryId: 'INQ-010',
  },
  {
    id: 'H-007', createdAt: `${thisWeek1}T15:00:00`, createdById: 's005', targetStaffId: 's003',
    category: '問い合わせ対応', priority: '低', subject: '渡辺様 領収書再発行の件',
    body: '渡辺美穂様から先月分の領収書再発行依頼が来ています。経理に確認して発行手続きをお願いします。通常3営業日かかるので、お客様へも期間をお伝えください。',
    status: '未確認', relatedCustomerName: '渡辺 美穂', relatedInquiryId: 'INQ-006',
  },
  {
    id: 'H-008', createdAt: `${thisWeek2}T10:00:00`, createdById: 's002', targetStaffId: 's005',
    category: '予約関連', priority: '中', subject: '中村様 初回利用相談の続き',
    body: '中村翔太様（新規顧客）がサービス内容についてご相談中です。スタンダードプランをご提案しましたが、具体的な利用シーンを説明する必要があります。明日のフォローアップをお願いします。',
    status: '確認済み', relatedCustomerName: '中村 翔太', relatedInquiryId: 'INQ-012',
  },
];

export const sampleSettings: Settings = {
  businessName: 'サポートフロー株式会社',
  businessHours: '平日 9:00〜18:00 / 土曜 10:00〜17:00',
  closedDays: '日曜日・祝日',
  notificationEmail: 'admin@example.com',
  targetResponseTime: 24,
  autoReplyTemplateId: 't001',
  itemsPerPage: 20,
};

export const demoUsers: User[] = [
  { id: 's001', name: '佐藤 美咲', email: 'admin@example.com', role: 'admin' },
  { id: 's002', name: '田中 翔', email: 'staff@example.com', role: 'staff' },
];
