import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Plus, X, BarChart3 } from 'lucide-react';

export default function PollCreator() {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [allowMultiple, setAllowMultiple] = useState(false);
  const [duration, setDuration] = useState('24'); // hours

  const addOption = () => {
    if (options.length < 6) { // Max 6 options
      setOptions([...options, '']);
    }
  };

  const removeOption = (index) => {
    if (options.length > 2) { // Min 2 options
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const isValid = () => {
    return question.trim() && options.every(opt => opt.trim()) && options.length >= 2;
  };

  return (
    <div className="space-y-4">
      {/* Poll Question */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Poll Question</label>
        <Input
          placeholder="Ask a question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          maxLength={200}
          className="text-lg"
        />
        <div className="text-xs text-muted-foreground text-right">
          {question.length}/200
        </div>
      </div>

      <Separator />

      {/* Poll Options */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          <label className="text-sm font-medium">Options</label>
        </div>
        
        {options.map((option, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="flex-1">
              <Input
                placeholder={`Option ${index + 1}`}
                value={option}
                onChange={(e) => updateOption(index, e.target.value)}
                maxLength={100}
              />
            </div>
            {options.length > 2 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeOption(index)}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}

        {options.length < 6 && (
          <Button
            variant="outline"
            size="sm"
            onClick={addOption}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Option
          </Button>
        )}
      </div>

      <Separator />

      {/* Poll Settings */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Allow multiple choices</label>
          <Button
            variant={allowMultiple ? "default" : "outline"}
            size="sm"
            onClick={() => setAllowMultiple(!allowMultiple)}
          >
            {allowMultiple ? 'Yes' : 'No'}
          </Button>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Poll duration</label>
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full p-2 border border-input rounded-md bg-background"
          >
            <option value="1">1 hour</option>
            <option value="6">6 hours</option>
            <option value="12">12 hours</option>
            <option value="24">1 day</option>
            <option value="72">3 days</option>
            <option value="168">1 week</option>
          </select>
        </div>
      </div>

      {/* Preview */}
      <Card className="p-4 bg-muted/20">
        <div className="space-y-3">
          <h3 className="font-medium">Preview</h3>
          <div className="space-y-2">
            <p className="font-medium">{question || 'Your poll question will appear here'}</p>
            <div className="space-y-1">
              {options.map((option, index) => (
                <div key={index} className="flex items-center gap-2 p-2 border rounded">
                  <div className="w-4 h-4 border rounded-sm bg-background"></div>
                  <span className="text-sm">{option || `Option ${index + 1}`}</span>
                </div>
              ))}
            </div>
            <div className="text-xs text-muted-foreground">
              {allowMultiple ? 'Multiple choices allowed' : 'Single choice only'} • 
              Ends in {duration === '1' ? '1 hour' : 
                     duration === '6' ? '6 hours' :
                     duration === '12' ? '12 hours' :
                     duration === '24' ? '1 day' :
                     duration === '72' ? '3 days' : '1 week'}
            </div>
          </div>
        </div>
      </Card>

      {/* Validation Message */}
      {!isValid() && (
        <div className="text-sm text-muted-foreground">
          Please fill in the question and all options to create your poll.
        </div>
      )}
    </div>
  );
}

