"use client";

import { useVoiceChat } from "@/lib/hooks/useVoiceChat";

interface VoiceButtonProps {
  chatMessages?: Array<{ role: "user" | "assistant"; content: string }>;
}

/**
 * VoiceButton - Floating microphone button with waveform animation
 *
 * Features:
 * - 56px diameter button, bottom-right corner, z-index 1000
 * - Red-500 when listening, gray-400 when idle
 * - 20 animated waveform bars during listening
 * - Graceful fallback if Speech APIs unavailable
 * - Abort on "stop" or "cancel" voice commands
 */
export function VoiceButton({ chatMessages = [] }: VoiceButtonProps) {
  const [voiceState, voiceActions] = useVoiceChat(chatMessages);

  // Don't render if Speech APIs unavailable
  if (voiceState.error?.includes("not supported")) {
    return null;
  }

  const isActive = voiceState.isListening || voiceState.isProcessing || voiceState.isSpeaking;
  const buttonColor = isActive ? "bg-red-500 hover:bg-red-600" : "bg-gray-400 hover:bg-gray-500";
  const textColor = voiceState.isListening ? "text-white" : "text-white";

  return (
    <div className="fixed bottom-6 right-6 z-[1000]">
      {/* Error message */}
      {voiceState.error && (
        <div className="absolute bottom-20 right-0 bg-red-500/90 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap">
          {voiceState.error}
          <button
            onClick={voiceActions.resetError}
            className="ml-2 font-bold hover:opacity-80"
          >
            ✕
          </button>
        </div>
      )}

      {/* Status text */}
      {isActive && (
        <div className="absolute bottom-20 right-0 bg-surface border border-border text-text text-xs px-3 py-2 rounded-lg whitespace-nowrap">
          {voiceState.isListening && "Listening..."}
          {voiceState.isProcessing && !voiceState.isListening && "Processing..."}
          {voiceState.isSpeaking && !voiceState.isProcessing && "Speaking..."}
        </div>
      )}

      {/* Main button */}
      <button
        onClick={isActive ? voiceActions.stopListening : voiceActions.startListening}
        disabled={voiceState.error?.includes("not supported")}
        className={`
          w-14 h-14 rounded-full flex items-center justify-center
          transition-all duration-200 shadow-lg hover:shadow-xl
          focus:outline-2 focus:outline-offset-2 focus:outline-accent
          disabled:opacity-50 disabled:cursor-not-allowed
          ${buttonColor}
        `}
        aria-label={isActive ? "Stop voice input" : "Start voice input"}
        title={isActive ? "Stop voice input" : "Start voice input"}
      >
        {voiceState.isListening ? (
          /* Waveform during listening */
          <div className="flex items-end justify-center gap-0.5 h-6 w-8">
            {voiceState.waveformBars.map((height, idx) => (
              <div
                key={idx}
                className="w-0.5 bg-white rounded-full transition-all duration-100"
                style={{
                  height: `${Math.max(4, height * 24)}px`,
                  opacity: 0.8 + height * 0.2,
                }}
              />
            ))}
          </div>
        ) : (
          /* Microphone icon */
          <svg
            className={`w-6 h-6 ${textColor}`}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 15c1.66 0 3-1.34 3-3V6c0-1.66-1.34-3-3-3s-3 1.34-3 3v6c0 1.66 1.34 3 3 3z"/>
            <path d="M17 16.91c-1.48 1.46-3.51 2.36-5.77 2.36s-4.29-.9-5.77-2.36M19 11h-1.7c0 .74.07 1.46.2 2.16h2.12c.13-.7.2-1.42.2-2.16z"/>
            <path d="M5 11H3.3c0 .74-.07 1.46-.2 2.16H1.18C1.01 12.65 1 11.83 1 11z"/>
          </svg>
        )}
      </button>

      {/* Processing spinner */}
      {(voiceState.isProcessing || voiceState.isSpeaking) && !voiceState.isListening && (
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent border-r-accent animate-spin" />
      )}
    </div>
  );
}
