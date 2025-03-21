import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { CustomerForm } from '../components/CustomerForm';
import { Customer } from '../types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Loader2 } from 'lucide-react';

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
        description: "There was a problem fetching the customer data.",
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
      description: "Your customer has been saved.",
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
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/customers/${customerId}`);
      fetchCustomers();
      toast.success("Customer deleted successfully", {
        description: "The customer has been removed.",
      });
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast.error("Failed to delete customer", {
        description: "There was a problem deleting the customer.",
      });
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Khách hàng</h1>
        <Button onClick={() => setOpenCustomerForm(true)}>Add Customer</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách khách hàng</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4">
                      No customers found. Add your first customer to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  customers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell>{customer.phone_number || '-'}</TableCell>
                      <TableCell className="max-w-xs truncate">{customer.address || '-'}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          className="mr-2"
                          onClick={() => handleEditCustomer(customer)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteCustomer(customer.id)}
                        >
                          Delete
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
