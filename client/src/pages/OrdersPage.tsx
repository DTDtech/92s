import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from '../hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Button } from '../components/ui/button';
import { ChevronDown, ChevronUp, Plus } from 'lucide-react'; // Assuming you're using lucide-react for icons
import OrderForm from '@/components/OrderForm';

// Define types for the response
interface EquipmentItem {
  name: string;
  quantity: number;
  rental_price: number;
  item_total: number;
}

interface Order {
  order_id: number;
  customer: string;
  equipment_items: EquipmentItem[];
  total_price: number;
  rental_start: string;
  rental_end: string;
}
function OrdersPage(): React.ReactElement {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [expandedOrders, setExpandedOrders] = useState<Set<number>>(new Set());
  const [openOrderForm, setOpenOrderForm] = useState<boolean>(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await axios.get<Order[]>(`${process.env.API_HOST}/api/orders`);
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Failed to load orders",
        description: "There was a problem fetching the order data.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Format price using Vietnamese locale
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  // Toggle expanded state for an order
  const toggleOrderExpanded = (orderId: number): void => {
    const newExpandedOrders = new Set(expandedOrders);
    if (newExpandedOrders.has(orderId)) {
      newExpandedOrders.delete(orderId);
    } else {
      newExpandedOrders.add(orderId);
    }
    setExpandedOrders(newExpandedOrders);
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const handleOrderSaved = (): void => {
    setOpenOrderForm(false);
    fetchOrders();
    toast({
      title: "Order saved successfully",
      description: "Your order has been saved.",
      variant: "default"
    });
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Orders</h1>
        <Button onClick={() => setOpenOrderForm(true)}>
          <Plus className="mr-2 h-4 w-4" />Create New Order
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading orders...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Rental Start</TableHead>
                <TableHead>Rental End</TableHead>
                <TableHead className="text-right">Total Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    No orders found. Create your first order to get started.
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <React.Fragment key={order.order_id}>
                    <TableRow>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleOrderExpanded(order.order_id)}
                        >
                          {expandedOrders.has(order.order_id) ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </Button>
                      </TableCell>
                      <TableCell>{order.order_id}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell>{formatDate(order.rental_start)}</TableCell>
                      <TableCell>{formatDate(order.rental_end)}</TableCell>
                      <TableCell className="text-right font-medium">{formatPrice(order.total_price)}</TableCell>
                    </TableRow>

                    {expandedOrders.has(order.order_id) && (
                      <TableRow>
                        <TableCell colSpan={6} className="p-0">
                          <div className="bg-gray-50 p-4">
                            <h4 className="font-semibold mb-2">Equipment Items</h4>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Equipment</TableHead>
                                  <TableHead className="text-center">Quantity</TableHead>
                                  <TableHead className="text-right">Unit Price</TableHead>
                                  <TableHead className="text-right">Subtotal</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {order.equipment_items.map((item, index) => (
                                  <TableRow key={index}>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell className="text-center">{item.quantity}</TableCell>
                                    <TableCell className="text-right">{formatPrice(item.rental_price)}</TableCell>
                                    <TableCell className="text-right">{formatPrice(item.item_total)}</TableCell>
                                  </TableRow>
                                ))}
                                <TableRow>
                                  <TableCell colSpan={3} className="text-right font-semibold">Total:</TableCell>
                                  <TableCell className="text-right font-semibold">{formatPrice(order.total_price)}</TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add the OrderForm component here */}
      {openOrderForm && (
        <OrderForm
          open={openOrderForm}
          onOpenChange={setOpenOrderForm}
          onOrderCreated={handleOrderSaved}
        />
      )}
    </div>
  );
}
export default OrdersPage;