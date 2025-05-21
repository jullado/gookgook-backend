class ReceiveVoucherServiceDto {
  voucher_id: string;
  deal_id: string;
  user_id: string;
  redeem: boolean;
  create_at: Date;
  Deals: DealsModel;
}

class DealsModel {
  deal_id: string;
  title: string;
  image: string;
  description: string;
  company_id: string;
  status: boolean;
  start_at: Date;
  discount: number;
  discount_type: string;
  category: string;
  expires_at: Date;
  amount: number;
  create_at: Date;
  products: string[];
}

export { ReceiveVoucherServiceDto };
