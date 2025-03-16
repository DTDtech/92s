import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { EventSourceInput } from '@fullcalendar/core';


function CalendarPage(): React.ReactElement {
  const [loading, setLoading] = useState<boolean>(true);

  const fetchEvents = async (info: any, successCallback: Function, failureCallback: Function): Promise<void> => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.API_HOST}/api/events`);
      successCallback(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error("Failed to load calendar events", {
        description: "There was a problem fetching the calendar data."
      });
      failureCallback(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Lịch thuê thiết bị</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lịch thuê</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && (
            <div className="text-center py-4">Loading calendar...</div>
          )}
          <div className={loading ? 'opacity-50' : ''}>
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,listWeek'
              }}
              events={fetchEvents as EventSourceInput}
              height="auto"
              eventTimeFormat={{
                hour: '2-digit',
                minute: '2-digit',
                meridiem: false
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default CalendarPage;
