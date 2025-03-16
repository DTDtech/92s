import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import CustomerForm from '../components/CustomerForm';
import { Customer } from '../types';


function CustomersPage(): React.ReactElement {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openCustomerForm, setOpenCustomerForm] = useState<boolean>(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await axios.get<Customer[]>(`${process.env.API_HOST}/api/customers`);
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error("Failed to load customers", {
        description: "There was a problem fetching the customer data."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerSaved = (): void => {
    setOpenCustomerForm(false);
    setEditingCustomer(null);
    fetchCustomers();
    toast.success("Customer saved successfully", {
      description: "Your customer has been saved."
    });
  };

  const handleEditCustomer = (customer: Customer): void => {
    setEditingCustomer(customer);
    setOpenCustomerForm(true);
  };

  const handleDeleteCustomer = async (customerId: number): Promise<void> => {
    if (!window.confirm('Are you sure you want to delete this customer?')) {
      return;
    }

    try {
      await axios.delete(`${process.env.API_HOST}/api/customers/${customerId}`);
      fetchCustomers();
      toast.success("Customer deleted successfully", {
        description: "The customer has been removed."
      });
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast.error("Failed to delete customer", {
        description: "There was a problem deleting the customer."
      });
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Khách hàng</h1>
        <Button onClick={() => {
          setEditingCustomer(null);
          setOpenCustomerForm(true);
        }}>
          <Plus className="mr-2 h-4 w-4" /> Thêm khách hàng mới
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách khách hàng</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên khách hàng</TableHead>
                  <TableHead>Số điện thoại</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Địa chỉ</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      Không có khách hàng nào
                    </TableCell>
                  </TableRow>
                ) : (
                  customers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>{customer.name}</TableCell>
                      <TableCell>{customer.phone || '-'}</TableCell>
                      <TableCell>{customer.email || '-'}</TableCell>
                      <TableCell>{customer.address || '-'}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleEditCustomer(customer)}
                          >
                            Sửa
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => handleDeleteCustomer(customer.id)}
                          >
                            Xóa
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <CustomerForm 
        open={openCustomerForm} 
        onOpenChange={setOpenCustomerForm} 
        onCustomerSaved={handleCustomerSaved}
        customer={editingCustomer}
      />
    </div>
  );
}

export default CustomersPage;
