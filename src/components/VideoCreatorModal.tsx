import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Check, ChevronRight, ChevronLeft, Lock, Shield, CreditCard } from "lucide-react";

type Step = "upload" | "template" | "checkout" | "success";

const templates = [
  { id: 1, title: "Shuffle Viral", category: "Trending", color: "from-blue-500/30 to-cyan-500/30" },
  { id: 2, title: "Dança Clássica", category: "Clássicos", color: "from-amber-500/30 to-orange-500/30" },
  { id: 3, title: "Festa Louca", category: "Divertidos", color: "from-pink-500/30 to-purple-500/30" },
  { id: 4, title: "TikTok Hit", category: "Trending", color: "from-green-500/30 to-emerald-500/30" },
  { id: 5, title: "Smooth Moves", category: "Clássicos", color: "from-violet-500/30 to-indigo-500/30" },
  { id: 6, title: "Party Time", category: "Divertidos", color: "from-red-500/30 to-rose-500/30" },
];

const categories = ["Todos", "Trending", "Clássicos", "Divertidos"];

interface VideoCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VideoCreatorModal = ({ isOpen, onClose }: VideoCreatorModalProps) => {
  const [currentStep, setCurrentStep] = useState<Step>("upload");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
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

  const filteredTemplates = selectedCategory === "Todos" 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  const handlePayment = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setCurrentStep("success");
    setIsProcessing(false);
  };

  const resetAndClose = () => {
    setCurrentStep("upload");
    setUploadedImage(null);
    setSelectedTemplate(null);
    setEmail("");
    setName("");
    setConfirmed(false);
    onClose();
  };

  const resetForm = () => {
    setCurrentStep("upload");
    setUploadedImage(null);
    setSelectedTemplate(null);
    setEmail("");
    setName("");
    setConfirmed(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm overflow-y-auto"
      >
        <div className="min-h-screen flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-2xl"
          >
            {/* Close Button */}
            <button
              onClick={resetAndClose}
              className="absolute top-6 right-6 p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="glass-card p-8 gradient-border">
              {/* Step Indicator */}
              {currentStep !== "success" && (
                <div className="flex items-center justify-center gap-3 mb-8">
                  {["upload", "template", "checkout"].map((step, index) => (
                    <div key={step} className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                          currentStep === step || 
                          (currentStep === "template" && index === 0) ||
                          (currentStep === "checkout" && index <= 1)
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-muted-foreground"
                        }`}
                      >
                        {(currentStep === "checkout" && index < 2) ||
                         (currentStep === "template" && index === 0) ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          index + 1
                        )}
                      </div>
                      {index < 2 && (
                        <div className={`w-10 h-0.5 ${
                          (currentStep === "template" && index === 0) ||
                          (currentStep === "checkout" && index <= 1)
                            ? "bg-primary"
                            : "bg-secondary"
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
              )}

              <AnimatePresence mode="wait">
                {/* Step 1: Upload */}
                {currentStep === "upload" && (
                  <motion.div
                    key="upload"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-xl font-semibold mb-6 text-center">
                      📸 Carrega a Tua Foto
                    </h3>

                    <div
                      onDrop={handleDrop}
                      onDragOver={(e) => e.preventDefault()}
                      className={`border-2 border-dashed rounded-xl p-10 text-center transition-all cursor-pointer ${
                        uploadedImage 
                          ? "border-primary bg-primary/5" 
                          : "border-primary/50 hover:border-primary hover:bg-secondary/30"
                      }`}
                    >
                      {uploadedImage ? (
                        <div className="space-y-4">
                          <img 
                            src={uploadedImage} 
                            alt="Carregada" 
                            className="w-28 h-28 object-cover rounded-lg mx-auto"
                          />
                          <p className="text-sm text-green-500 flex items-center justify-center gap-2">
                            <Check className="w-4 h-4" />
                            Foto carregada
                          </p>
                          <button
                            onClick={() => setUploadedImage(null)}
                            className="text-sm text-primary hover:underline"
                          >
                            Escolher outra foto
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
                            <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                              <Upload className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium mb-1">Arrasta a foto aqui ou clica para escolher</p>
                              <button className="mt-2 px-4 py-2 bg-primary/20 rounded-lg text-primary text-sm font-medium hover:bg-primary/30 transition-colors">
                                Escolher Ficheiro
                              </button>
                            </div>
                          </div>
                        </label>
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground text-center mt-4">
                      Foto clara do rosto, boa iluminação, formato JPG/PNG
                    </p>

                    <div className="mt-8 flex justify-end">
                      <button
                        onClick={() => setCurrentStep("template")}
                        disabled={!uploadedImage}
                        className="flex items-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground px-6 py-3 rounded-lg font-medium transition-all"
                      >
                        Continuar
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Template */}
                {currentStep === "template" && (
                  <motion.div
                    key="template"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-xl font-semibold mb-6 text-center">
                      💃 Escolhe o Template de Dança
                    </h3>

                    <div className="flex gap-2 mb-6 flex-wrap justify-center">
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

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                      {filteredTemplates.map((template) => (
                        <div
                          key={template.id}
                          onClick={() => setSelectedTemplate(template.id)}
                          className={`cursor-pointer rounded-lg overflow-hidden transition-all ${
                            selectedTemplate === template.id
                              ? "ring-2 ring-primary scale-[1.02]"
                              : "hover:scale-[1.02]"
                          }`}
                        >
                          <div className={`aspect-video bg-gradient-to-br ${template.color} relative`}>
                            {selectedTemplate === template.id && (
                              <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                <Check className="w-3 h-3 text-primary-foreground" />
                              </div>
                            )}
                          </div>
                          <div className="p-2 bg-card">
                            <p className="font-medium text-xs">{template.title}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between">
                      <button
                        onClick={() => setCurrentStep("upload")}
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground px-4 py-2 rounded-lg font-medium transition-all"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Voltar
                      </button>
                      <button
                        onClick={() => setCurrentStep("checkout")}
                        disabled={!selectedTemplate}
                        className="flex items-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground px-6 py-3 rounded-lg font-medium transition-all"
                      >
                        Continuar
                        <ChevronRight className="w-4 h-4" />
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
                    <h3 className="text-xl font-semibold mb-6 text-center">
                      💳 Finalizar Pedido
                    </h3>

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Order Summary */}
                      <div className="bg-secondary/30 rounded-xl p-5">
                        <h4 className="font-medium mb-4 text-sm">Resumo do Pedido</h4>
                        <div className="flex gap-3 mb-4">
                          {uploadedImage && (
                            <img src={uploadedImage} alt="Foto" className="w-14 h-14 rounded-lg object-cover" />
                          )}
                          <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${
                            templates.find(t => t.id === selectedTemplate)?.color
                          }`} />
                        </div>
                        <div className="border-t border-border pt-3">
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground text-sm">Total</span>
                            <span className="text-2xl font-bold">€5,00</span>
                          </div>
                        </div>
                      </div>

                      {/* Form */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">O Teu Email</label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="email@exemplo.com"
                            className="w-full px-4 py-3 rounded-lg bg-secondary border border-border focus:border-primary focus:outline-none transition-colors text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Nome</label>
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="O teu nome"
                            className="w-full px-4 py-3 rounded-lg bg-secondary border border-border focus:border-primary focus:outline-none transition-colors text-sm"
                          />
                        </div>
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={confirmed}
                            onChange={(e) => setConfirmed(e.target.checked)}
                            className="mt-1 w-4 h-4 rounded border-border text-primary focus:ring-primary"
                          />
                          <span className="text-xs text-muted-foreground">
                            Confirmo que tenho permissão para usar esta foto
                          </span>
                        </label>
                      </div>
                    </div>

                    <div className="mt-6">
                      <button
                        onClick={handlePayment}
                        disabled={!email || !name || !confirmed || isProcessing}
                        className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground px-6 py-4 rounded-xl font-semibold transition-all glow-primary"
                      >
                        {isProcessing ? (
                          <>
                            <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                            A processar...
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4" />
                            Pagar €5 com Stripe
                          </>
                        )}
                      </button>

                      <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Shield className="w-3 h-3" />
                          Pagamento Seguro
                        </span>
                        <span className="flex items-center gap-1">
                          <CreditCard className="w-3 h-3" />
                          Stripe
                        </span>
                      </div>

                      <p className="text-xs text-muted-foreground text-center mt-4">
                        Vais receber o vídeo por email em 5-10 minutos
                      </p>
                    </div>

                    <div className="mt-4">
                      <button
                        onClick={() => setCurrentStep("template")}
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground px-4 py-2 rounded-lg font-medium transition-all text-sm"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Voltar
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Success */}
                {currentStep === "success" && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center py-8 relative"
                  >
                    {/* Confetti */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      {[...Array(24)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-3 h-3 rounded-full animate-confetti"
                          style={{
                            left: `${Math.random() * 100}%`,
                            top: `-5%`,
                            backgroundColor: i % 3 === 0 ? '#2563eb' : i % 3 === 1 ? '#a855f7' : '#22c55e',
                            animationDelay: `${Math.random() * 0.8}s`,
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

                    <h3 className="text-2xl font-bold mb-2">A Processar o Teu Vídeo! 🎉</h3>
                    <p className="text-muted-foreground mb-6">
                      Enviamos um email para <span className="text-primary font-medium">{email}</span> quando estiver pronto
                      <br />
                      <span className="text-sm">(5-10 minutos)</span>
                    </p>

                    {/* Progress bar */}
                    <div className="max-w-xs mx-auto mb-8">
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full animate-progress" />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <button
                        onClick={resetForm}
                        className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-medium transition-all"
                      >
                        Criar Outro Vídeo
                      </button>
                      <button
                        onClick={resetAndClose}
                        className="inline-flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/80 text-foreground px-6 py-3 rounded-lg font-medium transition-all"
                      >
                        Fechar
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VideoCreatorModal;
