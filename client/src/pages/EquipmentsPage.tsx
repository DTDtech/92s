import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import EquipmentForm from '../components/EquipmentForm';
import { Equipment } from '../types';


function EquipmentsPage(): React.ReactElement {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openEquipmentForm, setOpenEquipmentForm] = useState<boolean>(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);

  useEffect(() => {
    fetchEquipments();
  }, []);

  const fetchEquipments = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await axios.get<Equipment[]>(`${process.env.API_HOST}/api/equipments`);
      setEquipments(response.data);
    } catch (error) {
      console.error('Error fetching equipments:', error);
      toast.error("Failed to load equipments", {
        description: "There was a problem fetching the equipment data."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEquipmentSaved = (): void => {
    setOpenEquipmentForm(false);
    setEditingEquipment(null);
    fetchEquipments();
    toast.success("Equipment created successfully", {
      description: "Your equipment has been created."
    });
  };

  const handleEditEquipment = (equipment: Equipment): void => {
    setEditingEquipment(equipment);
    setOpenEquipmentForm(true);
  };

  const handleDeleteEquipment = async (equipmentId: number): Promise<void> => {
    if (!window.confirm('Are you sure you want to delete this equipment?')) {
      return;
    }

    try {
      await axios.delete(`${process.env.API_HOST}/api/equipments/${equipmentId}`);
      fetchEquipments();
      toast.success("Equipment deleted successfully", {
        description: "The equipment has been removed."
      });
    } catch (error) {
      console.error('Error deleting equipment:', error);
      toast.error("Failed to delete equipment", {
        description: "There was a problem deleting the equipment."
      });
    }
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Thiết bị</h1>
        <Button onClick={() => {
          setEditingEquipment(null);
          setOpenEquipmentForm(true);
        }}>
          <Plus className="mr-2 h-4 w-4" /> Thêm thiết bị mới
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách thiết bị</CardTitle>
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
                  <TableHead>Tên thiết bị</TableHead>
                  <TableHead>Mô tả</TableHead>
                  <TableHead>Số lượng</TableHead>
                  <TableHead>Giá theo giờ</TableHead>
                  <TableHead>Giá theo ngày</TableHead>
                  <TableHead>Giá theo tuần</TableHead>
                  <TableHead>Giá theo tháng</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {equipments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      Không có thiết bị nào
                    </TableCell>
                  </TableRow>
                ) : (
                  equipments.map((equipment) => (
                    <TableRow key={equipment.id}>
                      <TableCell>{equipment.name}</TableCell>
                      <TableCell>{equipment.description}</TableCell>
                      <TableCell>{equipment.quantity}</TableCell>
                      <TableCell>{formatPrice(equipment.hourly_price)}</TableCell>
                      <TableCell>{formatPrice(equipment.daily_price)}</TableCell>
                      <TableCell>{formatPrice(equipment.weekly_price)}</TableCell>
                      <TableCell>{formatPrice(equipment.monthly_price)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditEquipment(equipment)}
                          >
                            Sửa
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteEquipment(equipment.id)}
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

      <EquipmentForm
        open={openEquipmentForm}
        onOpenChange={setOpenEquipmentForm}
        onEquipmentSaved={handleEquipmentSaved}
        equipment={editingEquipment}
      />
    </div>
  );
}

export default EquipmentsPage;