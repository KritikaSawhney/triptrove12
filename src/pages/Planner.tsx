
import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, addDays, differenceInDays, isSameDay } from 'date-fns';
import { PlusCircle, CalendarIcon, Clock, MapPin, CalendarDays, Edit, Trash, Save, X, Sun, Moon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/sonner';
import TypewriterText from '@/components/TypewriterText';

// Trip data interface
interface Activity {
  id: string;
  title: string;
  description: string;
  time: string;
  location: string;
  type: 'attraction' | 'food' | 'transport' | 'accommodation' | 'other';
}

interface Trip {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  location: string;
  activities: Record<string, Activity[]>;
}

const ACTIVITY_TYPES = [
  { value: 'attraction', label: 'Attraction', emoji: '🏛️' },
  { value: 'food', label: 'Food & Drinks', emoji: '🍽️' },
  { value: 'transport', label: 'Transport', emoji: '🚌' },
  { value: 'accommodation', label: 'Accommodation', emoji: '🏨' },
  { value: 'other', label: 'Other', emoji: '📌' },
];

const getActivityEmoji = (type: string) => {
  return ACTIVITY_TYPES.find(t => t.value === type)?.emoji || '📌';
};

const getActivityColor = (type: string) => {
  switch(type) {
    case 'attraction': return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200';
    case 'food': return 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-200';
    case 'transport': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200';
    case 'accommodation': return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200';
    default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200';
  }
};

// Sample data
const sampleTrips: Trip[] = [
  {
    id: '1',
    title: 'Paris Getaway',
    startDate: new Date(2025, 8, 10),
    endDate: new Date(2025, 8, 15),
    location: 'Paris, France',
    activities: {
      '2025-09-10': [
        {
          id: '1',
          title: 'Eiffel Tower Visit',
          description: 'Visit the iconic Eiffel Tower',
          time: '10:00',
          location: 'Eiffel Tower, Paris',
          type: 'attraction'
        },
        {
          id: '2',
          title: 'Lunch at Le Jules Verne',
          description: 'Enjoy a fine dining experience',
          time: '13:00',
          location: 'Le Jules Verne, Eiffel Tower',
          type: 'food'
        }
      ],
      '2025-09-11': [
        {
          id: '3',
          title: 'Louvre Museum',
          description: 'Explore world-famous art collections',
          time: '09:30',
          location: 'Louvre Museum, Paris',
          type: 'attraction'
        }
      ]
    }
  }
];

const Planner = () => {
  const [trips, setTrips] = useState<Trip[]>(sampleTrips);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(trips[0]?.id || null);
  const [newTripTitle, setNewTripTitle] = useState('');
  const [newTripLocation, setNewTripLocation] = useState('');
  const [newTripDateRange, setNewTripDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(trips[0]?.startDate || null);
  const [showNewTripForm, setShowNewTripForm] = useState(false);
  const [showNewActivityForm, setShowNewActivityForm] = useState(false);
  const [newActivity, setNewActivity] = useState<Omit<Activity, 'id'>>({
    title: '',
    description: '',
    time: '',
    location: '',
    type: 'attraction'
  });
  const [editingActivityId, setEditingActivityId] = useState<string | null>(null);

  const selectedTrip = trips.find(trip => trip.id === selectedTripId) || null;
  
  const selectedDateStr = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';
  const activitiesForSelectedDate = selectedTrip?.activities[selectedDateStr] || [];

  const handleAddTrip = () => {
    if (!newTripTitle || !newTripDateRange.from || !newTripDateRange.to || !newTripLocation) {
      toast.error("Please fill in all trip details");
      return;
    }

    const newTrip: Trip = {
      id: Date.now().toString(),
      title: newTripTitle,
      startDate: newTripDateRange.from,
      endDate: newTripDateRange.to,
      location: newTripLocation,
      activities: {}
    };

    setTrips([...trips, newTrip]);
    setSelectedTripId(newTrip.id);
    setSelectedDate(newTrip.startDate);
    setShowNewTripForm(false);
    setNewTripTitle('');
    setNewTripDateRange({ from: undefined, to: undefined });
    setNewTripLocation('');
    
    toast.success("Trip added successfully!", {
      description: `${newTripTitle} has been created.`
    });
  };

  const handleDeleteTrip = (tripId: string) => {
    if (confirm("Are you sure you want to delete this trip?")) {
      const updatedTrips = trips.filter(trip => trip.id !== tripId);
      setTrips(updatedTrips);
      
      if (selectedTripId === tripId) {
        setSelectedTripId(updatedTrips[0]?.id || null);
        setSelectedDate(updatedTrips[0]?.startDate || null);
      }
      
      toast.success("Trip deleted successfully");
    }
  };

  const handleAddActivity = () => {
    if (!newActivity.title || !newActivity.time || !selectedTrip || !selectedDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    const newId = Date.now().toString();

    const updatedTrips = trips.map(trip => {
      if (trip.id === selectedTrip.id) {
        const updatedActivities = { ...trip.activities };
        if (!updatedActivities[dateKey]) {
          updatedActivities[dateKey] = [];
        }

        if (editingActivityId) {
          // Edit existing activity
          updatedActivities[dateKey] = updatedActivities[dateKey].map(activity => 
            activity.id === editingActivityId 
              ? { ...newActivity, id: editingActivityId } 
              : activity
          );
        } else {
          // Add new activity
          updatedActivities[dateKey] = [
            ...updatedActivities[dateKey],
            { ...newActivity, id: newId }
          ];
        }

        return {
          ...trip,
          activities: updatedActivities
        };
      }
      return trip;
    });

    setTrips(updatedTrips);
    setShowNewActivityForm(false);
    setNewActivity({
      title: '',
      description: '',
      time: '',
      location: '',
      type: 'attraction'
    });
    setEditingActivityId(null);
    
    toast.success(editingActivityId ? "Activity updated successfully!" : "Activity added successfully!");
  };

  const handleEditActivity = (activity: Activity) => {
    setNewActivity({
      title: activity.title,
      description: activity.description,
      time: activity.time,
      location: activity.location,
      type: activity.type
    });
    setEditingActivityId(activity.id);
    setShowNewActivityForm(true);
  };

  const handleDeleteActivity = (activityId: string) => {
    if (!selectedTrip || !selectedDate) return;
    
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    
    const updatedTrips = trips.map(trip => {
      if (trip.id === selectedTrip.id) {
        const updatedActivities = { ...trip.activities };
        if (updatedActivities[dateKey]) {
          updatedActivities[dateKey] = updatedActivities[dateKey].filter(
            activity => activity.id !== activityId
          );
        }
        return {
          ...trip,
          activities: updatedActivities
        };
      }
      return trip;
    });
    
    setTrips(updatedTrips);
    toast.success("Activity deleted successfully");
  };

  const getTripDaysArray = (trip: Trip) => {
    const days = [];
    const dayCount = differenceInDays(trip.endDate, trip.startDate) + 1;
    
    for (let i = 0; i < dayCount; i++) {
      days.push(addDays(trip.startDate, i));
    }
    
    return days;
  };

  const getCountdown = (trip: Trip) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const start = new Date(trip.startDate);
    start.setHours(0, 0, 0, 0);
    
    const daysUntilTrip = differenceInDays(start, today);
    
    if (daysUntilTrip < 0) {
      const end = new Date(trip.endDate);
      end.setHours(0, 0, 0, 0);
      
      if (differenceInDays(end, today) < 0) {
        return "Trip completed";
      }
      return "Trip in progress";
    }
    
    return daysUntilTrip === 0 ? "Trip starts today" : `${daysUntilTrip} days until trip`;
  };
  
  const activityTimeDisplay = (time: string) => {
    try {
      const [hours, minutes] = time.split(':').map(Number);
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    } catch (e) {
      return time;
    }
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <div className="container py-8 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 right-20 text-primary/10 z-0"
          animate={{ 
            rotate: 360,
            scale: [1, 1.05, 1],
          }}
          transition={{ 
            rotate: { duration: 60, repeat: Infinity, ease: "linear" },
            scale: { duration: 8, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <CalendarDays size={180} />
        </motion.div>
        
        <motion.div
          className="absolute bottom-40 left-20 text-secondary/10 z-0"
          animate={{ 
            rotate: -360,
            y: [0, -20, 0],
          }}
          transition={{ 
            rotate: { duration: 80, repeat: Infinity, ease: "linear" },
            y: { duration: 10, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <MapPin size={150} />
        </motion.div>
      </div>
      
      <motion.div 
        className="relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div 
          className="flex flex-col space-y-2 mb-8"
          variants={itemVariants}
        >
          <div className="flex items-center gap-3">
            <motion.span
              className="text-4xl"
              animate={{ 
                rotate: [0, 10, 0, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 5, repeat: Infinity }}
            >
              🗓️
            </motion.span>
            <h1 className="text-3xl font-bold">
              <TypewriterText text="Trip Planner" />
            </h1>
          </div>
          <p className="text-muted-foreground ml-12">
            Plan your travels day by day and keep track of all activities
          </p>
        </motion.div>
        
        {/* Trip selection and management */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
          variants={itemVariants}
        >
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>My Trips</span>
                  <motion.button 
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-primary"
                    onClick={() => setShowNewTripForm(!showNewTripForm)}
                  >
                    {showNewTripForm ? <X /> : <PlusCircle />}
                  </motion.button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AnimatePresence>
                  {showNewTripForm && (
                    <motion.div 
                      className="space-y-4 mb-6 p-4 border rounded-md"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="font-medium">New Trip</h3>
                      <Input
                        placeholder="Trip title"
                        value={newTripTitle}
                        onChange={(e) => setNewTripTitle(e.target.value)}
                        className="mb-2"
                      />
                      <Input
                        placeholder="Location"
                        value={newTripLocation}
                        onChange={(e) => setNewTripLocation(e.target.value)}
                        className="mb-2"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-sm text-muted-foreground">Start Date</label>
                          <Input
                            type="date"
                            onChange={(e) => setNewTripDateRange(prev => ({ 
                              ...prev, 
                              from: e.target.value ? new Date(e.target.value) : undefined 
                            }))}
                          />
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground">End Date</label>
                          <Input
                            type="date"
                            onChange={(e) => setNewTripDateRange(prev => ({ 
                              ...prev, 
                              to: e.target.value ? new Date(e.target.value) : undefined 
                            }))}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button onClick={handleAddTrip}>Add Trip</Button>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {trips.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <motion.div 
                      className="text-4xl mb-2"
                      animate={{ 
                        y: [0, -10, 0],
                        rotate: [0, 5, 0, -5, 0]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      🧳
                    </motion.div>
                    <p>No trips yet. Create your first trip!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <AnimatePresence>
                      {trips.map((trip) => (
                        <motion.div
                          key={trip.id}
                          variants={itemVariants}
                          initial="hidden"
                          animate="visible"
                          exit={{ opacity: 0, y: 20 }}
                        >
                          <Card 
                            className={`cursor-pointer transition-all ${selectedTripId === trip.id ? 'border-primary shadow-md' : ''}`}
                            onClick={() => {
                              setSelectedTripId(trip.id);
                              setSelectedDate(trip.startDate);
                            }}
                          >
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium">{trip.title}</p>
                                  <div className="flex items-center text-sm text-muted-foreground">
                                    <MapPin size={12} className="mr-1" />
                                    {trip.location}
                                  </div>
                                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                                    <CalendarIcon size={12} className="mr-1" />
                                    {format(trip.startDate, 'MMM d')} - {format(trip.endDate, 'MMM d, yyyy')}
                                  </div>
                                </div>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  className="text-destructive hover:text-destructive/80"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteTrip(trip.id);
                                  }}
                                >
                                  <Trash size={16} />
                                </motion.button>
                              </div>
                              <motion.div 
                                className="mt-2"
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                              >
                                <Badge variant="outline" className="text-xs">
                                  {getCountdown(trip)}
                                </Badge>
                              </motion.div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {selectedTrip ? (
            <>
              <motion.div 
                className="lg:col-span-2"
                variants={itemVariants}
              >
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{selectedTrip.title}</span>
                      <Badge variant="outline" className="ml-2 font-normal">
                        {getCountdown(selectedTrip)}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="flex items-center">
                      <MapPin size={14} className="mr-1" /> {selectedTrip.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <Calendar
                        mode="single"
                        selected={selectedDate || undefined}
                        onSelect={(date) => setSelectedDate(date)}
                        disabled={(date) => {
                          if (!selectedTrip) return true;
                          return date < selectedTrip.startDate || date > selectedTrip.endDate;
                        }}
                        className="rounded-md border"
                        classNames={{
                          day_selected: 'bg-primary text-primary-foreground',
                          day_today: 'bg-accent text-accent-foreground',
                        }}
                        modifiers={{
                          booked: getTripDaysArray(selectedTrip),
                        }}
                        modifiersClassNames={{
                          booked: 'border-2 border-primary',
                        }}
                      />
                    </div>
                    
                    {selectedDate && (
                      <motion.div 
                        className="space-y-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium">
                            {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                          </h3>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                              setShowNewActivityForm(!showNewActivityForm);
                              if (!showNewActivityForm) {
                                setNewActivity({
                                  title: '',
                                  description: '',
                                  time: '',
                                  location: '',
                                  type: 'attraction'
                                });
                                setEditingActivityId(null);
                              }
                            }}
                            className="text-primary"
                          >
                            {showNewActivityForm ? <X /> : <PlusCircle />}
                          </motion.button>
                        </div>
                        
                        <AnimatePresence>
                          {showNewActivityForm && (
                            <motion.div 
                              className="border rounded-md p-4 space-y-4"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <h4 className="text-sm font-medium">
                                {editingActivityId ? 'Edit Activity' : 'New Activity'}
                              </h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <label className="text-sm text-muted-foreground">Title</label>
                                  <Input
                                    placeholder="Activity title"
                                    value={newActivity.title}
                                    onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-sm text-muted-foreground">Time</label>
                                  <Input
                                    type="time"
                                    value={newActivity.time}
                                    onChange={(e) => setNewActivity({ ...newActivity, time: e.target.value })}
                                  />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm text-muted-foreground">Location</label>
                                <Input
                                  placeholder="Activity location"
                                  value={newActivity.location}
                                  onChange={(e) => setNewActivity({ ...newActivity, location: e.target.value })}
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm text-muted-foreground">Type</label>
                                <Select 
                                  value={newActivity.type} 
                                  onValueChange={(value: string) => setNewActivity({
                                    ...newActivity, 
                                    type: value as Activity['type']
                                  })}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {ACTIVITY_TYPES.map((type) => (
                                      <SelectItem key={type.value} value={type.value}>
                                        <span className="flex items-center">
                                          <span className="mr-2">{type.emoji}</span>
                                          {type.label}
                                        </span>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm text-muted-foreground">Description</label>
                                <Input
                                  placeholder="Activity description (optional)"
                                  value={newActivity.description}
                                  onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                                />
                              </div>
                              <div className="flex justify-end">
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                  <Button onClick={handleAddActivity}>
                                    {editingActivityId ? (
                                      <>
                                        <Save size={16} className="mr-2" /> Update Activity
                                      </>
                                    ) : (
                                      <>
                                        <PlusCircle size={16} className="mr-2" /> Add Activity
                                      </>
                                    )}
                                  </Button>
                                </motion.div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                        
                        {activitiesForSelectedDate.length === 0 ? (
                          <motion.div 
                            className="text-center py-8 text-muted-foreground"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                          >
                            <motion.div 
                              className="text-4xl mb-2"
                              animate={{ 
                                scale: [1, 1.1, 1],
                                rotate: [0, 5, 0, -5, 0]
                              }}
                              transition={{ duration: 4, repeat: Infinity }}
                            >
                              📝
                            </motion.div>
                            <p>No activities planned for this day</p>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                              <Button 
                                variant="outline" 
                                className="mt-2"
                                onClick={() => setShowNewActivityForm(true)}
                              >
                                Plan Activity
                              </Button>
                            </motion.div>
                          </motion.div>
                        ) : (
                          <div className="space-y-4">
                            <Tabs defaultValue="day" className="w-full">
                              <TabsList className="grid grid-cols-2">
                                <TabsTrigger value="day" className="flex items-center gap-1">
                                  <Sun className="h-4 w-4" /> 
                                  Day View
                                </TabsTrigger>
                                <TabsTrigger value="timeline" className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" /> 
                                  Timeline
                                </TabsTrigger>
                              </TabsList>
                              
                              <TabsContent value="day" className="mt-4">
                                <div className="space-y-3">
                                  <AnimatePresence>
                                    {activitiesForSelectedDate
                                      .sort((a, b) => a.time.localeCompare(b.time))
                                      .map((activity, index) => (
                                        <motion.div
                                          key={activity.id}
                                          initial={{ opacity: 0, y: 20 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          exit={{ opacity: 0, height: 0 }}
                                          transition={{ delay: index * 0.1 }}
                                        >
                                          <Card>
                                            <CardContent className="p-4">
                                              <div className="flex justify-between items-start">
                                                <div className="flex items-start gap-3">
                                                  <div className={`rounded-full p-2 ${getActivityColor(activity.type)}`}>
                                                    <span className="text-lg">{getActivityEmoji(activity.type)}</span>
                                                  </div>
                                                  <div>
                                                    <p className="font-medium">{activity.title}</p>
                                                    {activity.description && (
                                                      <p className="text-sm text-muted-foreground mt-1">
                                                        {activity.description}
                                                      </p>
                                                    )}
                                                    <div className="flex flex-wrap gap-4 mt-2">
                                                      <div className="flex items-center text-sm text-muted-foreground">
                                                        <Clock size={12} className="mr-1" />
                                                        {activityTimeDisplay(activity.time)}
                                                      </div>
                                                      {activity.location && (
                                                        <div className="flex items-center text-sm text-muted-foreground">
                                                          <MapPin size={12} className="mr-1" />
                                                          {activity.location}
                                                        </div>
                                                      )}
                                                    </div>
                                                  </div>
                                                </div>
                                                <div className="flex gap-2">
                                                  <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => handleEditActivity(activity)}
                                                    className="text-muted-foreground hover:text-foreground"
                                                  >
                                                    <Edit size={16} />
                                                  </motion.button>
                                                  <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => handleDeleteActivity(activity.id)}
                                                    className="text-destructive hover:text-destructive/80"
                                                  >
                                                    <Trash size={16} />
                                                  </motion.button>
                                                </div>
                                              </div>
                                            </CardContent>
                                          </Card>
                                        </motion.div>
                                      ))}
                                  </AnimatePresence>
                                </div>
                              </TabsContent>
                              
                              <TabsContent value="timeline" className="mt-4">
                                <div className="relative pl-6 border-l-2 border-muted">
                                  <AnimatePresence>
                                    {activitiesForSelectedDate
                                      .sort((a, b) => a.time.localeCompare(b.time))
                                      .map((activity, index) => (
                                        <motion.div
                                          key={activity.id}
                                          className="mb-6 relative"
                                          initial={{ opacity: 0, x: -20 }}
                                          animate={{ opacity: 1, x: 0 }}
                                          exit={{ opacity: 0, x: -20 }}
                                          transition={{ delay: index * 0.1 }}
                                        >
                                          <div className="absolute -left-[26px] rounded-full p-2 bg-background border-2 border-muted">
                                            <span className="text-sm">{getActivityEmoji(activity.type)}</span>
                                          </div>
                                          <p className="font-medium">{activity.title}</p>
                                          <div className="flex items-center text-sm text-muted-foreground">
                                            <Clock size={12} className="mr-1" />
                                            {activityTimeDisplay(activity.time)}
                                          </div>
                                          {activity.location && (
                                            <div className="flex items-center text-sm text-muted-foreground">
                                              <MapPin size={12} className="mr-1" />
                                              {activity.location}
                                            </div>
                                          )}
                                          {activity.description && (
                                            <p className="text-sm text-muted-foreground mt-1">
                                              {activity.description}
                                            </p>
                                          )}
                                          <div className="absolute right-0 top-0 flex gap-2">
                                            <motion.button
                                              whileHover={{ scale: 1.1 }}
                                              whileTap={{ scale: 0.9 }}
                                              onClick={() => handleEditActivity(activity)}
                                              className="text-muted-foreground hover:text-foreground"
                                            >
                                              <Edit size={16} />
                                            </motion.button>
                                            <motion.button
                                              whileHover={{ scale: 1.1 }}
                                              whileTap={{ scale: 0.9 }}
                                              onClick={() => handleDeleteActivity(activity.id)}
                                              className="text-destructive hover:text-destructive/80"
                                            >
                                              <Trash size={16} />
                                            </motion.button>
                                          </div>
                                        </motion.div>
                                      ))}
                                  </AnimatePresence>
                                </div>
                              </TabsContent>
                            </Tabs>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </>
          ) : (
            <motion.div 
              className="lg:col-span-2 flex items-center justify-center"
              variants={itemVariants}
            >
              <Card className="w-full text-center py-12">
                <CardContent>
                  <motion.div
                    className="text-5xl mb-4 inline-block"
                    animate={{ 
                      rotate: [0, 5, 0, -5, 0],
                      y: [0, -10, 0]
                    }}
                    transition={{ duration: 5, repeat: Infinity }}
                  >
                    ✈️
                  </motion.div>
                  <h3 className="text-xl font-medium mb-2">No Trip Selected</h3>
                  <p className="text-muted-foreground mb-6">
                    Create a new trip or select an existing one to start planning
                  </p>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button onClick={() => setShowNewTripForm(true)}>
                      <PlusCircle className="mr-2" /> Create New Trip
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
        
        {/* Tips section */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <motion.span
                  className="mr-2"
                  animate={{ rotate: [0, 10, 0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  💡
                </motion.span>
                Travel Planning Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <motion.div variants={itemVariants} className="hover-float">
                  <Card className="h-full">
                    <CardContent className="pt-4">
                      <p className="font-medium mb-1">🧳 Packing List</p>
                      <p className="text-sm text-muted-foreground">
                        Create a comprehensive packing list early to avoid forgetting essentials
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
                <motion.div variants={itemVariants} className="hover-float">
                  <Card className="h-full">
                    <CardContent className="pt-4">
                      <p className="font-medium mb-1">💳 Local Currency</p>
                      <p className="text-sm text-muted-foreground">
                        Check exchange rates and have local currency ready upon arrival
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
                <motion.div variants={itemVariants} className="hover-float">
                  <Card className="h-full">
                    <CardContent className="pt-4">
                      <p className="font-medium mb-1">🗺️ Download Maps</p>
                      <p className="text-sm text-muted-foreground">
                        Download offline maps of your destination for navigation without internet
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Planner;
