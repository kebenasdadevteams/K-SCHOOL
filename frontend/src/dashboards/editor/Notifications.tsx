import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';

const items = [
  { title: 'Content review requested', detail: 'A new sermon draft is ready for your review.', time: '10 min ago', state: 'new' },
  { title: 'Podcast scheduled', detail: 'The youth podcast has been added to the editorial calendar.', time: '45 min ago', state: 'info' },
  { title: 'Publishing reminder', detail: 'Your weekly devotional is due for publication today.', time: '2 hrs ago', state: 'pending' },
];

export default function Notifications() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Notifications</h1>
        <p className="text-muted-foreground">Stay updated on publishing tasks, reminders, and team activity.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent activity</CardTitle>
          <CardDescription>Latest updates for your editorial workspace.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {items.map((item) => (
            <div key={item.title} className="rounded-lg border bg-muted/40 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{item.detail}</p>
                </div>
                <Badge variant={item.state === 'new' ? 'default' : item.state === 'pending' ? 'secondary' : 'outline'}>
                  {item.state}
                </Badge>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">{item.time}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
