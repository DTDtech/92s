import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Plus } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from './ui/select';
import { Customer, Equipment, OrderEquipment, OrderFormData } from '../types';

interface OrderFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOrderCreated: () => void;
}

function OrderForm({ open, onOpenChange, onOrderCreated }: OrderFormProps): React.ReactElement {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [newCustomerName, setNewCustomerName] = useState<string>('');
  const [rentalStart, setRentalStart] = useState<string>('');
  const [rentalEnd, setRentalEnd] = useState<string>('');
  const [equipmentItems, setEquipmentItems] = useState<OrderEquipment[]>([{
    equipment_id: '',
    quantity: 1,
    rental_period: 'daily',
    discount: 0,
    calculated_price: 0
  }]);

  useEffect(() => {
    if (open) {
      fetchCustomers();
      fetchEquipments();
    }
  }, [open]);

  // Recalculate prices when rental dates change
  useEffect(() => {
    if (rentalStart && rentalEnd) {
      recalculateAllPrices();
    }
  }, [rentalStart, rentalEnd]);

  const fetchCustomers = async (): Promise<void> => {
    try {
      const response = await axios.get<Customer[]>(`${process.env.API_HOST}/api/customers`);
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error("Failed to load customers", {
        description: "There was a problem fetching the customer data."
      });
    }
  };

  const fetchEquipments = async (): Promise<void> => {
    try {
      const response = await axios.get<Equipment[]>(`${process.env.API_HOST}/api/equipments`);
      setEquipments(response.data);
    } catch (error) {
      console.error('Error fetching equipments:', error);
      toast.error("Failed to load equipments", {
        description: "There was a problem fetching the equipment data."
      });
    }
  };

  const handleAddEquipment = (): void => {
    setEquipmentItems([
      ...equipmentItems,
      {
        equipment_id: '',
        quantity: 1,
        rental_period: 'daily',
        discount: 0,
        calculated_price: 0
      }
    ]);
  };

  const handleRemoveEquipment = (index: number): void => {
    const newItems = [...equipmentItems];
    newItems.splice(index, 1);
    setEquipmentItems(newItems);
  };

  const calculateRentalDuration = (period: 'hourly' | 'daily' | 'weekly' | 'monthly'): number => {
    if (!rentalStart || !rentalEnd) return 0;

    const start = new Date(rentalStart);
    const end = new Date(rentalEnd);
    const diffTime = Math.abs(end.getTime() - start.getTime());

    switch (period) {
      case 'hourly':
        return Math.ceil(diffTime / (1000 * 60 * 60));
      case 'daily':
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      case 'weekly':
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
      case 'monthly':
        // Approximate a month as 30 days
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
      default:
        return 0;
    }
  };

  const recalculateAllPrices = (): void => {
    const newItems = [...equipmentItems];

    newItems.forEach((item, index) => {
      if (item.equipment_id && item.rental_period) {
        calculateItemPrice(newItems, index);
      }
    });

    setEquipmentItems(newItems);
  };

  const calculateItemPrice = (items: OrderEquipment[], index: number): void => {
    const item = items[index];
    const equipment = equipments.find(e => e.id.toString() === item.equipment_id);

    if (equipment && item.rental_period && rentalStart && rentalEnd) {
      const priceField = `${item.rental_period}_price` as keyof Equipment;
      const basePrice = equipment[priceField] as number || 0;
      const quantity = item.quantity || 0;
      const discount = item.discount || 0;
      const duration = calculateRentalDuration(item.rental_period);

      let calculatedPrice = basePrice * quantity * duration;
      calculatedPrice = calculatedPrice - (calculatedPrice * (discount / 100));

      items[index].calculated_price = calculatedPrice;
    }
  };

  const handleEquipmentChange = (index: number, field: keyof OrderEquipment, value: string | number): void => {
    const newItems = [...equipmentItems];

    // Type assertion to handle different field types
    if (field === 'equipment_id') {
      newItems[index][field] = value as string;
    } else if (field === 'rental_period') {
      newItems[index][field] = value as 'hourly' | 'daily' | 'weekly' | 'monthly';
    } else if (field === 'calculated_price') {
      // For calculated_price, handle empty string
      newItems[index][field] = value === '' ? 0 : Number(value);
      setEquipmentItems(newItems);
      return;
    } else {
      // For other numeric fields like discount and quantity
      newItems[index][field] = value === '' ? 0 : Number(value);
    }

    // Recalculate price if necessary fields change
    if (['equipment_id', 'quantity', 'rental_period', 'discount'].includes(field)) {
      calculateItemPrice(newItems, index);
    }

    setEquipmentItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    // Validation
    if ((!selectedCustomer && !newCustomerName) || !rentalStart || !rentalEnd) {
      toast.error("Please fill in all required fields", {
        description: "Customer, rental start and end dates are required."
      });
      return;
    }

    if (equipmentItems.some(item => !item.equipment_id || !item.rental_period)) {
      toast.error("Please select equipment and rental period for all items", {
        description: "Each equipment item must have a selected equipment and rental period."
      });
      return;
    }

    // Prepare data
    const formData: OrderFormData = {
      customer_id: selectedCustomer || `new:${newCustomerName}`,
      rental_start: rentalStart,
      rental_end: rentalEnd,
      equipment: equipmentItems
    };

    console.log(formData);
    try {
      setLoading(true);
      await axios.post(`${process.env.API_HOST}/api/orders`, formData);
      resetForm();
      onOrderCreated();
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error("Failed to create order", {
        description: "There was a problem creating the order."
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = (): void => {
    setSelectedCustomer('');
    setNewCustomerName('');
    setRentalStart('');
    setRentalEnd('');
    setEquipmentItems([{
      equipment_id: '',
      quantity: 1,
      rental_period: 'daily',
      discount: 0,
      calculated_price: 0
    }]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Tạo đơn hàng mới</DialogTitle>
          <DialogDescription>
            Nhập thông tin đơn hàng mới vào form bên dưới.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-4">
            {/* Customer Selection */}
            <div className="space-y-2">
              <Label htmlFor="customer">Khách hàng *</Label>
              <Select
                value={selectedCustomer}
                onValueChange={(value: string) => {
                  if (value === 'new') {
                    setSelectedCustomer('');
                    setNewCustomerName('');
                  } else {
                    setSelectedCustomer(value);
                    setNewCustomerName('');
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn khách hàng" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map(customer => (
                    <SelectItem key={customer.id} value={customer.id.toString()}>
                      {customer.name}
                    </SelectItem>
                  ))}
                  <SelectItem value="new">+ Thêm khách hàng mới</SelectItem>
                </SelectContent>
              </Select>

              {selectedCustomer === 'new' && (
                <div className="mt-2">
                  <Label htmlFor="newCustomerName">Tên khách hàng mới *</Label>
                  <Input
                    id="newCustomerName"
                    value={newCustomerName}
                    onChange={(e) => setNewCustomerName(e.target.value)}
                    placeholder="Nhập tên khách hàng mới"
                  />
                </div>
              )}
            </div>

            {/* Rental Dates - Moved up to calculate prices based on dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rental_start">Ngày bắt đầu *</Label>
                <Input
                  id="rental_start"
                  type="date"
                  value={rentalStart}
                  onChange={(e) => setRentalStart(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rental_end">Ngày kết thúc *</Label>
                <Input
                  id="rental_end"
                  type="date"
                  value={rentalEnd}
                  onChange={(e) => setRentalEnd(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Equipment Items */}
            <div className="space-y-2">
              <Label>Thiết bị *</Label>
              {equipmentItems.map((item, index) => (
                <div key={index} className="p-3 border rounded-md relative mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <div>
                      <Label htmlFor={`equipment-${index}`}>Thiết bị</Label>
                      <Select
                        value={item.equipment_id}
                        onValueChange={(value) => handleEquipmentChange(index, 'equipment_id', value)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Chọn thiết bị" />
                        </SelectTrigger>
                        <SelectContent>
                          {equipments.map(equipment => (
                            <SelectItem
                              key={equipment.id}
                              value={equipment.id.toString()}
                            >
                              {equipment.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor={`quantity-${index}`}>Số lượng</Label>
                      <Input
                        id={`quantity-${index}`}
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleEquipmentChange(index, 'quantity', e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`rental-period-${index}`}>Thời gian thuê</Label>
                      <Select
                        value={item.rental_period}
                        onValueChange={(value) => handleEquipmentChange(index, 'rental_period', value)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Chọn thời gian thuê" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hourly">Theo giờ</SelectItem>
                          <SelectItem value="daily">Theo ngày</SelectItem>
                          <SelectItem value="weekly">Theo tuần</SelectItem>
                          <SelectItem value="monthly">Theo tháng</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor={`discount-${index}`}>Giảm giá (%)</Label>
                      <Input
                        id={`discount-${index}`}
                        type="text"
                        value={item.discount === 0 && document.activeElement?.id === `discount-${index}` ? '' : item.discount}
                        onChange={(e) => handleEquipmentChange(index, 'discount', e.target.value)}
                        onFocus={(e) => {
                          if (item.discount === 0) {
                            const newItems = [...equipmentItems];
                            newItems[index].discount = 0;
                            e.target.value = '';
                            setEquipmentItems(newItems);
                          }
                        }}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="mt-2 font-medium flex items-center">
                    <span className="mr-2">Giá thuê:</span>
                    <Input
                      type="text"
                      value={item.calculated_price === 0 && document.activeElement?.id === `price-${index}` ? '' : item.calculated_price}
                      onChange={(e) => handleEquipmentChange(index, 'calculated_price', e.target.value)}
                      onFocus={(e) => {
                        if (item.calculated_price === 0) {
                          const newItems = [...equipmentItems];
                          newItems[index].calculated_price = 0;
                          e.target.value = '';
                          setEquipmentItems(newItems);
                        }
                      }}
                      id={`price-${index}`}
                      className="w-32 inline-block"
                    />
                    {rentalStart && rentalEnd && item.rental_period && (
                      <span className="ml-2 text-sm text-gray-500">
                        ({calculateRentalDuration(item.rental_period)} {item.rental_period === 'hourly' ? 'giờ' :
                          item.rental_period === 'daily' ? 'ngày' :
                            item.rental_period === 'weekly' ? 'tuần' : 'tháng'})
                      </span>
                    )}
                  </div>

                  {equipmentItems.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => handleRemoveEquipment(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={handleAddEquipment}
              >
                <Plus className="mr-2 h-4 w-4" />
                Thêm thiết bị
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Đang lưu...' : 'Lưu đơn hàng'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default OrderForm;
