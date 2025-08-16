import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, MapPin, Users, Link as LinkIcon } from 'lucide-react';

export default function EventCreator() {
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    location: '',
    isVirtual: false,
    virtualLink: '',
    maxAttendees: '',
    tags: '',
    isPublic: true
  });

  const updateField = (field, value) => {
    setEventData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isValid = () => {
    return eventData.title.trim() && 
           eventData.startDate && 
           eventData.startTime && 
           (eventData.location.trim() || (eventData.isVirtual && eventData.virtualLink.trim()));
  };

  const formatDateTime = (date, time) => {
    if (!date || !time) return '';
    const dateObj = new Date(`${date}T${time}`);
    return dateObj.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-4">
      {/* Event Title */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Event Title</label>
        <Input
          placeholder="Enter event title..."
          value={eventData.title}
          onChange={(e) => updateField('title', e.target.value)}
          maxLength={100}
          className="text-lg"
        />
        <div className="text-xs text-muted-foreground text-right">
          {eventData.title.length}/100
        </div>
      </div>

      {/* Event Description */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <textarea
          placeholder="Describe your event..."
          value={eventData.description}
          onChange={(e) => updateField('description', e.target.value)}
          maxLength={500}
          rows={3}
          className="w-full p-3 border border-input rounded-md bg-background resize-none"
        />
        <div className="text-xs text-muted-foreground text-right">
          {eventData.description.length}/500
        </div>
      </div>

      <Separator />

      {/* Date and Time */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <label className="text-sm font-medium">Date & Time</label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Start Date</label>
            <Input
              type="date"
              value={eventData.startDate}
              onChange={(e) => updateField('startDate', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Start Time</label>
            <Input
              type="time"
              value={eventData.startTime}
              onChange={(e) => updateField('startTime', e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">End Date (Optional)</label>
            <Input
              type="date"
              value={eventData.endDate}
              onChange={(e) => updateField('endDate', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">End Time (Optional)</label>
            <Input
              type="time"
              value={eventData.endTime}
              onChange={(e) => updateField('endTime', e.target.value)}
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Location */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <label className="text-sm font-medium">Location</label>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant={!eventData.isVirtual ? "default" : "outline"}
            size="sm"
            onClick={() => updateField('isVirtual', false)}
          >
            In-Person
          </Button>
          <Button
            variant={eventData.isVirtual ? "default" : "outline"}
            size="sm"
            onClick={() => updateField('isVirtual', true)}
          >
            Virtual
          </Button>
        </div>

        {eventData.isVirtual ? (
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Meeting Link</label>
            <Input
              placeholder="https://zoom.us/j/..."
              value={eventData.virtualLink}
              onChange={(e) => updateField('virtualLink', e.target.value)}
            />
          </div>
        ) : (
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Venue Address</label>
            <Input
              placeholder="Enter venue address..."
              value={eventData.location}
              onChange={(e) => updateField('location', e.target.value)}
            />
          </div>
        )}
      </div>

      <Separator />

      {/* Additional Settings */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Max Attendees
            </label>
            <Input
              type="number"
              placeholder="No limit"
              value={eventData.maxAttendees}
              onChange={(e) => updateField('maxAttendees', e.target.value)}
              min="1"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Tags</label>
            <Input
              placeholder="tech, ai, networking"
              value={eventData.tags}
              onChange={(e) => updateField('tags', e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Public Event</label>
          <Button
            variant={eventData.isPublic ? "default" : "outline"}
            size="sm"
            onClick={() => updateField('isPublic', !eventData.isPublic)}
          >
            {eventData.isPublic ? 'Public' : 'Private'}
          </Button>
        </div>
      </div>

      {/* Preview */}
      <Card className="p-4 bg-muted/20">
        <div className="space-y-3">
          <h3 className="font-medium">Preview</h3>
          <div className="space-y-2">
            <h4 className="font-medium text-lg">
              {eventData.title || 'Your event title will appear here'}
            </h4>
            
            {eventData.description && (
              <p className="text-sm text-muted-foreground">{eventData.description}</p>
            )}

            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {eventData.startDate && eventData.startTime ? 
                  formatDateTime(eventData.startDate, eventData.startTime) : 
                  'Date & time to be set'
                }
              </div>
            </div>

            <div className="flex items-center gap-1 text-sm">
              <MapPin className="h-3 w-3" />
              {eventData.isVirtual ? 
                (eventData.virtualLink ? 'Virtual Event' : 'Virtual location to be set') :
                (eventData.location || 'Location to be set')
              }
            </div>

            {eventData.maxAttendees && (
              <div className="flex items-center gap-1 text-sm">
                <Users className="h-3 w-3" />
                Max {eventData.maxAttendees} attendees
              </div>
            )}

            {eventData.tags && (
              <div className="flex gap-1 flex-wrap">
                {eventData.tags.split(',').map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                    {tag.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Validation Message */}
      {!isValid() && (
        <div className="text-sm text-muted-foreground">
          Please fill in the event title, date, time, and location to create your event.
        </div>
      )}
    </div>
  );
}

