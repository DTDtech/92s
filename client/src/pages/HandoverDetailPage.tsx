import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { useParams, useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Button } from '../components/ui/button';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import type { Handover } from '../types';

function HandoverDetailPage(): React.ReactElement {
    const { id } = useParams<{ id: string }>();
    const [handover, setHandover] = useState<Handover | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchHandover();
    }, [id]);

    const fetchHandover = async (): Promise<void> => {
        try {
            setLoading(true);
            const response = await axios.get<Handover>(`${process.env.API_HOST}/api/handovers/${id}`);
            setHandover(response.data);
        } catch (error) {
            console.error('Error fetching handover:', error);
            toast.error("Failed to load handover", {
                description: "There was a problem fetching the handover data.",
            });
            navigate('/handovers'); // Redirect to the handovers list if the handover is not found
        } finally {
            setLoading(false);
        }
    };

    // Format date for display
    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    if (loading) {
        return (
            <div className="flex justify-center py-6">
                <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
            </div>
        );
    }

    if (!handover) {
        return <div className="text-center py-6">Handover not found.</div>;
    }

    return (
        <div className="container mx-auto py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Handover Details</h1>
                <Button onClick={() => navigate('/handovers')}>
                    Back to Handovers
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Handover #{handover.handover_id}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <p className="font-semibold">Handover Date:</p>
                            <p>{formatDate(handover.handover_date)}</p>
                        </div>
                        <div>
                            <p className="font-semibold">Status:</p>
                            <p>{handover.status}</p>
                        </div>

                        {/* Customer Document Image */}
                        <div>
                            <p className="font-semibold">Customer Document Image:</p>
                            {handover.customer_document_image ? (
                                <img
                                    src={handover.customer_document_image}
                                    alt="Customer Document"
                                    className="w-48 h-48 object-cover rounded-md"
                                />
                            ) : (
                                <p>No document image uploaded.</p>
                            )}
                        </div>

                        {/* Equipment Images */}
                        <div>
                            <p className="font-semibold">Equipment Images:</p>
                            <div className="flex gap-2">
                                {handover.equipment_images?.map((image, index) => (
                                    <img
                                        key={index}
                                        src={image}
                                        alt={`Equipment ${index + 1}`}
                                        className="w-24 h-24 object-cover rounded-md"
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Notes */}
                        <div>
                            <p className="font-semibold">Personal Document Note:</p>
                            <p>{handover.personal_document_note || 'No note provided.'}</p>
                        </div>
                        <div>
                            <p className="font-semibold">Document Note:</p>
                            <p>{handover.document_note || 'No note provided.'}</p>
                        </div>

                        {/* Equipment Items */}
                        <div>
                            <h4 className="font-semibold mb-2">Equipment Items</h4>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Equipment</TableHead>
                                        <TableHead className="text-center">Quantity</TableHead>
                                        <TableHead className="text-right">Condition</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {handover.equipment_items.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{item.name}</TableCell>
                                            <TableCell className="text-center">{item.quantity}</TableCell>
                                            <TableCell className="text-right">{item.condition}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default HandoverDetailPage;