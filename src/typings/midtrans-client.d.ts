/** Declaration file generated by dts-gen */

declare module "midtrans-client" {
  export class CoreApi {
    constructor(...args: any[]);

    capture(...args: any[]): void;

    cardPointInquiry(...args: any[]): void;

    cardRegister(...args: any[]): void;

    cardToken(...args: any[]): void;

    charge(...args: any[]): void;

    createSubscription(...args: any[]): void;

    disableSubscription(...args: any[]): void;

    enableSubscription(...args: any[]): void;

    getPaymentAccount(...args: any[]): void;

    getSubscription(...args: any[]): void;

    linkPaymentAccount(...args: any[]): void;

    unlinkPaymentAccount(...args: any[]): void;

    updateSubscription(...args: any[]): void;
  }

  export class Iris {
    constructor(...args: any[]);

    approvePayouts(...args: any[]): void;

    createBeneficiaries(...args: any[]): void;

    createPayouts(...args: any[]): void;

    getBalance(...args: any[]): void;

    getBeneficiaries(...args: any[]): void;

    getBeneficiaryBanks(...args: any[]): void;

    getFacilitatorBalance(...args: any[]): void;

    getFacilitatorBankAccounts(...args: any[]): void;

    getPayoutDetails(...args: any[]): void;

    getTopupChannels(...args: any[]): void;

    getTransactionHistory(...args: any[]): void;

    ping(...args: any[]): void;

    rejectPayouts(...args: any[]): void;

    updateBeneficiaries(...args: any[]): void;

    validateBankAccount(...args: any[]): void;
  }

  export class Snap {
    constructor(options?: {
      isProduction?: boolean;
      serverKey?: string;
      clientKey?: string;
    });

    createTransaction<T>(param: Record<string, any>): Promise<T>;

    createTransactionRedirectUrl(...args: any[]): void;

    createTransactionToken(...args: any[]): void;
  }

  export function MidtransError(...args: any[]): void;

  export namespace MidtransError {
    const stackTraceLimit: number;

    function captureStackTrace(p0: any, p1: any): any;

    function prepareStackTrace(error: any, trace: any): any;
  }
}