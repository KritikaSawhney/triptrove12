import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  MapPin, 
  Star, 
  Globe, 
  Flag, 
  CloudSun, 
  Mountain, 
  Calendar, 
  Heart, 
  Camera,
  Sparkles,
  Edit,
  Save,
  Award,
  Plane,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import TypewriterText from '@/components/TypewriterText';
import { useToast } from '@/components/ui/use-toast';

interface Country {
  name: string;
  year: string;
  favorite: boolean;
}

interface Achievement {
  name: string;
  icon: JSX.Element;
  description: string;
  date: string;
}

const UserProfile = () => {
  const [editMode, setEditMode] = useState(false);
  const { toast } = useToast();
  
  const [profile, setProfile] = useState({
    name: "Alex Johnson",
    bio: "Travel enthusiast and photographer. I love exploring new cultures, hiking mountains, and trying local cuisine. Currently planning my next adventure!",
    avatar: "https://i.pravatar.cc/300?img=13",
    location: "San Francisco, CA",
    joined: "January 2023",
    travelStyle: ["Adventure", "Cultural", "Photography", "Food", "Backpacking"],
    visitedCountries: [
      { name: "Japan", year: "2023", favorite: true },
      { name: "Italy", year: "2022", favorite: true },
      { name: "Thailand", year: "2022", favorite: false },
      { name: "France", year: "2021", favorite: true },
      { name: "Mexico", year: "2021", favorite: false },
      { name: "Spain", year: "2020", favorite: true },
      { name: "Canada", year: "2020", favorite: false },
      { name: "Portugal", year: "2019", favorite: false },
    ],
    bucketList: [
      "Hike Machu Picchu, Peru",
      "See the Northern Lights in Iceland",
      "Safari in Tanzania",
      "Visit the Great Wall of China",
      "Scuba dive in the Great Barrier Reef"
    ],
    socialMedia: {
      instagram: "@traveler_alex",
      twitter: "@alex_journeys",
      travelBlog: "wanderingwithAlex.com"
    },
    preferredClimate: "Warm",
    preferredAccommodation: "Boutique Hotels",
    travelSeason: "Shoulder Season",
    languages: ["English", "Spanish", "Basic Japanese"],
    travelPreferences: {
      accommodation: 70,
      food: 85,
      activities: 90,
      shopping: 45,
      relaxation: 65
    }
  });

  const [tempProfile, setTempProfile] = useState({...profile});
  
  const achievements: Achievement[] = [
    {
      name: "Globe Trotter",
      icon: <Globe className="h-8 w-8 text-blue-500" />,
      description: "Visited 3 different continents",
      date: "Earned June 2022"
    },
    {
      name: "Mountain Climber",
      icon: <Mountain className="h-8 w-8 text-emerald-500" />,
      description: "Hiked 5 major mountain trails",
      date: "Earned August 2022"
    },
    {
      name: "Cultural Explorer",
      icon: <Flag className="h-8 w-8 text-red-500" />,
      description: "Experienced 10 different cultural events",
      date: "Earned January 2023"
    },
    {
      name: "Photo Master",
      icon: <Camera className="h-8 w-8 text-purple-500" />,
      description: "Shared 100+ travel photos",
      date: "Earned March 2023"
    },
    {
      name: "Food Connoisseur",
      icon: <Heart className="h-8 w-8 text-pink-500" />,
      description: "Tried authentic cuisine in 8 countries",
      date: "Earned May 2023"
    }
  ];
  
  const handleSaveProfile = () => {
    setProfile({...tempProfile});
    setEditMode(false);
    toast({
      title: "Profile Updated!",
      description: "Your changes have been saved successfully."
    });
  };

  const handleAddCountry = () => {
    const newCountry: Country = {
      name: "New Country",
      year: new Date().getFullYear().toString(),
      favorite: false
    };
    
    setTempProfile({
      ...tempProfile,
      visitedCountries: [newCountry, ...tempProfile.visitedCountries]
    });
  };
  
  const handleToggleFavorite = (countryName: string) => {
    if (editMode) {
      setTempProfile({
        ...tempProfile,
        visitedCountries: tempProfile.visitedCountries.map(country => 
          country.name === countryName 
            ? { ...country, favorite: !country.favorite } 
            : country
        )
      });
    } else {
      setProfile({
        ...profile,
        visitedCountries: profile.visitedCountries.map(country => 
          country.name === countryName 
            ? { ...country, favorite: !country.favorite } 
            : country
        )
      });
      
      toast({
        title: "Favorites Updated",
        description: `${countryName} has been updated in your favorites.`
      });
    }
  };
  
  const handleAddBucketListItem = () => {
    setTempProfile({
      ...tempProfile,
      bucketList: [...tempProfile.bucketList, "New bucket list item"]
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const renderStars = () => {
    return Array.from({ length: 30 }).map((_, i) => (
      <motion.div
        key={`star-${i}`}
        className="absolute text-yellow-400"
        style={{ 
          left: `${Math.random() * 100}%`, 
          top: `${Math.random() * 100}%`,
          opacity: Math.random() * 0.7 + 0.3
        }}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.3, 0.7, 0.3]
        }}
        transition={{
          duration: 2 + Math.random() * 3,
          repeat: Infinity,
          delay: Math.random() * 2
        }}
      >
        <Star size={Math.random() * 10 + 5} fill="currentColor" />
      </motion.div>
    ));
  };

  return (
    <div className="container py-8 relative min-h-screen">
      {/* Background star animations */}
      {renderStars()}
      
      {/* Header with animations */}
      <motion.div 
        className="mb-10 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="inline-block mb-4 text-6xl"
          animate={{ 
            rotate: [0, 5, 0, -5, 0],
            y: [0, -5, 0, -5, 0]
          }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          ✈️
        </motion.div>
        <h1 className="text-4xl font-bold mb-4">
          <TypewriterText 
            text="Traveler Profile" 
            speed={50}
            gradientClass="bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text"
          />
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Customize your profile, track your adventures, and share your travel experiences.
        </p>
      </motion.div>
      
      {/* Profile header card with background animation */}
      <div className="grid grid-cols-1 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="overflow-hidden mb-6">
            <div className="h-32 md:h-40 relative bg-gradient-to-r from-blue-600 to-purple-600">
              {/* Animated particles */}
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={`particle-${i}`}
                  className="absolute rounded-full bg-white/20"
                  style={{
                    width: Math.random() * 10 + 5,
                    height: Math.random() * 10 + 5,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -10, 0],
                    opacity: [0.2, 0.8, 0.2],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2
                  }}
                />
              ))}
              
              {/* Animated planes */}
              <motion.div
                className="absolute text-white/30"
                style={{ left: '10%', top: '30%' }}
                animate={{ 
                  x: ['0%', '500%'],
                  y: [0, 10, -10, 20, 0]
                }}
                transition={{ 
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                  y: {
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }}
              >
                <Plane size={24} />
              </motion.div>
              
              <motion.div
                className="absolute text-white/20"
                style={{ left: '80%', top: '60%' }}
                animate={{ 
                  x: ['0%', '-500%'],
                  y: [0, -20, 10, -10, 0]
                }}
                transition={{ 
                  duration: 25,
                  repeat: Infinity,
                  ease: "linear",
                  delay: 5,
                  y: {
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }}
              >
                <Plane size={16} />
              </motion.div>
              
              {/* Edit button */}
              <div className="absolute top-4 right-4">
                <AnimatePresence mode="wait">
                  {editMode ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        onClick={handleSaveProfile}
                        className="mr-2"
                      >
                        <Save size={16} className="mr-1" />
                        Save
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setEditMode(false);
                          setTempProfile({...profile});
                        }}
                      >
                        Cancel
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        onClick={() => setEditMode(true)}
                      >
                        <Edit size={16} className="mr-1" />
                        Edit Profile
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            
            <div className="px-4 pb-4 md:px-8 md:pb-6 -mt-16 relative">
              <div className="flex flex-col md:flex-row md:items-end">
                <div className="z-10">
                  <Avatar className="w-28 h-28 border-4 border-background">
                    <AvatarImage src={profile.avatar} alt={profile.name} className="object-cover" />
                    <AvatarFallback className="text-xl">{profile.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                </div>
                
                <div className="md:ml-4 mt-4 md:mt-0 flex-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                      {editMode ? (
                        <Input
                          value={tempProfile.name}
                          onChange={(e) => setTempProfile({...tempProfile, name: e.target.value})}
                          className="mb-2 text-xl font-bold"
                        />
                      ) : (
                        <h2 className="text-2xl font-bold flex items-center">
                          {profile.name}
                          <motion.div
                            animate={{ rotate: [0, 10, 0, -10, 0] }}
                            transition={{ duration: 5, repeat: Infinity }}
                            className="ml-2"
                          >
                            <Badge variant="outline" className="ml-2 bg-gradient-to-r from-amber-200 to-yellow-400 border-yellow-400">
                              <Star className="h-3 w-3 mr-1 text-yellow-600" fill="currentColor" /> Gold Traveler
                            </Badge>
                          </motion.div>
                        </h2>
                      )}
                      
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <MapPin size={14} className="mr-1" />
                        {editMode ? (
                          <Input
                            value={tempProfile.location}
                            onChange={(e) => setTempProfile({...tempProfile, location: e.target.value})}
                            className="h-7 text-sm"
                          />
                        ) : (
                          profile.location
                        )}
                        <span className="mx-2">•</span>
                        <Calendar size={14} className="mr-1" />
                        Joined {profile.joined}
                        <span className="mx-2">•</span>
                        <Globe size={14} className="mr-1" />
                        {profile.visitedCountries.length} Countries
                      </div>
                    </div>
                    
                    <div className="mt-4 md:mt-0">
                      <div className="flex flex-wrap gap-1">
                        {(editMode ? tempProfile.travelStyle : profile.travelStyle).map((style, index) => (
                          <Badge key={index} variant="secondary" className="bg-muted/50">
                            {editMode ? (
                              <Input
                                value={style}
                                onChange={(e) => {
                                  const newStyles = [...tempProfile.travelStyle];
                                  newStyles[index] = e.target.value;
                                  setTempProfile({...tempProfile, travelStyle: newStyles});
                                }}
                                className="h-5 w-20 px-1 text-xs"
                              />
                            ) : (
                              style
                            )}
                          </Badge>
                        ))}
                        
                        {editMode && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setTempProfile({
                              ...tempProfile, 
                              travelStyle: [...tempProfile.travelStyle, "New Style"]
                            })}
                          >
                            <Badge variant="outline">
                              <Plus size={12} className="mr-1" /> Add
                            </Badge>
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    {editMode ? (
                      <Textarea
                        value={tempProfile.bio}
                        onChange={(e) => setTempProfile({...tempProfile, bio: e.target.value})}
                        className="min-h-20"
                      />
                    ) : (
                      <p className="text-muted-foreground">{profile.bio}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
        
        {/* Main content tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Tabs defaultValue="travels" className="w-full mb-6">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="travels">My Travels</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
            </TabsList>
            
            <TabsContent value="travels" className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <div className="md:col-span-3">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex justify-between items-center">
                        <span className="flex items-center">
                          <Globe className="mr-2" size={18} />
                          Visited Countries
                        </span>
                        
                        {editMode && (
                          <Button size="sm" variant="outline" onClick={handleAddCountry}>
                            <Plus size={14} className="mr-1" /> Add Country
                          </Button>
                        )}
                      </CardTitle>
                      <CardDescription>
                        Countries you've explored on your travels
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {(editMode ? tempProfile.visitedCountries : profile.visitedCountries).map((country, index) => (
                          <motion.div
                            key={`${country.name}-${index}`}
                            whileHover={{ scale: 1.02 }}
                            className="flex items-center justify-between p-2 rounded-md border"
                          >
                            <div className="flex items-center">
                              <Flag size={16} className="mr-2 text-muted-foreground" />
                              {editMode ? (
                                <Input
                                  value={country.name}
                                  onChange={(e) => {
                                    const updated = [...tempProfile.visitedCountries];
                                    updated[index].name = e.target.value;
                                    setTempProfile({...tempProfile, visitedCountries: updated});
                                  }}
                                  className="h-7 w-32 inline-block mr-2"
                                />
                              ) : (
                                <span>{country.name}</span>
                              )}
                              <Badge variant="outline" className="ml-2 text-xs">
                                {editMode ? (
                                  <Input
                                    value={country.year}
                                    onChange={(e) => {
                                      const updated = [...tempProfile.visitedCountries];
                                      updated[index].year = e.target.value;
                                      setTempProfile({...tempProfile, visitedCountries: updated});
                                    }}
                                    className="h-5 w-16 text-xs px-1"
                                  />
                                ) : (
                                  country.year
                                )}
                              </Badge>
                            </div>
                            <motion.button
                              onClick={() => handleToggleFavorite(country.name)}
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Star 
                                size={16} 
                                className={country.favorite ? "text-yellow-500" : "text-muted"} 
                                fill={country.favorite ? "currentColor" : "none"}
                              />
                            </motion.button>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="md:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex justify-between items-center">
                        <span className="flex items-center">
                          <Mountain className="mr-2" size={18} />
                          Travel Bucket List
                        </span>
                        
                        {editMode && (
                          <Button size="sm" variant="outline" onClick={handleAddBucketListItem}>
                            <Plus size={14} className="mr-1" /> Add Item
                          </Button>
                        )}
                      </CardTitle>
                      <CardDescription>
                        Places and experiences on your wish list
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <motion.ul 
                        className="space-y-2"
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                      >
                        {(editMode ? tempProfile.bucketList : profile.bucketList).map((item, index) => (
                          <motion.li 
                            key={index}
                            className="flex items-center p-2 border border-muted rounded-md"
                            variants={itemVariants}
                          >
                            {editMode ? (
                              <Input
                                value={item}
                                onChange={(e) => {
                                  const updated = [...tempProfile.bucketList];
                                  updated[index] = e.target.value;
                                  setTempProfile({...tempProfile, bucketList: updated});
                                }}
                                className="flex-1"
                              />
                            ) : (
                              <>
                                <div className="h-2 w-2 rounded-full bg-primary mr-3"></div>
                                <span>{item}</span>
                              </>
                            )}
                          </motion.li>
                        ))}
                      </motion.ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="preferences" className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Heart className="mr-2" size={18} />
                      Travel Preferences
                    </CardTitle>
                    <CardDescription>
                      Your personal travel style and priorities
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {Object.entries(profile.travelPreferences).map(([key, value]) => (
                        <div key={key} className="space-y-1">
                          <div className="flex justify-between items-center">
                            <Label className="capitalize">{key}</Label>
                            <span className="text-sm text-muted-foreground">{value}%</span>
                          </div>
                          {editMode ? (
                            <Input 
                              type="range" 
                              min="0" 
                              max="100" 
                              value={tempProfile.travelPreferences[key as keyof typeof tempProfile.travelPreferences]} 
                              onChange={(e) => {
                                setTempProfile({
                                  ...tempProfile,
                                  travelPreferences: {
                                    ...tempProfile.travelPreferences,
                                    [key]: parseInt(e.target.value)
                                  }
                                });
                              }}
                              className="w-full"
                            />
                          ) : (
                            <Progress value={value} className="h-2" />
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CloudSun className="mr-2" size={18} />
                      Travel Settings
                    </CardTitle>
                    <CardDescription>
                      Your travel preferences and settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Preferred Climate</Label>
                      {editMode ? (
                        <Input
                          value={tempProfile.preferredClimate}
                          onChange={(e) => setTempProfile({...tempProfile, preferredClimate: e.target.value})}
                        />
                      ) : (
                        <div className="flex items-center">
                          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                            {profile.preferredClimate}
                          </Badge>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Preferred Accommodation</Label>
                      {editMode ? (
                        <Input
                          value={tempProfile.preferredAccommodation}
                          onChange={(e) => setTempProfile({...tempProfile, preferredAccommodation: e.target.value})}
                        />
                      ) : (
                        <div className="flex items-center">
                          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                            {profile.preferredAccommodation}
                          </Badge>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Preferred Travel Season</Label>
                      {editMode ? (
                        <Input
                          value={tempProfile.travelSeason}
                          onChange={(e) => setTempProfile({...tempProfile, travelSeason: e.target.value})}
                        />
                      ) : (
                        <div className="flex items-center">
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                            {profile.travelSeason}
                          </Badge>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Languages</Label>
                      <div className="flex flex-wrap gap-2">
                        {(editMode ? tempProfile.languages : profile.languages).map((language, index) => (
                          editMode ? (
                            <Input 
                              key={index}
                              value={language}
                              onChange={(e) => {
                                const updated = [...tempProfile.languages];
                                updated[index] = e.target.value;
                                setTempProfile({...tempProfile, languages: updated});
                              }}
                              className="w-32 h-8"
                            />
                          ) : (
                            <Badge key={index} variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
                              {language}
                            </Badge>
                          )
                        ))}
                        {editMode && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setTempProfile({
                              ...tempProfile,
                              languages: [...tempProfile.languages, "New Language"]
                            })}
                          >
                            <Plus size={14} className="mr-1" /> Add
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Social Media</Label>
                      <div className="space-y-2">
                        {Object.entries(profile.socialMedia).map(([key, value]) => (
                          <div key={key} className="flex items-center">
                            <span className="w-24 text-sm text-muted-foreground capitalize">{key}:</span>
                            {editMode ? (
                              <Input
                                value={tempProfile.socialMedia[key as keyof typeof tempProfile.socialMedia]}
                                onChange={(e) => {
                                  setTempProfile({
                                    ...tempProfile,
                                    socialMedia: {
                                      ...tempProfile.socialMedia,
                                      [key]: e.target.value
                                    }
                                  });
                                }}
                              />
                            ) : (
                              <span>{value}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="achievements" className="pt-6">
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="show"
              >
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="overflow-hidden border-2 border-muted/50 hover:border-primary/20 transition-colors duration-300">
                      <CardContent className="pt-6">
                        <motion.div 
                          className="mb-4 mx-auto flex justify-center"
                          animate={{ 
                            rotate: [0, 10, 0, -10, 0],
                            scale: [1, 1.1, 1]
                          }}
                          transition={{ duration: 5, repeat: Infinity, delay: index * 0.5 }}
                        >
                          {achievement.icon}
                          <motion.div
                            className="absolute"
                            animate={{
                              scale: [1, 1.5, 1],
                              opacity: [0.2, 0, 0.2]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            {achievement.icon}
                          </motion.div>
                        </motion.div>
                        
                        <div className="text-center">
                          <h3 className="text-lg font-medium flex items-center justify-center">
                            {achievement.name}
                            <Award className="ml-1 h-4 w-4 text-yellow-500" fill="currentColor" />
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {achievement.description}
                          </p>
                          <Badge variant="outline" className="mt-2">
                            {achievement.date}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
      
      {/* Background animations */}
      <motion.div
        className="fixed right-10 bottom-10 text-primary/20 pointer-events-none"
        animate={{ 
          rotate: 360,
          scale: [1, 1.2, 1],
        }}
        transition={{ 
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          scale: { duration: 5, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <Globe size={100} />
      </motion.div>
      
      <motion.div
        className="fixed left-10 bottom-20 text-primary/10 pointer-events-none"
        animate={{ 
          rotate: -360,
          scale: [1, 1.1, 1],
        }}
        transition={{ 
          rotate: { duration: 25, repeat: Infinity, ease: "linear" },
          scale: { duration: 6, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <Globe size={150} />
      </motion.div>
    </div>
  );
};

export default UserProfile;
