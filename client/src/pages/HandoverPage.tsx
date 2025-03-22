import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Button } from '../components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import type { Handover } from '../types';

function HandoversPage(): React.ReactElement {
  const [handovers, setHandovers] = useState<Handover[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHandovers();
  }, []);

  const fetchHandovers = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await axios.get<Handover[]>(`${process.env.API_HOST}/api/handovers`);
      setHandovers(response.data);
    } catch (error) {
      console.error('Error fetching handovers:', error);
      toast.error("Failed to load handovers", {
        description: "There was a problem fetching the handover data.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  // Handle row click to redirect to the detailed handover page
  const handleRowClick = (handoverId: number): void => {
    navigate(`/handover/${handoverId}`);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Handovers</h1>
        <Button onClick={() => navigate('/handover/create')}>
          <Plus className="mr-2 h-4 w-4" />Create New Handover
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Handover List</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
            </div>
          ) : (
            <div className="bg-white rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Handover ID</TableHead>
                    <TableHead>Handover Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {handovers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-4">
                        No handovers found. Create your first handover to get started.
                      </TableCell>
                    </TableRow>
                  ) : (
                    handovers.map((handover) => (
                      <TableRow
                        key={handover.handover_id}
                        onClick={() => handleRowClick(handover.handover_id)}
                        className="cursor-pointer hover:bg-gray-50"
                      >
                        <TableCell>{handover.handover_id}</TableCell>
                        <TableCell>{formatDate(handover.handover_date)}</TableCell>
                        <TableCell>{handover.status}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default HandoversPage;