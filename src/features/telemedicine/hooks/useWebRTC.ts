"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { SignalingMessage } from "../types";

const ICE_SERVERS: RTCIceServer[] = [
  { urls: "stun:stun.l.google.com:19302" },
  // Add TURN server(s) here for production (required behind restrictive NATs):
  // { urls: "turn:turn.yourdomain.com:3478", username: "...", credential: "..." },
];

export type CallState = "idle" | "connecting" | "connected" | "disconnected" | "failed";

interface UseWebRTCOptions {
  roomCode: string;
  userId: string;
  signalingUrl: string;
  consultationType: "VIDEO" | "AUDIO";
  /** true for the participant who initiates the offer (e.g. the patient) */
  isInitiator: boolean;
}

interface ChatMessage {
  senderId: string;
  text: string;
  timestamp: number;
}

export function useWebRTC({ roomCode, userId, signalingUrl, consultationType, isInitiator }: UseWebRTCOptions) {
  const [callState, setCallState] = useState<CallState>("idle");
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [peerJoined, setPeerJoined] = useState(false);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const cameraTrackRef = useRef<MediaStreamTrack | null>(null);
  const pendingCandidatesRef = useRef<RTCIceCandidateInit[]>([]);

  const sendSignal = useCallback((type: SignalingMessage["type"], payload?: unknown) => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    const message: SignalingMessage = {
      type,
      senderId: userId,
      roomCode,
      payload: payload !== undefined ? JSON.stringify(payload) : undefined,
    };
    ws.send(JSON.stringify(message));
  }, [roomCode, userId]);

  const createPeerConnection = useCallback((stream: MediaStream) => {
    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });

    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        sendSignal("ice-candidate", event.candidate.toJSON());
      }
    };

    pc.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
    };

    pc.onconnectionstatechange = () => {
      switch (pc.connectionState) {
        case "connected":
          setCallState("connected");
          break;
        case "disconnected":
          setCallState("disconnected");
          break;
        case "failed":
          setCallState("failed");
          break;
        default:
          break;
      }
    };

    pcRef.current = pc;
    return pc;
  }, [sendSignal]);

  const flushPendingCandidates = useCallback(async () => {
    const pc = pcRef.current;
    if (!pc) return;
    while (pendingCandidatesRef.current.length > 0) {
      const candidate = pendingCandidatesRef.current.shift();
      if (candidate) {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      }
    }
  }, []);

  const handleSignalingMessage = useCallback(async (message: SignalingMessage) => {
    const pc = pcRef.current;

    switch (message.type) {
      case "peer-joined":
        setPeerJoined(true);
        if (isInitiator && pc) {
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          sendSignal("offer", offer);
        }
        break;

      case "peer-left":
        setPeerJoined(false);
        setRemoteStream(null);
        setCallState("disconnected");
        break;

      case "offer": {
        if (!pc || !message.payload) return;
        const offer = JSON.parse(message.payload) as RTCSessionDescriptionInit;
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        await flushPendingCandidates();
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        sendSignal("answer", answer);
        break;
      }

      case "answer": {
        if (!pc || !message.payload) return;
        const answer = JSON.parse(message.payload) as RTCSessionDescriptionInit;
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
        await flushPendingCandidates();
        break;
      }

      case "ice-candidate": {
        if (!message.payload) return;
        const candidate = JSON.parse(message.payload) as RTCIceCandidateInit;
        if (pc && pc.remoteDescription) {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        } else {
          pendingCandidatesRef.current.push(candidate);
        }
        break;
      }

      case "chat": {
        if (!message.payload) return;
        const text = JSON.parse(message.payload) as string;
        setChatMessages((prev) => [...prev, { senderId: message.senderId, text, timestamp: Date.now() }]);
        break;
      }

      default:
        break;
    }
  }, [flushPendingCandidates, isInitiator, sendSignal]);

  const start = useCallback(async () => {
    setCallState("connecting");

    const constraints: MediaStreamConstraints =
      consultationType === "VIDEO" ? { video: true, audio: true } : { video: false, audio: true };

    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    setLocalStream(stream);
    cameraTrackRef.current = stream.getVideoTracks()[0] ?? null;

    createPeerConnection(stream);

    const ws = new WebSocket(signalingUrl);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const message: SignalingMessage = JSON.parse(event.data);
      void handleSignalingMessage(message);
    };

    ws.onclose = () => {
      setCallState((prev) => (prev === "connected" ? "disconnected" : prev));
    };

    ws.onerror = () => {
      setCallState("failed");
    };
  }, [consultationType, createPeerConnection, handleSignalingMessage, signalingUrl]);

  const hangUp = useCallback(() => {
    sendSignal("peer-left");
    pcRef.current?.close();
    pcRef.current = null;
    wsRef.current?.close();
    wsRef.current = null;
    localStream?.getTracks().forEach((track) => track.stop());
    setLocalStream(null);
    setRemoteStream(null);
    setCallState("idle");
  }, [localStream, sendSignal]);

  const toggleMic = useCallback(() => {
    if (!localStream) return;
    const audioTrack = localStream.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsMicMuted(!audioTrack.enabled);
    }
  }, [localStream]);

  const toggleCamera = useCallback(() => {
    if (!localStream) return;
    const videoTrack = localStream.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setIsCameraOff(!videoTrack.enabled);
    }
  }, [localStream]);

  const toggleScreenShare = useCallback(async () => {
    const pc = pcRef.current;
    if (!pc) return;

    if (!isScreenSharing) {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const screenTrack = screenStream.getVideoTracks()[0];
      const sender = pc.getSenders().find((s) => s.track?.kind === "video");
      if (sender) await sender.replaceTrack(screenTrack);

      screenTrack.onended = () => {
        void toggleScreenShare();
      };

      setIsScreenSharing(true);
      sendSignal("screen-share-toggle", { active: true });
    } else {
      const sender = pc.getSenders().find((s) => s.track?.kind === "video");
      if (sender && cameraTrackRef.current) {
        await sender.replaceTrack(cameraTrackRef.current);
      }
      setIsScreenSharing(false);
      sendSignal("screen-share-toggle", { active: false });
    }
  }, [isScreenSharing, sendSignal]);

  const sendChatMessage = useCallback((text: string) => {
    sendSignal("chat", text);
    setChatMessages((prev) => [...prev, { senderId: userId, text, timestamp: Date.now() }]);
  }, [sendSignal, userId]);

  useEffect(() => {
    return () => {
      pcRef.current?.close();
      wsRef.current?.close();
      localStream?.getTracks().forEach((track) => track.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    callState,
    localStream,
    remoteStream,
    peerJoined,
    isMicMuted,
    isCameraOff,
    isScreenSharing,
    chatMessages,
    start,
    hangUp,
    toggleMic,
    toggleCamera,
    toggleScreenShare,
    sendChatMessage,
  };
}
