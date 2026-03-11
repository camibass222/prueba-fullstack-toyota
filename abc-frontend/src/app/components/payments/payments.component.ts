import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-payments',
  standalone: false,
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit {
  payments: any[] = [];

  get totalAmount(): number {
    return this.payments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0);
  }

  get completedCount(): number {
    return this.payments.filter(p => p.status === 'completed').length;
  }

  get pendingCount(): number {
    return this.payments.filter(p => p.status === 'pending').length;
  }

  ngOnInit(): void {
    this.payments = [
      {
        id: 1,
        transactionId: 'TXN123ABC456',
        orderId: 1,
        amount: 899.99,
        method: 'credit_card',
        status: 'completed',
        createdAt: new Date()
      },
      {
        id: 2,
        transactionId: 'TXN789DEF012',
        orderId: 2,
        amount: 59.98,
        method: 'paypal',
        status: 'completed',
        createdAt: new Date()
      },
      {
        id: 3,
        transactionId: 'TXN345GHI678',
        orderId: 3,
        amount: 149.99,
        method: 'debit_card',
        status: 'completed',
        createdAt: new Date()
      },
      {
        id: 4,
        transactionId: 'TXN901JKL234',
        orderId: 4,
        amount: 349.99,
        method: 'credit_card',
        status: 'pending',
        createdAt: new Date()
      }
    ];
  }

  getMethodLabel(method: string): string {
    const labels: any = {
      credit_card: 'Tarjeta de Crédito',
      debit_card: 'Tarjeta de Débito',
      paypal: 'PayPal',
      transfer: 'Transferencia'
    };
    return labels[method] || method;
  }

  getStatusLabel(status: string): string {
    const labels: any = {
      completed: 'Completado',
      pending: 'Pendiente',
      failed: 'Fallido',
      refunded: 'Reembolsado'
    };
    return labels[status] || status;
  }
}