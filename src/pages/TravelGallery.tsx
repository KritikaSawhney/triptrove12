
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Image as ImageIcon, X, Plus, Star, Download, Share2, MapPin, Calendar, Heart, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import TypewriterText from '@/components/TypewriterText';
import { useToast } from '@/components/ui/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

interface TravelPhoto {
  id: string;
  title: string;
  location: string;
  date: string;
  imageUrl: string;
  featured: boolean;
}

const DEMO_IMAGES: TravelPhoto[] = [
  {
    id: '1',
    title: 'Sunset in Santorini',
    location: 'Santorini, Greece',
    date: '2023-06-15',
    imageUrl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff',
    featured: true
  },
  {
    id: '2',
    title: 'Eiffel Tower',
    location: 'Paris, France',
    date: '2023-04-22',
    imageUrl: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f',
    featured: false
  },
  {
    id: '3',
    title: 'Golden Gate Bridge',
    location: 'San Francisco, USA',
    date: '2023-03-10',
    imageUrl: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29',
    featured: false
  },
  {
    id: '4',
    title: 'Venice Canals',
    location: 'Venice, Italy',
    date: '2023-05-05',
    imageUrl: 'https://images.unsplash.com/photo-1534113414509-0eec2bfb493f',
    featured: true
  },
  {
    id: '5',
    title: 'Great Wall',
    location: 'Beijing, China',
    date: '2022-11-18',
    imageUrl: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d',
    featured: false
  },
  {
    id: '6',
    title: 'Machu Picchu',
    location: 'Peru',
    date: '2023-02-28',
    imageUrl: 'https://images.unsplash.com/photo-1526392060635-9d6019884377',
    featured: true
  },
];

// Form schema for photo upload
const photoFormSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters long" }),
  location: z.string().min(2, { message: "Location must be at least 2 characters long" }),
  date: z.string().min(1, { message: "Date is required" }),
});

type PhotoFormValues = z.infer<typeof photoFormSchema>;

const TravelGallery = () => {
  const [photos, setPhotos] = useState<TravelPhoto[]>(DEMO_IMAGES);
  const [selectedPhoto, setSelectedPhoto] = useState<TravelPhoto | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [likedPhotos, setLikedPhotos] = useState<Set<string>>(new Set());

  // Initialize form
  const form = useForm<PhotoFormValues>({
    resolver: zodResolver(photoFormSchema),
    defaultValues: {
      title: '',
      location: '',
      date: new Date().toISOString().split('T')[0],
    },
  });

  // Clear preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const filteredPhotos = photos.filter(photo => 
    photo.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    photo.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive"
      });
      return;
    }

    setSelectedFile(file);

    // Create preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Open upload dialog
    setUploadDialogOpen(true);
  };

  const handleUpload = (values: PhotoFormValues) => {
    if (!selectedFile || !previewUrl) {
      toast({
        title: "No image selected",
        description: "Please select an image to upload",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    
    // In a real app, you would upload the file to a server here
    // For now, we'll simulate a short delay and use the local file
    setTimeout(() => {
      const newPhoto: TravelPhoto = {
        id: Date.now().toString(),
        title: values.title,
        location: values.location,
        date: values.date,
        imageUrl: previewUrl,
        featured: false
      };
      
      setPhotos(prev => [newPhoto, ...prev]);
      setUploading(false);
      setSelectedFile(null);
      setPreviewUrl(null);
      setUploadDialogOpen(false);
      
      // Reset form
      form.reset();
      
      toast({
        title: "Photo uploaded successfully!",
        description: "Your travel memory has been added to your gallery.",
      });
    }, 1500);
  };

  const cancelUpload = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadDialogOpen(false);
    form.reset();
  };

  const handleToggleFeatured = (id: string) => {
    setPhotos(prev => prev.map(photo => 
      photo.id === id ? {...photo, featured: !photo.featured} : photo
    ));
    
    toast({
      title: "Updated!",
      description: "Photo featured status has been updated.",
    });
  };

  const handleToggleLike = (id: string) => {
    setLikedPhotos(prev => {
      const newLikes = new Set(prev);
      if (newLikes.has(id)) {
        newLikes.delete(id);
      } else {
        newLikes.add(id);
        
        toast({
          title: "Added to favorites!",
          description: "Photo added to your favorites.",
        });
      }
      return newLikes;
    });
  };

  const handleShare = (id: string) => {
    const photo = photos.find(p => p.id === id);
    if (!photo) return;
    
    // In a real app, this would open a sharing dialog
    // For now, we'll simulate copy to clipboard
    navigator.clipboard.writeText(`Check out this amazing photo of ${photo.title} from ${photo.location}!`)
      .then(() => {
        toast({
          title: "Link copied!",
          description: "Photo link has been copied to clipboard. Share with your friends!",
        });
      })
      .catch(err => {
        toast({
          title: "Sharing failed",
          description: "Could not share this photo. Please try again.",
          variant: "destructive"
        });
      });
  };

  const handleDownload = (id: string) => {
    const photo = photos.find(p => p.id === id);
    if (!photo) return;
    
    // Create a temporary anchor element
    const link = document.createElement('a');
    link.href = photo.imageUrl;
    link.download = `${photo.title.replace(/\s+/g, '-').toLowerCase()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download started!",
      description: "Your photo is being downloaded.",
    });
  };

  // Staggered animation for the photo grid
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
    return Array.from({ length: 20 }).map((_, i) => (
      <motion.div
        key={`star-${i}`}
        className="absolute text-yellow-400"
        style={{ 
          left: `${Math.random() * 100}%`, 
          top: `${Math.random() * 100}%`,
          opacity: Math.random() * 0.7 + 0.3
        }}
        animate={{
          scale: [1, 1.8, 1],
          opacity: [0.3, 0.9, 0.3],
        }}
        transition={{
          duration: 2 + Math.random() * 3,
          repeat: Infinity,
          repeatType: "reverse",
          delay: Math.random() * 2
        }}
      >
        <Star size={Math.random() * 20 + 15} fill="currentColor" />
      </motion.div>
    ));
  };

  const renderSparkles = () => {
    return Array.from({ length: 15 }).map((_, i) => (
      <motion.div
        key={`sparkle-${i}`}
        className="absolute text-purple-400"
        style={{ 
          left: `${Math.random() * 100}%`, 
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          scale: [0.5, 1.5, 0.5],
          rotate: [0, 180, 360],
          opacity: [0.3, 0.8, 0.3],
        }}
        transition={{
          duration: 3 + Math.random() * 5,
          repeat: Infinity,
          repeatType: "reverse",
          delay: Math.random() * 3
        }}
      >
        <Sparkles size={Math.random() * 15 + 10} />
      </motion.div>
    ));
  };

  return (
    <div className="container py-8 relative min-h-screen">
      {/* Enhanced background animation */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 opacity-60">
        {renderStars()}
        {renderSparkles()}
      </div>
      
      {/* Header section with enhanced pulsing animation */}
      <motion.div 
        className="mb-10 text-center relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="inline-block mb-4 text-7xl relative"
          animate={{ 
            rotate: [0, 5, 0, -5, 0],
            scale: [1, 1.1, 1, 1.1, 1],
          }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          <span className="relative">
            📸
            <motion.span 
              className="absolute -top-2 -right-2 text-xl"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              ✨
            </motion.span>
          </span>
        </motion.div>
        <h1 className="text-5xl font-bold mb-4 relative">
          <TypewriterText 
            text="Travel Gallery" 
            speed={50} 
            gradientClass="bg-gradient-to-r from-blue-600 via-purple-500 to-indigo-600 text-transparent bg-clip-text"
          />
          <motion.span 
            className="absolute -top-1 -right-1 text-accent"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ⭐
          </motion.span>
        </h1>
        <motion.p 
          className="text-xl text-muted-foreground max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Store, organize, and share your most precious travel memories in one beautiful place.
        </motion.p>
      </motion.div>
      
      {/* Search and upload section */}
      <motion.div 
        className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-8 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="relative w-full sm:w-64 md:w-80">
          <Input 
            type="text"
            placeholder="Search by title or location..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 backdrop-blur-sm bg-background/80 transition-all duration-300 focus:ring-2 focus:ring-primary/50"
          />
          <ImageIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
          <motion.span 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {searchTerm && <X size={16} className="cursor-pointer" onClick={() => setSearchTerm('')} />}
          </motion.span>
        </div>
        
        <motion.div 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Hidden file input */}
          <input 
            ref={fileInputRef}
            type="file" 
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />
          
          {/* Upload button that triggers the file input */}
          <Button 
            onClick={() => fileInputRef.current?.click()} 
            disabled={uploading}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-blue-500/25"
          >
            {uploading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="mr-2"
              >
                <Upload size={16} />
              </motion.div>
            ) : (
              <Upload size={16} className="mr-2" />
            )}
            {uploading ? "Uploading..." : "Upload Photo"}
          </Button>
        </motion.div>
      </motion.div>
      
      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="sm:max-w-md overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-center flex items-center justify-center gap-2">
              <motion.span
                animate={{ rotate: [0, 10, 0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🌟
              </motion.span>
              Upload Travel Photo
            </DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleUpload)} className="space-y-4">
              {/* Preview with animated border */}
              {previewUrl && (
                <motion.div 
                  className="relative mx-auto w-full max-w-sm overflow-hidden rounded-lg"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative overflow-hidden rounded-lg border-2 border-primary p-1">
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 opacity-30"
                      animate={{ 
                        backgroundPosition: ['0% 0%', '100% 100%'],
                      }}
                      transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                    />
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="w-full h-56 object-cover rounded-lg"
                    />
                  </div>
                </motion.div>
              )}
              
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Sunset in Santorini" {...field} className="backdrop-blur-sm bg-background/80" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Location */}
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <MapPin className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                        <Input className="pl-8 backdrop-blur-sm bg-background/80" placeholder="e.g. Paris, France" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Date */}
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Calendar className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                        <Input className="pl-8 backdrop-blur-sm bg-background/80" type="date" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Actions */}
              <DialogFooter className="flex justify-between sm:justify-between">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={cancelUpload}
                  className="backdrop-blur-sm bg-background/80"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={uploading}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg transition-all duration-300"
                >
                  {uploading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="mr-2"
                    >
                      <Upload size={16} />
                    </motion.div>
                  ) : (
                    <Upload size={16} className="mr-2" />
                  )}
                  {uploading ? "Uploading..." : "Upload"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Photo grid with enhanced animations */}
      {filteredPhotos.length === 0 ? (
        <motion.div 
          className="text-center py-12 relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 5, 0, -5, 0]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="mx-auto mb-4"
          >
            <ImageIcon size={80} className="mx-auto text-muted-foreground opacity-50" />
          </motion.div>
          <p className="text-xl text-muted-foreground">No photos found. Try a different search term or upload new photos!</p>
        </motion.div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <AnimatePresence>
            {filteredPhotos.map((photo) => (
              <motion.div 
                key={photo.id}
                variants={itemVariants}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="group relative"
                layout
              >
                <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 h-full backdrop-blur-sm bg-background/80 border-opacity-70 hover:border-primary">
                  <div className="relative aspect-video overflow-hidden">
                    <Dialog>
                      <DialogTrigger asChild>
                        <div className="cursor-pointer relative">
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            whileHover={{ opacity: 1 }}
                          />
                          <motion.img 
                            src={photo.imageUrl} 
                            alt={photo.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            loading="lazy"
                            initial={{ scale: 1 }}
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl overflow-hidden">
                        <DialogHeader>
                          <DialogTitle className="flex items-center">
                            <motion.span 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ duration: 0.3 }}
                              className="mr-2"
                            >
                              🌍
                            </motion.span>
                            {photo.title}
                            {photo.featured && (
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: [0, 1.2, 1] }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="ml-2"
                              >
                                <Star className="text-yellow-500" size={16} fill="currentColor" />
                              </motion.span>
                            )}
                          </DialogTitle>
                        </DialogHeader>
                        
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4 }}
                        >
                          <div className="relative rounded-lg overflow-hidden">
                            <motion.div 
                              className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-transparent to-purple-500/20"
                              animate={{ 
                                backgroundPosition: ['0% 0%', '100% 100%'],
                              }}
                              transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
                            />
                            <img 
                              src={photo.imageUrl} 
                              alt={photo.title}
                              className="w-full rounded-md"
                            />
                          </div>
                        </motion.div>
                        
                        <motion.div 
                          className="flex justify-between items-center"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.2 }}
                        >
                          <div>
                            <p className="font-semibold flex items-center gap-1">
                              <MapPin size={14} className="text-primary" />
                              {photo.location}
                            </p>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <Calendar size={14} />
                              {photo.date}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleDownload(photo.id)}
                              className="hover:bg-primary/10 transition-colors duration-300"
                            >
                              <Download size={16} className="mr-1" /> Download
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleShare(photo.id)}
                              className="hover:bg-primary/10 transition-colors duration-300"
                            >
                              <Share2 size={16} className="mr-1" /> Share
                            </Button>
                          </div>
                        </motion.div>
                      </DialogContent>
                    </Dialog>
                    
                    {/* Featured button with enhanced animation */}
                    <motion.button
                      className={`absolute top-2 right-2 p-2 rounded-full ${
                        photo.featured ? 'bg-yellow-500 text-white' : 'bg-white/80 text-gray-700'
                      } z-10 backdrop-blur-sm`}
                      onClick={() => handleToggleFeatured(photo.id)}
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Star size={16} fill={photo.featured ? "white" : "none"} />
                    </motion.button>
                    
                    {/* Like button */}
                    <motion.button
                      className={`absolute bottom-2 left-2 p-2 rounded-full ${
                        likedPhotos.has(photo.id) ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-700'
                      } z-10 opacity-0 group-hover:opacity-100 backdrop-blur-sm`}
                      onClick={() => handleToggleLike(photo.id)}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Heart size={16} fill={likedPhotos.has(photo.id) ? "white" : "none"} />
                    </motion.button>
                    
                    {/* Download button */}
                    <motion.button
                      className="absolute bottom-2 right-2 p-2 rounded-full bg-white/80 text-gray-700 z-10 opacity-0 group-hover:opacity-100 backdrop-blur-sm"
                      onClick={() => handleDownload(photo.id)}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Download size={16} />
                    </motion.button>
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <h3 className="font-medium text-lg">{photo.title}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin size={12} />
                          {photo.location} • {photo.date}
                        </p>
                      </motion.div>
                      <div className="flex space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.2, y: -2 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleShare(photo.id)}
                          className="p-1.5 rounded-full hover:bg-primary/10 transition-colors"
                        >
                          <Share2 size={16} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.2, y: -2 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDownload(photo.id)}
                          className="p-1.5 rounded-full hover:bg-primary/10 transition-colors"
                        >
                          <Download size={16} />
                        </motion.button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Floating animation elements */}
                <motion.div 
                  className="absolute -top-2 -right-2 text-yellow-500 opacity-0 group-hover:opacity-100"
                  animate={{ 
                    y: [0, -8, 0],
                    rotate: [0, 10, 0],
                    scale: [0.8, 1, 0.8],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Star size={16} fill="currentColor" />
                </motion.div>
                
                <motion.div 
                  className="absolute -bottom-1 -left-1 text-primary opacity-0 group-hover:opacity-100"
                  animate={{ 
                    y: [0, -5, 0],
                    rotate: [0, -10, 0],
                    scale: [0.8, 1, 0.8],
                  }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                >
                  <Sparkles size={16} />
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
      
      {/* Add photo button fixed at the bottom right with enhanced animation */}
      <motion.div
        className="fixed bottom-6 right-6 z-20"
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9, rotate: 0 }}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, type: "spring" }}
      >
        <Button 
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          size="lg"
          className="rounded-full w-16 h-16 p-0 bg-gradient-to-r from-blue-600 via-purple-500 to-indigo-600 hover:from-blue-700 hover:to-purple-700 shadow-xl hover:shadow-blue-500/30 transition-all duration-300 relative overflow-hidden"
        >
          <motion.span 
            className="absolute inset-0 bg-white opacity-20"
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
          />
          
          {uploading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Upload size={28} />
            </motion.div>
          ) : (
            <motion.div
              initial={{ rotate: 0 }}
              whileHover={{ rotate: 90 }}
              transition={{ duration: 0.3 }}
            >
              <Plus size={28} />
            </motion.div>
          )}
        </Button>
        
        {/* Radial glow effect */}
        <motion.div 
          className="absolute inset-0 rounded-full bg-primary/30 blur-xl -z-10"
          animate={{ 
            scale: [0.8, 1.2, 0.8],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </motion.div>
    </div>
  );
};

export default TravelGallery;
