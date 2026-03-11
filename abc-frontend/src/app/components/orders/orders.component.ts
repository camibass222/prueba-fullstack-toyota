import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-orders',
  standalone: false,
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];

  get pendingCount(): number {
    return this.orders.filter(o => o.status === 'pending').length;
  }

  get shippedCount(): number {
    return this.orders.filter(o => o.status === 'shipped').length;
  }

  get deliveredCount(): number {
    return this.orders.filter(o => o.status === 'delivered').length;
  }

  ngOnInit(): void {
    this.orders = [
      {
        id: 1,
        items: [{ name: 'Laptop HP', quantity: 1, price: 899.99 }],
        total: 899.99,
        status: 'processing',
        createdAt: new Date()
      },
      {
        id: 2,
        items: [{ name: 'Mouse Logitech', quantity: 2, price: 29.99 }],
        total: 59.98,
        status: 'shipped',
        createdAt: new Date()
      },
      {
        id: 3,
        items: [{ name: 'Teclado Mecánico', quantity: 1, price: 149.99 }],
        total: 149.99,
        status: 'delivered',
        createdAt: new Date()
      },
      {
        id: 4,
        items: [{ name: 'Monitor 27"', quantity: 1, price: 349.99 }],
        total: 349.99,
        status: 'pending',
        createdAt: new Date()
      }
    ];
  }

  getStatusLabel(status: string): string {
    const labels: any = {
      pending: 'Pendiente',
      processing: 'Procesando',
      shipped: 'Enviado',
      delivered: 'Entregado'
    };
    return labels[status] || status;
  }
}