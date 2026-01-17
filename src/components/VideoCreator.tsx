import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Check, Image, Film, CreditCard, Mail, User, ChevronRight, ChevronLeft, Shield, Lock } from "lucide-react";

type Step = "upload" | "template" | "checkout" | "success";

const templates = [
  { id: 1, title: "Trending Shuffle", category: "Trending", color: "from-blue-500/30 to-cyan-500/30" },
  { id: 2, title: "Classic Moves", category: "Classic", color: "from-amber-500/30 to-orange-500/30" },
  { id: 3, title: "Party Dance", category: "Fun", color: "from-pink-500/30 to-purple-500/30" },
  { id: 4, title: "Viral Steps", category: "Trending", color: "from-green-500/30 to-emerald-500/30" },
  { id: 5, title: "Smooth Groove", category: "Classic", color: "from-violet-500/30 to-indigo-500/30" },
  { id: 6, title: "Crazy Moves", category: "Fun", color: "from-red-500/30 to-rose-500/30" },
];

const categories = ["All", "Trending", "Classic", "Fun"];

const VideoCreator = () => {
  const [currentStep, setCurrentStep] = useState<Step>("upload");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const filteredTemplates = selectedCategory === "All" 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  const handlePayment = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setCurrentStep("success");
    setIsProcessing(false);
  };

  const resetForm = () => {
    setCurrentStep("upload");
    setUploadedImage(null);
    setSelectedTemplate(null);
    setEmail("");
    setName("");
    setConfirmed(false);
  };

  const stepIndicator = (
    <div className="flex items-center justify-center gap-3 mb-8">
      {["upload", "template", "checkout"].map((step, index) => (
        <div key={step} className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
              currentStep === step || 
              (currentStep === "template" && index === 0) ||
              (currentStep === "checkout" && index <= 1) ||
              currentStep === "success"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground"
            }`}
          >
            {currentStep === "success" || 
             (currentStep === "checkout" && index < 2) ||
             (currentStep === "template" && index === 0) ? (
              <Check className="w-5 h-5" />
            ) : (
              index + 1
            )}
          </div>
          {index < 2 && (
            <div className={`w-12 h-0.5 ${
              (currentStep === "template" && index === 0) ||
              (currentStep === "checkout" && index <= 1) ||
              currentStep === "success"
                ? "bg-primary"
                : "bg-secondary"
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <section id="create" className="py-24 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Create Your <span className="gradient-text">Video</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Follow these simple steps to create your personalized dance video
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-2xl p-8 gradient-border"
          >
            {currentStep !== "success" && stepIndicator}

            <AnimatePresence mode="wait">
              {/* Step 1: Upload Photo */}
              {currentStep === "upload" && (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <Image className="w-5 h-5 text-primary" />
                    Upload Your Photo
                  </h3>

                  <div
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    className={`border-2 border-dashed rounded-xl p-10 text-center transition-all cursor-pointer ${
                      uploadedImage 
                        ? "border-primary bg-primary/5" 
                        : "border-border hover:border-primary/50 hover:bg-secondary/30"
                    }`}
                  >
                    {uploadedImage ? (
                      <div className="space-y-4">
                        <img 
                          src={uploadedImage} 
                          alt="Uploaded" 
                          className="w-32 h-32 object-cover rounded-lg mx-auto"
                        />
                        <p className="text-sm text-muted-foreground">Photo uploaded successfully!</p>
                        <button
                          onClick={() => setUploadedImage(null)}
                          className="text-sm text-primary hover:underline"
                        >
                          Choose different photo
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer block">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <div className="space-y-4">
                          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto">
                            <Upload className="w-8 h-8 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium mb-1">Drop your photo here or click to browse</p>
                            <p className="text-sm text-muted-foreground">Clear face photo, good lighting recommended</p>
                          </div>
                        </div>
                      </label>
                    )}
                  </div>

                  <div className="mt-8 flex justify-end">
                    <button
                      onClick={() => setCurrentStep("template")}
                      disabled={!uploadedImage}
                      className="flex items-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground px-6 py-3 rounded-lg font-medium transition-all"
                    >
                      Continue
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Choose Template */}
              {currentStep === "template" && (
                <motion.div
                  key="template"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <Film className="w-5 h-5 text-primary" />
                    Choose Dance Template
                  </h3>

                  {/* Category Filter */}
                  <div className="flex gap-2 mb-6 flex-wrap">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          selectedCategory === category
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>

                  {/* Templates Grid */}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    {filteredTemplates.map((template) => (
                      <div
                        key={template.id}
                        onClick={() => setSelectedTemplate(template.id)}
                        className={`cursor-pointer rounded-xl overflow-hidden transition-all ${
                          selectedTemplate === template.id
                            ? "ring-2 ring-primary scale-[1.02]"
                            : "hover:scale-[1.02]"
                        }`}
                      >
                        <div className={`aspect-video bg-gradient-to-br ${template.color} relative`}>
                          {selectedTemplate === template.id && (
                            <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                              <Check className="w-4 h-4 text-primary-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="p-3 bg-card">
                          <p className="font-medium text-sm">{template.title}</p>
                          <p className="text-xs text-muted-foreground">{template.category}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between">
                    <button
                      onClick={() => setCurrentStep("upload")}
                      className="flex items-center gap-2 text-muted-foreground hover:text-foreground px-6 py-3 rounded-lg font-medium transition-all"
                    >
                      <ChevronLeft className="w-5 h-5" />
                      Back
                    </button>
                    <button
                      onClick={() => setCurrentStep("checkout")}
                      disabled={!selectedTemplate}
                      className="flex items-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground px-6 py-3 rounded-lg font-medium transition-all"
                    >
                      Continue
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Checkout */}
              {currentStep === "checkout" && (
                <motion.div
                  key="checkout"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-primary" />
                    Checkout
                  </h3>

                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Order Summary */}
                    <div className="bg-secondary/30 rounded-xl p-6">
                      <h4 className="font-medium mb-4">Order Summary</h4>
                      <div className="flex gap-4 mb-4">
                        {uploadedImage && (
                          <img src={uploadedImage} alt="Your photo" className="w-16 h-16 rounded-lg object-cover" />
                        )}
                        <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${
                          templates.find(t => t.id === selectedTemplate)?.color
                        }`} />
                      </div>
                      <div className="border-t border-border pt-4">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Video Creation</span>
                          <span className="text-2xl font-bold">€5.00</span>
                        </div>
                      </div>
                    </div>

                    {/* Checkout Form */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          <Mail className="w-4 h-4 inline mr-2" />
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your@email.com"
                          className="w-full px-4 py-3 rounded-lg bg-secondary border border-border focus:border-primary focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          <User className="w-4 h-4 inline mr-2" />
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="John Doe"
                          className="w-full px-4 py-3 rounded-lg bg-secondary border border-border focus:border-primary focus:outline-none transition-colors"
                        />
                      </div>
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={confirmed}
                          onChange={(e) => setConfirmed(e.target.checked)}
                          className="mt-1 w-4 h-4 rounded border-border text-primary focus:ring-primary"
                        />
                        <span className="text-sm text-muted-foreground">
                          I confirm I have permission to use this photo and agree to the Terms of Service
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="mt-8">
                    <button
                      onClick={handlePayment}
                      disabled={!email || !name || !confirmed || isProcessing}
                      className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground px-6 py-4 rounded-xl font-semibold text-lg transition-all glow-primary"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Lock className="w-5 h-5" />
                          Pay €5.00 with Stripe
                        </>
                      )}
                    </button>

                    <div className="flex items-center justify-center gap-4 mt-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Shield className="w-4 h-4" />
                        Secure Payment
                      </span>
                      <span>•</span>
                      <span>256-bit SSL</span>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-start">
                    <button
                      onClick={() => setCurrentStep("template")}
                      className="flex items-center gap-2 text-muted-foreground hover:text-foreground px-6 py-3 rounded-lg font-medium transition-all"
                    >
                      <ChevronLeft className="w-5 h-5" />
                      Back
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Success State */}
              {currentStep === "success" && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center py-8"
                >
                  {/* Confetti */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(20)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-3 h-3 rounded-full animate-confetti"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `-${Math.random() * 20}%`,
                          backgroundColor: i % 2 === 0 ? 'hsl(217.2 91.2% 59.8%)' : 'hsl(270 95.2% 64.9%)',
                          animationDelay: `${Math.random() * 0.5}s`,
                        }}
                      />
                    ))}
                  </div>

                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6"
                  >
                    <Check className="w-10 h-10 text-green-500" />
                  </motion.div>

                  <h3 className="text-2xl font-bold mb-2">Processing Your Video!</h3>
                  <p className="text-muted-foreground mb-8">
                    We'll email you at <span className="text-primary font-medium">{email}</span> when ready
                    <br />
                    <span className="text-sm">(Usually 5-10 minutes)</span>
                  </p>

                  <button
                    onClick={resetForm}
                    className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-medium transition-all"
                  >
                    Create Another Video
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default VideoCreator;
