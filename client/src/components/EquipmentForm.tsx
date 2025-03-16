import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
import { Textarea } from './ui/textarea';
import { Equipment } from '../types';


interface EquipmentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEquipmentSaved: () => void;
  equipment: Equipment | null;
}

function EquipmentForm({ 
  open, 
  onOpenChange, 
  onEquipmentSaved, 
  equipment 
}: EquipmentFormProps): React.ReactElement {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [hourlyPrice, setHourlyPrice] = useState<number>(0);
  const [dailyPrice, setDailyPrice] = useState<number>(0);
  const [weeklyPrice, setWeeklyPrice] = useState<number>(0);
  const [monthlyPrice, setMonthlyPrice] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (equipment) {
      setName(equipment.name);
      setDescription(equipment.description || '');
      setQuantity(equipment.quantity);
      setHourlyPrice(equipment.hourly_price);
      setDailyPrice(equipment.daily_price);
      setWeeklyPrice(equipment.weekly_price);
      setMonthlyPrice(equipment.monthly_price);
    } else {
      resetForm();
    }
  }, [equipment, open]);

  const resetForm = (): void => {
    setName('');
    setDescription('');
    setQuantity(1);
    setHourlyPrice(0);
    setDailyPrice(0);
    setWeeklyPrice(0);
    setMonthlyPrice(0);
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    // Validation
    if (!name) {
      toast.error("Please enter equipment name", {
        description: "Equipment name is required."
      });
      return;
    }
    
    const formData = {
      name,
      description,
      quantity,
      hourly_price: hourlyPrice,
      daily_price: dailyPrice,
      weekly_price: weeklyPrice,
      monthly_price: monthlyPrice
    };
    
    try {
      setLoading(true);
      if (equipment) {
        await axios.put(`${process.env.API_HOST}/api/equipments/${equipment.id}`, formData);
      } else {
        await axios.post(`${process.env.API_HOST}/api/equipments`, formData);
      }
      onEquipmentSaved();
    } catch (error) {
      console.error('Error saving equipment:', error);
      toast.error("Failed to save equipment", {
        description: "There was a problem saving the equipment."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{equipment ? 'Edit Equipment' : 'Add New Equipment'}</DialogTitle>
          <DialogDescription>
            {equipment 
              ? 'Update the equipment details below.' 
              : 'Enter the details for the new equipment.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter equipment name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter equipment description"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity *</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hourlyPrice">Hourly Price *</Label>
              <Input
                id="hourlyPrice"
                type="number"
                min="0"
                step="0.01"
                value={hourlyPrice}
                onChange={(e) => setHourlyPrice(Number(e.target.value))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dailyPrice">Daily Price *</Label>
              <Input
                id="dailyPrice"
                type="number"
                min="0"
                step="0.01"
                value={dailyPrice}
                onChange={(e) => setDailyPrice(Number(e.target.value))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="weeklyPrice">Weekly Price *</Label>
              <Input
                id="weeklyPrice"
                type="number"
                min="0"
                step="0.01"
                value={weeklyPrice}
                onChange={(e) => setWeeklyPrice(Number(e.target.value))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="monthlyPrice">Monthly Price *</Label>
              <Input
                id="monthlyPrice"
                type="number"
                min="0"
                step="0.01"
                value={monthlyPrice}
                onChange={(e) => setMonthlyPrice(Number(e.target.value))}
                required
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : (equipment ? 'Update' : 'Save')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EquipmentForm;
