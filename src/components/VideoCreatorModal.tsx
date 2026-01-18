import { useState, useCallback, useEffect, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Check, ChevronRight, ChevronLeft, Lock, Shield, CreditCard, AlertCircle, Video, Image as ImageIcon, Loader2, Mail, Clock, RefreshCw, Sparkles } from "lucide-react";
import { validateImage, validateVideo } from "@/lib/validations";
import { createCheckoutSession, verifyCheckout, uploadFile, convertVideo } from "@/lib/api";
import { trackEvent } from "@/lib/analytics";

// Lazy load Stripe React components
const StripeCheckout = lazy(() => import("./StripeCheckout"));

type Step = "upload" | "video" | "checkout" | "payment" | "processing" | "success" | "error";

interface VideoCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VideoCreatorModal = ({ isOpen, onClose }: VideoCreatorModalProps) => {
  const [currentStep, setCurrentStep] = useState<Step>("upload");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedVideo, setUploadedVideo] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoFileName, setVideoFileName] = useState<string>("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [isValidatingImage, setIsValidatingImage] = useState(false);
  const [isValidatingVideo, setIsValidatingVideo] = useState(false);
  
  // API integration state
  const [taskId, setTaskId] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  
  // Stripe state
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [checkoutSessionId, setCheckoutSessionId] = useState<string | null>(null);

  // Cleanup object URLs
  useEffect(() => {
    return () => {
      if (uploadedImage) URL.revokeObjectURL(uploadedImage);
      if (uploadedVideo) URL.revokeObjectURL(uploadedVideo);
    };
  }, [uploadedImage, uploadedVideo]);

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

    if (uploadedImage) URL.revokeObjectURL(uploadedImage);
    setUploadedImage(URL.createObjectURL(file));
    setImageFile(file);
    setIsValidatingImage(false);
  }, [uploadedImage]);

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

    if (uploadedVideo) URL.revokeObjectURL(uploadedVideo);
    setUploadedVideo(URL.createObjectURL(file));
    setVideoFile(file);
    setVideoFileName(file.name);
    setIsValidatingVideo(false);
  }, [uploadedVideo]);

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

    if (uploadedImage) URL.revokeObjectURL(uploadedImage);
    setUploadedImage(URL.createObjectURL(file));
    setImageFile(file);
    setIsValidatingImage(false);
  }, [uploadedImage]);

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

    if (uploadedVideo) URL.revokeObjectURL(uploadedVideo);
    setUploadedVideo(URL.createObjectURL(file));
    setVideoFile(file);
    setVideoFileName(file.name);
    setIsValidatingVideo(false);
  }, [uploadedVideo]);

  const handleProceedToPayment = async () => {
    if (!imageFile || !videoFile || !email || !name) return;
    
    setIsProcessing(true);
    setApiError(null);
    trackEvent('begin_checkout', { email });

    try {
      console.log("[Flowzi] Starting upload process...");
      
      // Extra validation before proceeding
      const revalidation = await validateVideo(videoFile, 12);
      if (!revalidation.valid) {
        setVideoError(revalidation.error || "Vídeo inválido");
        setApiError("Por favor, carrega um vídeo com resolução mínima de 720x720");
        setIsProcessing(false);
        setCurrentStep("video");
        return;
      }
      
      const [photoUrl, videoUrl] = await Promise.all([
        uploadFile(imageFile),
        uploadFile(videoFile),
      ]);

      trackEvent('files_uploaded');
      console.log("[Flowzi] Upload complete:", { photoUrl, videoUrl });

      const pendingData = { photoUrl, videoUrl, email, userName: name };
      localStorage.setItem('flowzi_pending_job', JSON.stringify(pendingData));

      console.log("[Flowzi] Creating Stripe session...");
      const { clientSecret, sessionId } = await createCheckoutSession({
        email,
        userName: name,
        // Pass URLs to metadata as backup
        photoUrl,
        videoUrl
      });
      // ... rest of the code stays same ...

      console.log("[Flowzi] Stripe session created:", sessionId);

      setClientSecret(clientSecret);
      setCheckoutSessionId(sessionId);
      setCurrentStep("payment");
      setIsProcessing(false);

    } catch (error) {
      console.error("[Flowzi] Checkout creation error:", error);
      setApiError(error instanceof Error ? error.message : "Erro ao preparar pedido. Tenta novamente.");
      setIsProcessing(false);
    }
  };

  // Detect return from Stripe
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('checkout_session_id');
    
    if (sessionId) {
      console.log("[Flowzi] Detected return from Stripe with sessionId:", sessionId);
      // Clean URL immediately
      window.history.replaceState({}, '', window.location.pathname);
      // Process the checkout
      handleCheckoutComplete(sessionId);
    }
  }, []);

  // Handle Stripe checkout completion
  const handleCheckoutComplete = async (sessionId: string) => {
    try {
      setCurrentStep("processing");
      console.log("[Flowzi] Processing checkout for session:", sessionId);

      // 1. Verify payment
      console.log("[Flowzi] Verifying payment...");
      const paymentResult = await verifyCheckout(sessionId);
      console.log("[Flowzi] Payment verification result:", paymentResult);
      
      if (!paymentResult.success) {
        throw new Error("Pagamento não confirmado");
      }

      trackEvent('payment_confirmed');

      // 2. Get data from localStorage
      const pendingJobStr = localStorage.getItem('flowzi_pending_job');
      console.log("[Flowzi] Retrieved from localStorage:", pendingJobStr);
      
      let finalJobData;
      
      if (pendingJobStr) {
        finalJobData = JSON.parse(pendingJobStr);
      } else if (paymentResult.photoUrl && paymentResult.videoUrl) {
        // Fallback: use data from Stripe metadata if localStorage is empty
        console.log("[Flowzi] Using fallback data from Stripe metadata");
        finalJobData = {
          photoUrl: paymentResult.photoUrl,
          videoUrl: paymentResult.videoUrl,
          email: paymentResult.email,
          userName: paymentResult.userName
        };
      }

      if (!finalJobData) {
        // Fallback: Payment confirmed but no data at all
        console.error("[Flowzi] No pending job data found anywhere");
        setEmail(paymentResult.email || "");
        setApiError("Pagamento confirmado! Mas houve um problema técnico ao recuperar os teus ficheiros. Contacta flowzi.geral@gmail.com.");
        setCurrentStep("error");
        return;
      }
      
      let { photoUrl, videoUrl, email: savedEmail, userName } = finalJobData;
      const blobVideoUrl = videoUrl; // Guardamos o link original do Vercel Blob para apagar depois
      
      console.log("[Flowzi] Parsed pending job:", { photoUrl: photoUrl?.substring(0, 50), videoUrl: videoUrl?.substring(0, 50), savedEmail, userName });

      // 2.5 Auto-convert MOV to MP4 via Cloudinary if needed
      if (videoUrl.toLowerCase().includes('.mov')) {
        console.log("[Flowzi] MOV detected, converting via Cloudinary...");
        const convertedUrl = await convertVideo(videoUrl);
        console.log("[Flowzi] Conversion complete:", convertedUrl);
        videoUrl = convertedUrl;
      }

      // 3. Send data to n8n Webhook (Production URL)
      console.log("[Flowzi] Sending to n8n webhook...");
      const n8nResponse = await fetch("https://n8n.diogocoutinho.cloud/webhook/videosaas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          photoUrl,
          videoUrl,      // Link para a IA (MP4 do Cloudinary ou original)
          blobVideoUrl,  // Link para apagar (Sempre o Vercel Blob)
          email: savedEmail,
          userName,
          sessionId,
          timestamp: new Date().toISOString(),
        }),
      });
      
      console.log("[Flowzi] n8n response status:", n8nResponse.status);
      
      if (n8nResponse.ok) {
        localStorage.removeItem('flowzi_pending_job');
        console.log("[Flowzi] Success! Cleared localStorage and showing success page.");
        trackEvent('video_generation_queued', { email: savedEmail });
        setEmail(savedEmail);
        setCurrentStep("success");
      } else {
        const errorText = await n8nResponse.text();
        console.error("[Flowzi] n8n error response:", errorText);
        throw new Error("Erro ao enviar para processamento");
      }
    } catch (error) {
      console.error("[Flowzi] Checkout complete error:", error);
      setApiError(error instanceof Error ? error.message : "Erro ao finalizar. Contacta o suporte.");
      setCurrentStep("error");
    }
  };

  const resetAndClose = () => {
    setCurrentStep("upload");
    setUploadedImage(null);
    setUploadedVideo(null);
    setImageFile(null);
    setVideoFile(null);
    setVideoFileName("");
    setEmail("");
    setName("");
    setConfirmed(false);
    setImageError(null);
    setVideoError(null);
    setTaskId(null);
    setApiError(null);
    setClientSecret(null);
    setCheckoutSessionId(null);
    onClose();
  };

  const resetForm = () => {
    setCurrentStep("upload");
    setUploadedImage(null);
    setUploadedVideo(null);
    setImageFile(null);
    setVideoFile(null);
    setVideoFileName("");
    setEmail("");
    setName("");
    setConfirmed(false);
    setImageError(null);
    setVideoError(null);
    setTaskId(null);
    setApiError(null);
    setClientSecret(null);
    setCheckoutSessionId(null);
  };

  // Determine modal size based on step
  const getModalSize = () => {
    if (currentStep === "payment" || currentStep === "success") return "max-w-4xl";
    return "max-w-2xl";
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
        <div className="min-h-screen flex items-center justify-center p-4 md:p-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`w-full ${getModalSize()} transition-all duration-300`}
          >
            {/* Close Button */}
            <button
              onClick={resetAndClose}
              className="absolute top-4 right-4 md:top-6 md:right-6 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all z-10 group"
            >
              <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            </button>

            <div className="glass-card p-6 md:p-10 border border-white/10 rounded-3xl shadow-2xl">
              {/* Step Indicator */}
              {!["payment", "processing", "success", "error"].includes(currentStep) && (
                <div className="flex items-center justify-center gap-3 mb-8">
                  {["upload", "video", "checkout"].map((step, index) => {
                    const stepOrder = ["upload", "video", "checkout"];
                    const currentIndex = stepOrder.indexOf(currentStep);
                    const isCompleted = currentIndex > index;
                    const isCurrent = currentStep === step;
                    
                    return (
                      <div key={step} className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                            isCompleted || isCurrent
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-muted-foreground"
                          }`}
                        >
                          {isCompleted ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            index + 1
                          )}
                        </div>
                        {index < 2 && (
                          <div className={`w-8 h-0.5 ${
                            currentIndex > index ? "bg-primary" : "bg-secondary"
                          }`} />
                        )}
                      </div>
                    );
                  })}
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
                            onClick={() => { setUploadedImage(null); setImageFile(null); setImageError(null); }}
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

                    <div className="mt-4 p-4 bg-secondary/30 rounded-xl border border-white/5 space-y-2">
                      <p className="text-xs text-muted-foreground">
                        <strong className="text-foreground/80">Requisitos:</strong> Rosto claro e bem iluminado • Proporção entre 2:5 e 5:2 • Lado maior ≥ 300px
                      </p>
                      <p className="text-[10px] text-primary/70 italic flex items-start gap-1.5 leading-tight">
                        <Sparkles className="w-3 h-3 flex-shrink-0 mt-0.5" />
                        <span>Dica: Para melhores resultados, tenta usar uma foto com o fundo parecido ao do vídeo original.</span>
                      </p>
                    </div>

                    <div className="mt-8 flex justify-between items-center">
                      <button
                        onClick={resetAndClose}
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground px-4 py-2 rounded-lg font-medium transition-all"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Cancelar
                      </button>
                      <button
                        onClick={() => setCurrentStep("video")}
                        disabled={!uploadedImage}
                        className="flex items-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground px-8 py-3.5 rounded-xl font-semibold transition-all shadow-lg hover:shadow-primary/25"
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
                            onClick={() => { setUploadedVideo(null); setVideoFile(null); setVideoFileName(""); setVideoError(null); }}
                            className="text-sm text-accent hover:underline"
                          >
                            Escolher outro
                          </button>
                        </div>
                      ) : (
                        <label className="cursor-pointer block">
                          <input
                            type="file"
                            accept="video/mp4,video/quicktime"
                            onChange={handleVideoUpload}
                            className="hidden"
                          />
                          <div className="space-y-3">
                            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mx-auto">
                              <Video className="w-5 h-5 text-accent" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">Arrasta ou clica para escolher</p>
                              <p className="text-xs text-muted-foreground mt-1">MP4 ou MOV • Máx 100MB • Min 720x720</p>
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

                    <div className="mt-4 p-4 bg-secondary/30 rounded-xl border border-white/5">
                      <p className="text-xs text-muted-foreground">
                        <strong className="text-foreground/80">Requisitos:</strong> Máximo 12 segundos • Resolução mínima 720x720 • Qualquer orientação • Movimento visível do corpo
                      </p>
                    </div>

                    <div className="mt-8 flex justify-between items-center">
                      <button
                        onClick={() => setCurrentStep("upload")}
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground px-4 py-2 rounded-lg font-medium transition-all"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Voltar
                      </button>
                      <button
                        onClick={() => setCurrentStep("checkout")}
                        disabled={!uploadedVideo || !!videoError}
                        className="flex items-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground px-8 py-3.5 rounded-xl font-semibold transition-all shadow-lg hover:shadow-primary/25"
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
                    <h3 className="text-xl font-bold mb-8 text-center">Finalizar Pedido</h3>

                    {/* Preview */}
                    <div className="flex gap-4 justify-center items-center mb-8 p-4 bg-secondary/30 rounded-2xl border border-white/5">
                      {uploadedImage && (
                        <img src={uploadedImage} alt="Foto" className="w-14 h-14 rounded-xl object-cover shadow-lg" />
                      )}
                      <div className="text-2xl text-muted-foreground">+</div>
                      {uploadedVideo && (
                        <video src={uploadedVideo} className="w-14 h-14 rounded-xl object-cover shadow-lg" muted />
                      )}
                      <div className="text-2xl text-muted-foreground">=</div>
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>
                    </div>

                    {/* Form */}
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-semibold mb-2">Email</label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="teu@email.com"
                          className="w-full px-5 py-4 rounded-xl bg-secondary/50 border border-white/10 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-base"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Nome</label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="O teu nome"
                          className="w-full px-5 py-4 rounded-xl bg-secondary/50 border border-white/10 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-base"
                        />
                      </div>

                      <label className="flex items-start gap-4 cursor-pointer p-4 bg-secondary/20 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                        <input
                          type="checkbox"
                          checked={confirmed}
                          onChange={(e) => setConfirmed(e.target.checked)}
                          className="mt-0.5 w-5 h-5 rounded border-white/20 text-primary focus:ring-primary bg-secondary"
                        />
                        <span className="text-sm text-muted-foreground leading-relaxed">
                          Confirmo que tenho permissão para usar esta foto e aceito os termos de utilização.
                        </span>
                      </label>
                    </div>

                    <div className="mt-8">
                      <button
                        onClick={handleProceedToPayment}
                        disabled={!email || !name || !confirmed || isProcessing}
                        className="w-full flex items-center justify-center gap-3 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground px-6 py-5 rounded-2xl font-bold text-lg transition-all shadow-xl hover:shadow-primary/30 group"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            A carregar ficheiros...
                          </>
                        ) : (
                          <>
                            <Lock className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            Continuar para Pagamento
                          </>
                        )}
                      </button>

                      <div className="flex items-center justify-center gap-6 mt-5 text-sm text-muted-foreground">
                        <span className="flex items-center gap-2">
                          <Shield className="w-4 h-4" />
                          Pagamento Seguro
                        </span>
                        <span className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4" />
                          Via Stripe
                        </span>
                      </div>
                    </div>

                    <div className="mt-6">
                      <button
                        onClick={() => setCurrentStep("video")}
                        disabled={isProcessing}
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Voltar
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Payment (Stripe Embedded Checkout) */}
                {currentStep === "payment" && clientSecret && (
                  <motion.div
                    key="payment"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-xl font-bold mb-6 text-center">Pagamento Seguro</h3>
                    
                    <Suspense fallback={
                      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                        <Loader2 className="w-10 h-10 animate-spin text-primary" />
                        <p className="text-muted-foreground">A carregar Stripe...</p>
                      </div>
                    }>
                      <StripeCheckout
                        clientSecret={clientSecret}
                        onComplete={() => {
                          if (checkoutSessionId) {
                            handleCheckoutComplete(checkoutSessionId);
                          }
                        }}
                      />
                    </Suspense>

                    <div className="mt-6">
                      <button
                        onClick={() => {
                          setClientSecret(null);
                          setCurrentStep("checkout");
                        }}
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground px-4 py-2 rounded-lg font-medium transition-all"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Voltar
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Processing Step */}
                {currentStep === "processing" && (
                  <motion.div
                    key="processing"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center py-8"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-16 h-16 rounded-full border-4 border-primary/30 border-t-primary mx-auto mb-6"
                    />

                    <h3 className="text-xl font-bold mb-2">A Processar...</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      A confirmar pagamento e iniciar geração
                    </p>
                  </motion.div>
                )}

                {/* Success - Thank You Page */}
                {currentStep === "success" && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative"
                  >
                    {/* Confetti */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      {[...Array(30)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-2 h-2 rounded-full animate-confetti"
                          style={{
                            left: `${Math.random() * 100}%`,
                            top: `-5%`,
                            backgroundColor: i % 3 === 0 ? '#2563eb' : i % 3 === 1 ? '#a855f7' : '#22c55e',
                            animationDelay: `${Math.random() * 1.2}s`,
                          }}
                        />
                      ))}
                    </div>

                    {/* Main Content */}
                    <div className="text-center py-8">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500/30 to-green-600/30 flex items-center justify-center mx-auto mb-6 border border-green-500/30"
                      >
                        <Check className="w-10 h-10 text-green-400" />
                      </motion.div>

                      <h2 className="text-2xl md:text-3xl font-black mb-3">Obrigado pela Compra! 🎉</h2>
                      <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
                        O teu vídeo personalizado está a ser criado pela nossa IA de última geração.
                      </p>

                      {/* Info Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 max-w-lg mx-auto">
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="flex items-center gap-4 p-5 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border border-primary/20 text-left"
                        >
                          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                            <Clock className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <p className="font-bold text-foreground">8-12 minutos</p>
                            <p className="text-sm text-muted-foreground">Tempo estimado</p>
                          </div>
                        </motion.div>

                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                          className="flex items-center gap-4 p-5 bg-gradient-to-br from-accent/10 to-accent/5 rounded-2xl border border-accent/20 text-left"
                        >
                          <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
                            <Mail className="w-6 h-6 text-accent" />
                          </div>
                          <div>
                            <p className="font-bold text-foreground truncate max-w-[140px]">{email}</p>
                            <p className="text-sm text-muted-foreground">Recebes por email</p>
                          </div>
                        </motion.div>
                      </div>

                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-sm text-muted-foreground mb-8 p-4 bg-secondary/30 rounded-xl border border-white/5"
                      >
                        💡 <strong>Dica:</strong> Verifica a tua caixa de entrada e a pasta de spam. O email chegará assim que o vídeo estiver pronto!
                      </motion.p>

                      {/* Example Videos Preview */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="mb-8"
                      >
                        <p className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">
                          Enquanto esperas, vê alguns exemplos
                        </p>
                        <div className="flex justify-center gap-3">
                          {[
                            { src: "/videolanding1.mp4", label: "Ads" },
                            { src: "/cotrim.mp4", label: "Humor" },
                            { src: "/videolanding2.mov", label: "Social" }
                          ].map((item, i) => (
                            <motion.div 
                              key={item.src}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.7 + i * 0.1 }}
                              className="group relative w-20 h-32 md:w-24 md:h-40 rounded-xl overflow-hidden border border-white/10 shadow-lg bg-black/20"
                            >
                              <video 
                                src={item.src} 
                                className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                                muted 
                                playsInline
                                loop
                                autoPlay
                              />
                              <div className="absolute bottom-1 left-0 right-0 text-[10px] text-white/50 font-medium">
                                {item.label}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-3">
                        <motion.button
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.8 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={resetForm}
                          className="inline-flex items-center justify-center gap-3 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg"
                        >
                          <RefreshCw className="w-5 h-5" />
                          Criar Outro Vídeo
                        </motion.button>
                        <motion.button
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.9 }}
                          onClick={resetAndClose}
                          className="inline-flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground px-6 py-3 rounded-xl font-medium transition-all"
                        >
                          Voltar à Página Inicial
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Error */}
                {currentStep === "error" && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center py-6"
                  >
                    <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-4">
                      <AlertCircle className="w-8 h-8 text-destructive" />
                    </div>

                    <h3 className="text-xl font-bold mb-2">Ups, Algo Correu Mal 😔</h3>
                    <p className="text-muted-foreground text-sm mb-6">
                      {apiError || "Ocorreu um erro inesperado."}
                    </p>

                    <div className="flex flex-col gap-3">
                      <button
                        onClick={() => setCurrentStep("checkout")}
                        className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-medium transition-all"
                      >
                        Tentar Novamente
                      </button>
                      <button
                        onClick={resetAndClose}
                        className="inline-flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground px-6 py-2 rounded-lg font-medium transition-all text-sm"
                      >
                        Fechar
                      </button>
                    </div>

                    <p className="mt-6 text-xs text-muted-foreground/60">
                      Se o problema persistir, contacta flowzi.geral@gmail.com
                    </p>
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
