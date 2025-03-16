import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import OrderForm from '../components/OrderForm';
import { Order } from '../types';

function OrdersPage(): React.ReactElement {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openOrderForm, setOpenOrderForm] = useState<boolean>(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async (): Promise<void> => {
    try {
      setLoading(true);
      console.log(import.meta.env);
      const response = await axios.get<Order[]>(`${process.env.API_HOST}/api/orders`);
      console.log('orders', response.data);
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error("Failed to load orders", {
        description: "There was a problem fetching the orders data."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOrderCreated = (): void => {
    setOpenOrderForm(false);
    fetchOrders();
    toast.success("Order created successfully", {
      description: "Your new order has been created."
    });
  };

  const handleDeleteOrder = async (orderId: number): Promise<void> => {
    if (!window.confirm('Are you sure you want to delete this order?')) {
      return;
    }

    try {
      await axios.delete(`${process.env.API_HOST}/api/orders/${orderId}`);
      fetchOrders();
      toast.success("Order deleted successfully", {
        description: "The order has been removed."
      });
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error("Failed to delete order", {
        description: "There was a problem deleting the order."
      });
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Đơn hàng</h1>
        <Button onClick={() => setOpenOrderForm(true)}>
          <Plus className="mr-2 h-4 w-4" /> Tạo đơn hàng mới
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách đơn hàng</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Thiết bị</TableHead>
                  <TableHead>Ngày bắt đầu</TableHead>
                  <TableHead>Ngày kết thúc</TableHead>
                  <TableHead>Tổng tiền</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      Không có đơn hàng nào
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => (
                    <TableRow key={order.order_id}>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell dangerouslySetInnerHTML={{ __html: order.equipment_details }} />
                      <TableCell>{order.rental_start}</TableCell>
                      <TableCell>{order.rental_end}</TableCell>
                      <TableCell>{order.total_price}</TableCell>
                      <TableCell>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleDeleteOrder(order.order_id)}
                        >
                          Xóa
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <OrderForm 
        open={openOrderForm} 
        onOpenChange={setOpenOrderForm} 
        onOrderCreated={handleOrderCreated} 
      />
    </div>
  );
}

export default OrdersPage;