"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { parseVoiceAgentStream, isAbortCommand } from "@/lib/voice/voice-agent";

interface UseVoiceChatState {
  isListening: boolean;
  isProcessing: boolean;
  isSpeaking: boolean;
  waveformBars: number[];
  error: string | null;
}

interface UseVoiceChatActions {
  startListening: () => void;
  stopListening: () => void;
  resetError: () => void;
}

/**
 * useVoiceChat - Web Speech API hook for voice input/output
 *
 * Manages:
 * - SpeechRecognition (browser STT)
 * - SSE connection to /api/agent/chat
 * - Browser SpeechSynthesis (TTS)
 * - Waveform animation during listening
 * - Abort commands ("stop", "cancel")
 */
export function useVoiceChat(
  chatMessages: Array<{ role: "user" | "assistant"; content: string }>
): [UseVoiceChatState, UseVoiceChatActions] {
  const [state, setState] = useState<UseVoiceChatState>({
    isListening: false,
    isProcessing: false,
    isSpeaking: false,
    waveformBars: Array(20).fill(0),
    error: null,
  });

  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // TTS - Speak text using Browser SpeechSynthesis
  const speakText = useCallback((text: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (typeof window === "undefined" || !window.speechSynthesis) {
        reject(new Error("Speech Synthesis not supported"));
        return;
      }

      window.speechSynthesis.cancel(); // Cancel any ongoing speech

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onend = () => resolve();
      utterance.onerror = (event: any) =>
        reject(new Error(`Speech synthesis error: ${event.error}`));

      synthesisRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    });
  }, []);

  // Handle incoming voice message
  const handleVoiceMessage = useCallback(
    async (transcript: string) => {
      setState((prev) => ({ ...prev, isProcessing: true, error: null }));
      abortControllerRef.current = new AbortController();

      try {
        // Build message history for the API
        const messages = chatMessages.map((m) => ({
          role: m.role,
          content: m.content,
        }));
        messages.push({ role: "user", content: transcript });

        const response = await fetch("/api/agent/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          throw new Error("Chat request failed");
        }

        // Parse SSE stream to get complete response
        const responseText = await parseVoiceAgentStream(response);

        // Speak the response
        setState((prev) => ({ ...prev, isSpeaking: true }));
        await speakText(responseText);
        setState((prev) => ({ ...prev, isSpeaking: false, isProcessing: false }));
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          setState((prev) => ({
            ...prev,
            error: error.message || "Voice processing failed",
            isProcessing: false,
            isSpeaking: false,
          }));
        }
      }
    },
    [chatMessages, speakText]
  );

  // Initialize SpeechRecognition (browser-specific APIs)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setState((prev) => ({ ...prev, error: "Speech Recognition not supported in this browser" }));
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    let interimTranscript = "";
    let finalTranscript = "";

    recognition.onstart = () => {
      setState((prev) => ({ ...prev, isListening: true, error: null }));
    };

    recognition.onresult = (event: any) => {
      interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + " ";
        } else {
          interimTranscript += transcript;
        }
      }

      // Check for abort commands
      const currentTranscript = (finalTranscript + interimTranscript).toLowerCase();
      if (isAbortCommand(currentTranscript)) {
        recognition.abort();
        abortControllerRef.current?.abort();
        setState((prev) => ({ ...prev, isListening: false, isProcessing: false, isSpeaking: false }));
      }
    };

    recognition.onerror = (event: any) => {
      setState((prev) => ({
        ...prev,
        isListening: false,
        error: `Speech recognition error: ${event.error}`,
      }));
    };

    recognition.onend = async () => {
      setState((prev) => ({ ...prev, isListening: false }));

      if (finalTranscript.trim() && !isAbortCommand(finalTranscript)) {
        await handleVoiceMessage(finalTranscript.trim());
      }

      finalTranscript = "";
      interimTranscript = "";
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [handleVoiceMessage]);

  // Waveform animation loop
  useEffect(() => {
    if (!state.isListening) {
      setState((prev) => ({ ...prev, waveformBars: Array(20).fill(0) }));
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    const animate = () => {
      setState((prev) => ({
        ...prev,
        waveformBars: Array(20)
          .fill(0)
          .map(() => Math.random() * 0.8 + 0.2), // Random heights 0.2-1.0
      }));
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [state.isListening]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !state.isListening) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error: error instanceof Error ? error.message : "Failed to start listening",
        }));
      }
    }
  }, [state.isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (synthesisRef.current) {
      window.speechSynthesis.cancel();
    }
    abortControllerRef.current?.abort();
    setState((prev) => ({
      ...prev,
      isListening: false,
      isProcessing: false,
      isSpeaking: false,
    }));
  }, []);

  const resetError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return [state, { startListening, stopListening, resetError }];
}
