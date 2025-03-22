import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '../components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Equipment, HandoverFormData, HandoverEquipment } from '../types';

function HandoverForm(): React.ReactElement {
    const [equipments, setEquipments] = useState<Equipment[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [handoverDate, setHandoverDate] = useState<string>('');
    const [status, setStatus] = useState<string>('pending');
    const [equipmentItems, setEquipmentItems] = useState<HandoverEquipment[]>([{
        equipment_id: '',
        quantity: 1,
        condition: 'good'
    }]);
    const [customerDocumentImage, setCustomerDocumentImage] = useState<File | null>(null);
    const [equipmentImages, setEquipmentImages] = useState<File[]>([]);
    const [personalDocumentNote, setPersonalDocumentNote] = useState<string>('');
    const [documentNote, setDocumentNote] = useState<string>('');
    const navigate = useNavigate(); // Use useNavigate for navigation

    useEffect(() => {
        fetchEquipments();
    }, []);

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
                condition: 'good'
            }
        ]);
    };

    const handleRemoveEquipment = (index: number): void => {
        const newItems = [...equipmentItems];
        newItems.splice(index, 1);
        setEquipmentItems(newItems);
    };

    const handleEquipmentChange = (index: number, field: keyof HandoverEquipment, value: string | number): void => {
        const newItems = [...equipmentItems];
        newItems[index][field] = value as never;
        setEquipmentItems(newItems);
    };

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();

        // Validation
        if (!handoverDate || !status || !customerDocumentImage || equipmentImages.length === 0) {
            toast.error("Please fill in all required fields", {
                description: "Handover date, status, customer document image, and equipment images are required."
            });
            return;
        }

        if (equipmentItems.some(item => !item.equipment_id || !item.quantity)) {
            toast.error("Please select equipment and quantity for all items", {
                description: "Each equipment item must have a selected equipment and quantity."
            });
            return;
        }

        // Prepare form data
        const formData = new FormData();
        formData.append('handover_date', handoverDate);
        formData.append('status', status);
        formData.append('customer_document_image', customerDocumentImage);
        equipmentImages.forEach((image) => formData.append('equipment_images', image));
        formData.append('personal_document_note', personalDocumentNote);
        formData.append('document_note', documentNote);
        formData.append('equipment_items', JSON.stringify(equipmentItems));

        try {
            setLoading(true);
            await axios.post(`${process.env.API_HOST}/api/handovers`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            resetForm();
            toast.success("Handover created successfully!");
            navigate('/handovers'); // Redirect to the handovers list after creation
        } catch (error) {
            console.error('Error creating handover:', error);
            toast.error("Failed to create handover", {
                description: "There was a problem creating the handover."
            });
        } finally {
            setLoading(false);
        }
    };

    const resetForm = (): void => {
        setHandoverDate('');
        setStatus('pending');
        setEquipmentItems([{
            equipment_id: '',
            quantity: 1,
            condition: 'good'
        }]);
        setCustomerDocumentImage(null);
        setEquipmentImages([]);
        setPersonalDocumentNote('');
        setDocumentNote('');
    };

    return (
        <div className="container mx-auto py-6">
            <Card>
                <CardHeader>
                    <CardTitle>Create New Handover</CardTitle>
                    <CardDescription>
                        Enter the details of the new handover in the form below.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-4">
                            {/* Handover Date */}
                            <div className="space-y-2">
                                <Label htmlFor="handover_date">Handover Date *</Label>
                                <Input
                                    id="handover_date"
                                    type="date"
                                    value={handoverDate}
                                    onChange={(e) => setHandoverDate(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Status */}
                            <div className="space-y-2">
                                <Label htmlFor="status">Status *</Label>
                                <Select
                                    value={status}
                                    onValueChange={(value: string) => setStatus(value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Customer Document Image */}
                            <div className="space-y-2">
                                <Label>Customer Document Image *</Label>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    capture="environment"
                                    multiple
                                    onChange={(e) => setCustomerDocumentImage(e.target.files?.[0] || null)}
                                    required
                                />
                            </div>

                            {/* Equipment Images */}
                            <div className="space-y-2">
                                <Label>Equipment Images *</Label>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    capture="environment"
                                    multiple
                                    onChange={(e) => setEquipmentImages(Array.from(e.target.files || []))}
                                    required
                                />
                            </div>

                            {/* Personal Document Note */}
                            <div className="space-y-2">
                                <Label>Personal Document Note</Label>
                                <Textarea
                                    value={personalDocumentNote}
                                    onChange={(e) => setPersonalDocumentNote(e.target.value)}
                                />
                            </div>

                            {/* Document Note */}
                            <div className="space-y-2">
                                <Label>Document Note</Label>
                                <Textarea
                                    value={documentNote}
                                    onChange={(e) => setDocumentNote(e.target.value)}
                                />
                            </div>

                            {/* Equipment Items */}
                            <div className="space-y-2">
                                <Label>Equipment *</Label>
                                {equipmentItems.map((item, index) => (
                                    <div key={index} className="p-3 border rounded-md relative mb-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                            <div>
                                                <Label htmlFor={`equipment-${index}`} className='mb-2'>Equipment</Label>
                                                <Select
                                                    value={item.equipment_id}
                                                    onValueChange={(value) => handleEquipmentChange(index, 'equipment_id', value)}
                                                >
                                                    <SelectTrigger className="mt-1">
                                                        <SelectValue placeholder="Select equipment" />
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
                                                <Label htmlFor={`quantity-${index}`} className='mb-2'>Quantity</Label>
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
                                                <Label htmlFor={`condition-${index}`} className='mb-2'>Condition</Label>
                                                <Select
                                                    value={item.condition}
                                                    onValueChange={(value) => handleEquipmentChange(index, 'condition', value)}
                                                >
                                                    <SelectTrigger className="mt-1">
                                                        <SelectValue placeholder="Select condition" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="good">Good</SelectItem>
                                                        <SelectItem value="damaged">Damaged</SelectItem>
                                                        <SelectItem value="lost">Lost</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
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
                                    Add Equipment
                                </Button>
                            </div>
                        </div>

                        <div className="flex justify-between gap-2">
                            <Button type="button" variant="outline" onClick={() => navigate('/handovers')}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? 'Saving...' : 'Save Handover'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

export default HandoverForm;