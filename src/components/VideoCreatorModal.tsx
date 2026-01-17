import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Check, ChevronRight, ChevronLeft, Lock, Shield, CreditCard, AlertCircle, Video, Image as ImageIcon } from "lucide-react";
import { validateImage, validateVideo } from "@/lib/validations";

type Step = "upload" | "video" | "checkout" | "success";

interface VideoCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VideoCreatorModal = ({ isOpen, onClose }: VideoCreatorModalProps) => {
  const [currentStep, setCurrentStep] = useState<Step>("upload");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedVideo, setUploadedVideo] = useState<string | null>(null);
  const [videoFileName, setVideoFileName] = useState<string>("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [isValidatingImage, setIsValidatingImage] = useState(false);
  const [isValidatingVideo, setIsValidatingVideo] = useState(false);

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsValidatingImage(true);
    setImageError(null);

    const validation = await validateImage(file);
    
    if (!validation.valid) {
      setImageError(validation.error || "Erro ao validar imagem");
      setIsValidatingImage(false);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImage(reader.result as string);
      setIsValidatingImage(false);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleVideoUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsValidatingVideo(true);
    setVideoError(null);

    const validation = await validateVideo(file, 12);
    
    if (!validation.valid) {
      setVideoError(validation.error || "Erro ao validar vídeo");
      setIsValidatingVideo(false);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedVideo(reader.result as string);
      setVideoFileName(file.name);
      setIsValidatingVideo(false);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleImageDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;

    setIsValidatingImage(true);
    setImageError(null);

    const validation = await validateImage(file);
    
    if (!validation.valid) {
      setImageError(validation.error || "Erro ao validar imagem");
      setIsValidatingImage(false);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImage(reader.result as string);
      setIsValidatingImage(false);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleVideoDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;

    setIsValidatingVideo(true);
    setVideoError(null);

    const validation = await validateVideo(file, 12);
    
    if (!validation.valid) {
      setVideoError(validation.error || "Erro ao validar vídeo");
      setIsValidatingVideo(false);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedVideo(reader.result as string);
      setVideoFileName(file.name);
      setIsValidatingVideo(false);
    };
    reader.readAsDataURL(file);
  }, []);

  const handlePayment = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setCurrentStep("success");
    setIsProcessing(false);
  };

  const resetAndClose = () => {
    setCurrentStep("upload");
    setUploadedImage(null);
    setUploadedVideo(null);
    setVideoFileName("");
    setEmail("");
    setName("");
    setConfirmed(false);
    setImageError(null);
    setVideoError(null);
    onClose();
  };

  const resetForm = () => {
    setCurrentStep("upload");
    setUploadedImage(null);
    setUploadedVideo(null);
    setVideoFileName("");
    setEmail("");
    setName("");
    setConfirmed(false);
    setImageError(null);
    setVideoError(null);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-background/98 backdrop-blur-sm overflow-y-auto"
      >
        <div className="min-h-screen flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-lg"
          >
            {/* Close Button */}
            <button
              onClick={resetAndClose}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-secondary transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="glass-card p-6 md:p-8 gradient-border">
              {/* Step Indicator */}
              {currentStep !== "success" && (
                <div className="flex items-center justify-center gap-3 mb-8">
                  {["upload", "video", "checkout"].map((step, index) => (
                    <div key={step} className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                          currentStep === step || 
                          (currentStep === "video" && index === 0) ||
                          (currentStep === "checkout" && index <= 1)
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-muted-foreground"
                        }`}
                      >
                        {(currentStep === "checkout" && index < 2) ||
                         (currentStep === "video" && index === 0) ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          index + 1
                        )}
                      </div>
                      {index < 2 && (
                        <div className={`w-8 h-0.5 ${
                          (currentStep === "video" && index === 0) ||
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
                {/* Step 1: Upload Photo */}
                {currentStep === "upload" && (
                  <motion.div
                    key="upload"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <ImageIcon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">Quem vai aparecer?</h3>
                        <p className="text-sm text-muted-foreground">Carrega uma foto com rosto visível</p>
                      </div>
                    </div>

                    <div
                      onDrop={handleImageDrop}
                      onDragOver={(e) => e.preventDefault()}
                      className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                        imageError 
                          ? "border-destructive bg-destructive/5" 
                          : uploadedImage 
                            ? "border-primary bg-primary/5" 
                            : "border-primary/50 hover:border-primary hover:bg-secondary/30"
                      }`}
                    >
                      {isValidatingImage ? (
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                          <p className="text-sm text-muted-foreground">A validar...</p>
                        </div>
                      ) : uploadedImage ? (
                        <div className="space-y-3">
                          <img 
                            src={uploadedImage} 
                            alt="Carregada" 
                            className="w-24 h-24 object-cover rounded-lg mx-auto"
                          />
                          <p className="text-sm text-green-500 flex items-center justify-center gap-2">
                            <Check className="w-4 h-4" />
                            Foto válida
                          </p>
                          <button
                            onClick={() => { setUploadedImage(null); setImageError(null); }}
                            className="text-sm text-primary hover:underline"
                          >
                            Escolher outra
                          </button>
                        </div>
                      ) : (
                        <label className="cursor-pointer block">
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                          <div className="space-y-3">
                            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                              <Upload className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">Arrasta ou clica para escolher</p>
                              <p className="text-xs text-muted-foreground mt-1">JPG, PNG ou WEBP • Máx 10MB</p>
                            </div>
                          </div>
                        </label>
                      )}
                    </div>

                    {imageError && (
                      <div className="mt-3 flex items-center gap-2 text-destructive text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {imageError}
                      </div>
                    )}

                    <div className="mt-4 p-3 bg-secondary/30 rounded-lg">
                      <p className="text-xs text-muted-foreground">
                        <strong>Requisitos:</strong> Rosto claro e bem iluminado • Proporção entre 2:5 e 5:2 • Lado maior ≥ 300px
                      </p>
                    </div>

                    <div className="mt-6 flex justify-end">
                      <button
                        onClick={() => setCurrentStep("video")}
                        disabled={!uploadedImage}
                        className="flex items-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground px-6 py-3 rounded-lg font-medium transition-all"
                      >
                        Continuar
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Upload Video */}
                {currentStep === "video" && (
                  <motion.div
                    key="video"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                        <Video className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">Onde queres aparecer?</h3>
                        <p className="text-sm text-muted-foreground">Carrega o vídeo (máx 12 segundos)</p>
                      </div>
                    </div>

                    <div
                      onDrop={handleVideoDrop}
                      onDragOver={(e) => e.preventDefault()}
                      className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                        videoError 
                          ? "border-destructive bg-destructive/5" 
                          : uploadedVideo 
                            ? "border-accent bg-accent/5" 
                            : "border-accent/50 hover:border-accent hover:bg-secondary/30"
                      }`}
                    >
                      {isValidatingVideo ? (
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-10 h-10 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                          <p className="text-sm text-muted-foreground">A validar...</p>
                        </div>
                      ) : uploadedVideo ? (
                        <div className="space-y-3">
                          <video 
                            src={uploadedVideo} 
                            className="w-32 h-auto rounded-lg mx-auto"
                            muted
                            loop
                            autoPlay
                            playsInline
                          />
                          <p className="text-sm text-green-500 flex items-center justify-center gap-2">
                            <Check className="w-4 h-4" />
                            {videoFileName}
                          </p>
                          <button
                            onClick={() => { setUploadedVideo(null); setVideoFileName(""); setVideoError(null); }}
                            className="text-sm text-accent hover:underline"
                          >
                            Escolher outro
                          </button>
                        </div>
                      ) : (
                        <label className="cursor-pointer block">
                          <input
                            type="file"
                            accept="video/mp4,video/quicktime,video/x-matroska"
                            onChange={handleVideoUpload}
                            className="hidden"
                          />
                          <div className="space-y-3">
                            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mx-auto">
                              <Video className="w-5 h-5 text-accent" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">Arrasta ou clica para escolher</p>
                              <p className="text-xs text-muted-foreground mt-1">MP4, MOV ou MKV • Máx 100MB</p>
                            </div>
                          </div>
                        </label>
                      )}
                    </div>

                    {videoError && (
                      <div className="mt-3 flex items-center gap-2 text-destructive text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {videoError}
                      </div>
                    )}

                    <div className="mt-4 p-3 bg-secondary/30 rounded-lg">
                      <p className="text-xs text-muted-foreground">
                        <strong>Requisitos:</strong> Máximo 12 segundos • Qualquer orientação • Movimento visível do corpo
                      </p>
                    </div>

                    <div className="mt-6 flex justify-between">
                      <button
                        onClick={() => setCurrentStep("upload")}
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground px-4 py-2 rounded-lg font-medium transition-all"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Voltar
                      </button>
                      <button
                        onClick={() => setCurrentStep("checkout")}
                        disabled={!uploadedVideo}
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
                    <h3 className="text-lg font-semibold mb-6 text-center">Finalizar Pedido</h3>

                    {/* Preview */}
                    <div className="flex gap-3 justify-center mb-6">
                      {uploadedImage && (
                        <img src={uploadedImage} alt="Foto" className="w-16 h-16 rounded-lg object-cover" />
                      )}
                      <div className="flex items-center text-muted-foreground">+</div>
                      {uploadedVideo && (
                        <video src={uploadedVideo} className="w-16 h-16 rounded-lg object-cover" muted />
                      )}
                      <div className="flex items-center text-muted-foreground">=</div>
                      <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <span className="text-2xl">✨</span>
                      </div>
                    </div>

                    {/* Form */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="teu@email.com"
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
                          Seguro
                        </span>
                        <span className="flex items-center gap-1">
                          <CreditCard className="w-3 h-3" />
                          Stripe
                        </span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <button
                        onClick={() => setCurrentStep("video")}
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
                    className="text-center py-6 relative"
                  >
                    {/* Confetti */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      {[...Array(20)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-2 h-2 rounded-full animate-confetti"
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
                      className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4"
                    >
                      <Check className="w-8 h-8 text-green-500" />
                    </motion.div>

                    <h3 className="text-xl font-bold mb-2">A Processar! 🎉</h3>
                    <p className="text-muted-foreground text-sm mb-6">
                      Enviamos para <span className="text-primary font-medium">{email}</span>
                      <br />
                      <span className="text-xs">(5-10 minutos)</span>
                    </p>

                    {/* Progress bar */}
                    <div className="max-w-xs mx-auto mb-6">
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full animate-progress" />
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <button
                        onClick={resetForm}
                        className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-medium transition-all"
                      >
                        Criar Outro
                      </button>
                      <button
                        onClick={resetAndClose}
                        className="inline-flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground px-6 py-2 rounded-lg font-medium transition-all text-sm"
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
