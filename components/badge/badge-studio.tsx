"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import NextImage from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface BadgeConfig {
  profilePicture: {
    url: string | null;
    x: number;
    y: number;
    width: number;
    height: number;
  };
  participantNumber: {
    text: string;
    x: number;
    y: number;
    fontSize: number;
    fontWeight: string;
    color: string;
    fontFamily: string;
  };
  participantNumber2: {
    text: string;
    x: number;
    y: number;
    fontSize: number;
    fontWeight: string;
    color: string;
    fontFamily: string;
  };
  firstName: {
    text: string;
    x: number;
    y: number;
    fontSize: number;
    fontWeight: string;
    color: string;
    fontFamily: string;
    letterSpacing: string;
  };
  lastName: {
    text: string;
    x: number;
    y: number;
    fontSize: number;
    fontWeight: string;
    color: string;
    fontFamily: string;
    letterSpacing: string;
  };
  role: {
    text: string;
    x: number;
    y: number;
    fontSize: number;
    fontWeight: string;
    color: string;
    fontFamily: string;
  };
  qrCode: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

const DEFAULT_CONFIG: BadgeConfig = {
  profilePicture: {
    url: null,
    x: 45.842790213430476,
    y: 265.46173867777236,
    width: 700,
    height: 700,
  },
  participantNumber: {
    text: "#001",
    x: 407.8021863612701,
    y: 343.34721499219154,
    fontSize: 32,
    fontWeight: "400",
    color: "rgba(246, 246, 246, 0.09)",
    fontFamily: "'Adelle Mono'",
  },
  participantNumber2: {
    text: "#001",
    x: 411.5190005205624,
    y: 1031.5543987506467,
    fontSize: 32,
    fontWeight: "400",
    color: "rgba(246, 246, 246, 0.09)",
    fontFamily: "'Adelle Mono'",
  },
  firstName: {
    text: "CRISTIAN",
    x: 473.5817012876032,
    y: 1198.84882384131,
    fontSize: 60,
    fontWeight: "700",
    color: "#FFFFFF",
    fontFamily: "bomstad-display, sans-serif",
    letterSpacing: "0.08em",
  },
  lastName: {
    text: "CORREA",
    x: 458.33774981191004,
    y: 1256.790067915308,
    fontSize: 60,
    fontWeight: "700",
    color: "#FFFFFF",
    fontFamily: "bomstad-display, sans-serif",
    letterSpacing: "0.08em",
  },
  role: {
    text: "KEBO FOUNDER",
    x: 467.92609730627487,
    y: 1317.076218001156,
    fontSize: 40,
    fontWeight: "400",
    color: "#FFFFFF",
    fontFamily: "'Adelle Mono'",
  },
  qrCode: {
    x: 107.5300849661869,
    y: 1152.0579656293544,
    width: 179,
    height: 169.05,
  },
};

export function BadgeStudio() {
  const [config, setConfig] = useState<BadgeConfig>(DEFAULT_CONFIG);
  const [isDragging, setIsDragging] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const url = event.target?.result as string;
          setConfig((prev) => ({
            ...prev,
            profilePicture: { ...prev.profilePicture, url },
          }));
        };
        reader.readAsDataURL(file);
      }
    },
    [],
  );

  const handleMouseDown = useCallback(
    (element: "profilePicture" | "participantNumber" | "participantNumber2" | "firstName" | "lastName" | "role" | "qrCode", e: React.MouseEvent) => {
      if (!svgRef.current) return;
      const svg = svgRef.current;
      const rect = svg.getBoundingClientRect();
      const viewBox = svg.viewBox.baseVal;
      const scaleX = viewBox.width / rect.width;
      const scaleY = viewBox.height / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;

      setIsDragging(element);
      setDragStart({ x, y });
    },
    [],
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent | React.MouseEvent) => {
      if (!isDragging || !svgRef.current) return;

      const svg = svgRef.current;
      const rect = svg.getBoundingClientRect();
      const viewBox = svg.viewBox.baseVal;
      const scaleX = viewBox.width / rect.width;
      const scaleY = viewBox.height / rect.height;
      const currentX = (e.clientX - rect.left) * scaleX;
      const currentY = (e.clientY - rect.top) * scaleY;

      const deltaX = currentX - dragStart.x;
      const deltaY = currentY - dragStart.y;

      setConfig((prev) => {
        if (isDragging === "profilePicture") {
          return {
            ...prev,
            profilePicture: {
              ...prev.profilePicture,
              x: Math.max(0, Math.min(1080 - prev.profilePicture.width, prev.profilePicture.x + deltaX)),
              y: Math.max(0, Math.min(1440 - prev.profilePicture.height, prev.profilePicture.y + deltaY)),
            },
          };
        } else if (isDragging === "participantNumber") {
          return {
            ...prev,
            participantNumber: {
              ...prev.participantNumber,
              x: Math.max(0, Math.min(1080, prev.participantNumber.x + deltaX)),
              y: Math.max(0, Math.min(1440, prev.participantNumber.y + deltaY)),
            },
          };
        } else if (isDragging === "participantNumber2") {
          return {
            ...prev,
            participantNumber2: {
              ...prev.participantNumber2,
              x: Math.max(0, Math.min(1080, prev.participantNumber2.x + deltaX)),
              y: Math.max(0, Math.min(1440, prev.participantNumber2.y + deltaY)),
            },
          };
        } else if (isDragging === "firstName") {
          return {
            ...prev,
            firstName: {
              ...prev.firstName,
              x: Math.max(0, Math.min(1080, prev.firstName.x + deltaX)),
              y: Math.max(0, Math.min(1440, prev.firstName.y + deltaY)),
            },
          };
        } else if (isDragging === "lastName") {
          return {
            ...prev,
            lastName: {
              ...prev.lastName,
              x: Math.max(0, Math.min(1080, prev.lastName.x + deltaX)),
              y: Math.max(0, Math.min(1440, prev.lastName.y + deltaY)),
            },
          };
        } else if (isDragging === "role") {
          return {
            ...prev,
            role: {
              ...prev.role,
              x: Math.max(0, Math.min(1080, prev.role.x + deltaX)),
              y: Math.max(0, Math.min(1440, prev.role.y + deltaY)),
            },
          };
        } else if (isDragging === "qrCode") {
          return {
            ...prev,
            qrCode: {
              ...prev.qrCode,
              x: Math.max(0, Math.min(1080 - prev.qrCode.width, prev.qrCode.x + deltaX)),
              y: Math.max(0, Math.min(1440 - prev.qrCode.height, prev.qrCode.y + deltaY)),
            },
          };
        }
        return prev;
      });

      setDragStart({ x: currentX, y: currentY });
    },
    [isDragging, dragStart],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(null);
  }, []);

  useEffect(() => {
    if (isDragging) {
      const handleDocumentMouseMove = (e: MouseEvent) => handleMouseMove(e);
      const handleDocumentMouseUp = () => handleMouseUp();

      document.addEventListener("mousemove", handleDocumentMouseMove);
      document.addEventListener("mouseup", handleDocumentMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleDocumentMouseMove);
        document.removeEventListener("mouseup", handleDocumentMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const copyConfig = useCallback(() => {
    const configToCopy = {
      ...config,
      profilePicture: {
        x: config.profilePicture.x,
        y: config.profilePicture.y,
        width: config.profilePicture.width,
        height: config.profilePicture.height,
      },
    };
    const configJson = JSON.stringify(configToCopy, null, 2);
    navigator.clipboard.writeText(configJson);
    alert("Configuration copied to clipboard!");
  }, [config]);

  const resetConfig = useCallback(() => {
    setConfig(DEFAULT_CONFIG);
  }, []);

  const downloadPreview = useCallback(async () => {
    if (!svgRef.current) return;

    try {
      const canvas = document.createElement("canvas");
      canvas.width = 1080;
      canvas.height = 1440;
      const ctx = canvas.getContext("2d");
      
      if (!ctx) {
        alert("Canvas not supported");
        return;
      }

      ctx.fillStyle = "#0C0C0E";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const baseImg = new Image();
      baseImg.crossOrigin = "anonymous";
      
      await new Promise<void>((resolve, reject) => {
        baseImg.onload = () => {
          ctx.drawImage(baseImg, 0, 0, 1080, 1440);
          resolve();
        };
        baseImg.onerror = () => {
          reject(new Error("Failed to load base image"));
        };
        baseImg.src = "/onboarding/THC-IA HACK PE-ID-Participante.svg";
      });

      const svg = svgRef.current.cloneNode(true) as SVGSVGElement;
      
      const svgData = new XMLSerializer().serializeToString(svg);
      
      const svgWithFonts = svgData.replace(
        /font-family="[^"]*"/g,
        (match) => {
          if (match.includes("Adelle Mono")) {
            return `font-family="'Adelle Mono'"`;
          }
          return match;
        }
      );

      const svgBlob = new Blob([svgWithFonts], { type: "image/svg+xml;charset=utf-8" });
      const svgUrl = URL.createObjectURL(svgBlob);

      const overlayImg = new Image();
      await new Promise<void>((resolve, reject) => {
        overlayImg.onload = () => {
          ctx.drawImage(overlayImg, 0, 0, 1080, 1440);
          URL.revokeObjectURL(svgUrl);
          resolve();
        };
        overlayImg.onerror = () => {
          URL.revokeObjectURL(svgUrl);
          reject(new Error("Failed to load overlay"));
        };
        overlayImg.src = svgUrl;
      });

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `badge-preview-${Date.now()}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
      }, "image/png", 1.0);
    } catch (error) {
      console.error("Error downloading preview:", error);
      alert("Error downloading preview image. Please try again.");
    }
  }, []);

  const generateTestImage = useCallback(async () => {
    setIsGeneratingImage(true);
    try {
      const response = await fetch("/api/badge/generate-test-image", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to generate test image");
      }

      const data = await response.json();
      
      if (data.url) {
        setConfig((prev) => ({
          ...prev,
          profilePicture: { ...prev.profilePicture, url: data.url },
        }));
      }
    } catch (error) {
      console.error("Error generating test image:", error);
      alert("Error generating test image. Please try uploading an image instead.");
    } finally {
      setIsGeneratingImage(false);
    }
  }, []);

  return (
    <div className="w-full max-w-[1920px] mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Badge Studio</h1>
          <p className="text-muted-foreground mt-1">
            Design and position badge elements. Drag elements to reposition.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={resetConfig}>
            Reset
          </Button>
          <Button variant="outline" onClick={downloadPreview}>
            Download Preview
          </Button>
          <Button onClick={copyConfig}>Copy Config</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="border rounded-lg bg-muted/20 p-4 flex items-center justify-center" style={{ minHeight: "600px" }}>
                <div className="relative w-full max-w-full" style={{ aspectRatio: "1080/1440" }}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-full h-full max-w-full max-h-full" style={{ width: "100%", height: "100%" }}>
                      <NextImage
                        src="/onboarding/THC-IA HACK PE-ID-Participante.svg"
                        alt="Badge Base"
                        fill
                        className="object-contain pointer-events-none"
                        sizes="(max-width: 1080px) 100vw, 1080px"
                      />
                      <svg
                        ref={svgRef}
                        width="1080"
                        height="1440"
                        viewBox="0 0 1080 1440"
                        className="absolute top-0 left-0 w-full h-full"
                        style={{ 
                          pointerEvents: "all"
                        }}
                        preserveAspectRatio="xMidYMid meet"
                        onMouseMove={handleMouseMove}
                      >
                    <defs>
                      <filter id="grayscale-filter">
                        <feColorMatrix
                          type="matrix"
                          values="0.2126 0.7152 0.0722 0 0
                                  0.2126 0.7152 0.0722 0 0
                                  0.2126 0.7152 0.0722 0 0
                                  0 0 0 1 0"
                        />
                      </filter>
                    </defs>

                    {config.profilePicture.url && (
                      <g
                        className={cn(
                          "cursor-move pointer-events-auto",
                          isDragging === "profilePicture" && "opacity-80",
                        )}
                        onMouseDown={(e) => handleMouseDown("profilePicture", e)}
                      >
                        <image
                          href={config.profilePicture.url}
                          x={config.profilePicture.x}
                          y={config.profilePicture.y}
                          width={config.profilePicture.width}
                          height={config.profilePicture.height}
                          filter="url(#grayscale-filter)"
                        />
                      </g>
                    )}

                    <text
                      x={config.participantNumber.x}
                      y={config.participantNumber.y}
                      textAnchor="middle"
                      fontSize="32"
                      fontWeight="400"
                      fill="rgba(246, 246, 246, 0.09)"
                      fontFamily="'Adelle Mono'"
                      letterSpacing="0.34em"
                      className={cn(
                        "cursor-move select-none pointer-events-auto",
                        isDragging === "participantNumber" && "opacity-80",
                      )}
                      style={{ 
                        textTransform: "uppercase",
                        lineHeight: "47px",
                      }}
                      onMouseDown={(e) => handleMouseDown("participantNumber", e)}
                    >
                      {`${config.participantNumber.text.toUpperCase()} * ${config.participantNumber.text.toUpperCase()} * ${config.participantNumber.text.toUpperCase()}`}
                    </text>

                    <text
                      x={config.participantNumber2.x}
                      y={config.participantNumber2.y}
                      textAnchor="middle"
                      fontSize="32"
                      fontWeight="400"
                      fill="rgba(246, 246, 246, 0.09)"
                      fontFamily="'Adelle Mono'"
                      letterSpacing="0.34em"
                      className={cn(
                        "cursor-move select-none pointer-events-auto",
                        isDragging === "participantNumber2" && "opacity-80",
                      )}
                      style={{ 
                        textTransform: "uppercase",
                        lineHeight: "47px",
                      }}
                      onMouseDown={(e) => handleMouseDown("participantNumber2", e)}
                    >
                      {`${config.participantNumber2.text.toUpperCase()} * ${config.participantNumber2.text.toUpperCase()} * ${config.participantNumber2.text.toUpperCase()}`}
                    </text>

                    <text
                      x={config.firstName.x}
                      y={config.firstName.y}
                      textAnchor="middle"
                      fontSize={config.firstName.fontSize}
                      fontWeight={config.firstName.fontWeight}
                      fill={config.firstName.color}
                      fontFamily={config.firstName.fontFamily}
                      letterSpacing={config.firstName.letterSpacing}
                      className={cn(
                        "cursor-move select-none pointer-events-auto",
                        isDragging === "firstName" && "opacity-80",
                      )}
                      style={{ textTransform: "uppercase" }}
                      onMouseDown={(e) => handleMouseDown("firstName", e)}
                    >
                      {config.firstName.text.toUpperCase()}
                    </text>

                    <text
                      x={config.lastName.x}
                      y={config.lastName.y}
                      textAnchor="middle"
                      fontSize={config.lastName.fontSize}
                      fontWeight={config.lastName.fontWeight}
                      fill={config.lastName.color}
                      fontFamily={config.lastName.fontFamily}
                      letterSpacing={config.lastName.letterSpacing}
                      className={cn(
                        "cursor-move select-none pointer-events-auto",
                        isDragging === "lastName" && "opacity-80",
                      )}
                      style={{ textTransform: "uppercase" }}
                      onMouseDown={(e) => handleMouseDown("lastName", e)}
                    >
                      {config.lastName.text.toUpperCase()}
                    </text>

                    <text
                      x={config.role.x}
                      y={config.role.y}
                      textAnchor="middle"
                      fontSize={config.role.fontSize}
                      fontWeight={config.role.fontWeight}
                      fill={config.role.color}
                      fontFamily={config.role.fontFamily}
                      className={cn(
                        "cursor-move select-none pointer-events-auto",
                        isDragging === "role" && "opacity-80",
                      )}
                      style={{ textTransform: "uppercase" }}
                      onMouseDown={(e) => handleMouseDown("role", e)}
                    >
                      {config.role.text.toUpperCase()}
                    </text>

                    {/* QR Code Mockup */}
                    <g
                      className={cn(
                        "cursor-move pointer-events-auto",
                        isDragging === "qrCode" && "opacity-80",
                      )}
                      onMouseDown={(e) => handleMouseDown("qrCode", e)}
                    >
                      <rect
                        x={config.qrCode.x}
                        y={config.qrCode.y}
                        width={config.qrCode.width}
                        height={config.qrCode.height}
                        fill="white"
                        stroke="black"
                        strokeWidth="2"
                      />
                      {/* Mock QR pattern - scaled to fit 179x169.05 */}
                      <rect
                        x={config.qrCode.x + 12}
                        y={config.qrCode.y + 12}
                        width={35}
                        height={35}
                        fill="black"
                      />
                      <rect
                        x={config.qrCode.x + 58}
                        y={config.qrCode.y + 12}
                        width={35}
                        height={35}
                        fill="black"
                      />
                      <rect
                        x={config.qrCode.x + 104}
                        y={config.qrCode.y + 12}
                        width={35}
                        height={35}
                        fill="black"
                      />
                      <rect
                        x={config.qrCode.x + 12}
                        y={config.qrCode.y + 58}
                        width={23}
                        height={23}
                        fill="black"
                      />
                      <rect
                        x={config.qrCode.x + 46}
                        y={config.qrCode.y + 58}
                        width={12}
                        height={12}
                        fill="black"
                      />
                      <rect
                        x={config.qrCode.x + 70}
                        y={config.qrCode.y + 58}
                        width={23}
                        height={23}
                        fill="black"
                      />
                      <rect
                        x={config.qrCode.x + 104}
                        y={config.qrCode.y + 58}
                        width={23}
                        height={23}
                        fill="black"
                      />
                      <rect
                        x={config.qrCode.x + 12}
                        y={config.qrCode.y + 92}
                        width={35}
                        height={35}
                        fill="black"
                      />
                      <rect
                        x={config.qrCode.x + 58}
                        y={config.qrCode.y + 92}
                        width={12}
                        height={12}
                        fill="black"
                      />
                      <rect
                        x={config.qrCode.x + 81}
                        y={config.qrCode.y + 92}
                        width={23}
                        height={23}
                        fill="black"
                      />
                      <rect
                        x={config.qrCode.x + 115}
                        y={config.qrCode.y + 92}
                        width={23}
                        height={23}
                        fill="black"
                      />
                      <rect
                        x={config.qrCode.x + 12}
                        y={config.qrCode.y + 128}
                        width={23}
                        height={23}
                        fill="black"
                      />
                      <rect
                        x={config.qrCode.x + 46}
                        y={config.qrCode.y + 128}
                        width={35}
                        height={23}
                        fill="black"
                      />
                      <rect
                        x={config.qrCode.x + 92}
                        y={config.qrCode.y + 128}
                        width={23}
                        height={23}
                        fill="black"
                      />
                    </g>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-5">
          <div className="sticky top-6 space-y-6 max-h-[calc(100vh-100px)] overflow-y-auto">
          <Card>
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="profile-upload">Upload Image</Label>
                <Input
                  id="profile-upload"
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  className="mt-1"
                />
              </div>
              <div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={generateTestImage}
                  disabled={isGeneratingImage}
                  className="w-full"
                >
                  {isGeneratingImage ? "Generating..." : "Generate Test Image (AI)"}
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="profile-x">X Position</Label>
                  <Input
                    id="profile-x"
                    type="number"
                    value={config.profilePicture.x}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        profilePicture: {
                          ...prev.profilePicture,
                          x: Number(e.target.value),
                        },
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="profile-y">Y Position</Label>
                  <Input
                    id="profile-y"
                    type="number"
                    value={config.profilePicture.y}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        profilePicture: {
                          ...prev.profilePicture,
                          y: Number(e.target.value),
                        },
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="profile-width">Width</Label>
                  <Input
                    id="profile-width"
                    type="number"
                    value={config.profilePicture.width}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        profilePicture: {
                          ...prev.profilePicture,
                          width: Number(e.target.value),
                        },
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="profile-height">Height</Label>
                  <Input
                    id="profile-height"
                    type="number"
                    value={config.profilePicture.height}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        profilePicture: {
                          ...prev.profilePicture,
                          height: Number(e.target.value),
                        },
                      }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Participant Number</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="number-text">Text</Label>
                <Input
                  id="number-text"
                  value={config.participantNumber.text}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      participantNumber: {
                        ...prev.participantNumber,
                        text: e.target.value,
                      },
                    }))
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="number-x">X Position</Label>
                  <Input
                    id="number-x"
                    type="number"
                    value={config.participantNumber.x}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        participantNumber: {
                          ...prev.participantNumber,
                          x: Number(e.target.value),
                        },
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="number-y">Y Position</Label>
                  <Input
                    id="number-y"
                    type="number"
                    value={config.participantNumber.y}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        participantNumber: {
                          ...prev.participantNumber,
                          y: Number(e.target.value),
                        },
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="number-size">Font Size</Label>
                  <Input
                    id="number-size"
                    type="number"
                    value={config.participantNumber.fontSize}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        participantNumber: {
                          ...prev.participantNumber,
                          fontSize: Number(e.target.value),
                        },
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="number-weight">Font Weight</Label>
                  <Input
                    id="number-weight"
                    value={config.participantNumber.fontWeight}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        participantNumber: {
                          ...prev.participantNumber,
                          fontWeight: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="number-color">Color</Label>
                  <Input
                    id="number-color"
                    type="color"
                    value={config.participantNumber.color}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        participantNumber: {
                          ...prev.participantNumber,
                          color: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="number-font">Font Family</Label>
                  <Input
                    id="number-font"
                    value={config.participantNumber.fontFamily}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        participantNumber: {
                          ...prev.participantNumber,
                          fontFamily: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Participant Number 2</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="number2-text">Text</Label>
                <Input
                  id="number2-text"
                  value={config.participantNumber2.text}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      participantNumber2: {
                        ...prev.participantNumber2,
                        text: e.target.value,
                      },
                    }))
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="number2-x">X Position</Label>
                  <Input
                    id="number2-x"
                    type="number"
                    value={config.participantNumber2.x}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        participantNumber2: {
                          ...prev.participantNumber2,
                          x: Number(e.target.value),
                        },
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="number2-y">Y Position</Label>
                  <Input
                    id="number2-y"
                    type="number"
                    value={config.participantNumber2.y}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        participantNumber2: {
                          ...prev.participantNumber2,
                          y: Number(e.target.value),
                        },
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="number2-size">Font Size</Label>
                  <Input
                    id="number2-size"
                    type="number"
                    value={config.participantNumber2.fontSize}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        participantNumber2: {
                          ...prev.participantNumber2,
                          fontSize: Number(e.target.value),
                        },
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="number2-weight">Font Weight</Label>
                  <Input
                    id="number2-weight"
                    value={config.participantNumber2.fontWeight}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        participantNumber2: {
                          ...prev.participantNumber2,
                          fontWeight: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="number2-color">Color</Label>
                  <Input
                    id="number2-color"
                    type="color"
                    value={config.participantNumber2.color}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        participantNumber2: {
                          ...prev.participantNumber2,
                          color: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="number2-font">Font Family</Label>
                  <Input
                    id="number2-font"
                    value={config.participantNumber2.fontFamily}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        participantNumber2: {
                          ...prev.participantNumber2,
                          fontFamily: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>First Name</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="firstname-text">Text</Label>
                <Input
                  id="firstname-text"
                  value={config.firstName.text}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      firstName: {
                        ...prev.firstName,
                        text: e.target.value,
                      },
                    }))
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstname-x">X Position</Label>
                  <Input
                    id="firstname-x"
                    type="number"
                    value={config.firstName.x}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        firstName: {
                          ...prev.firstName,
                          x: Number(e.target.value),
                        },
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="firstname-y">Y Position</Label>
                  <Input
                    id="firstname-y"
                    type="number"
                    value={config.firstName.y}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        firstName: {
                          ...prev.firstName,
                          y: Number(e.target.value),
                        },
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="firstname-size">Font Size</Label>
                  <Input
                    id="firstname-size"
                    type="number"
                    value={config.firstName.fontSize}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        firstName: {
                          ...prev.firstName,
                          fontSize: Number(e.target.value),
                        },
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="firstname-weight">Font Weight</Label>
                  <Input
                    id="firstname-weight"
                    value={config.firstName.fontWeight}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        firstName: {
                          ...prev.firstName,
                          fontWeight: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="firstname-color">Color</Label>
                  <Input
                    id="firstname-color"
                    type="color"
                    value={config.firstName.color}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        firstName: {
                          ...prev.firstName,
                          color: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="firstname-font">Font Family</Label>
                  <Input
                    id="firstname-font"
                    value={config.firstName.fontFamily}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        firstName: {
                          ...prev.firstName,
                          fontFamily: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="firstname-letterspacing">Letter Spacing</Label>
                  <Input
                    id="firstname-letterspacing"
                    value={config.firstName.letterSpacing}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        firstName: {
                          ...prev.firstName,
                          letterSpacing: e.target.value,
                        },
                      }))
                    }
                    placeholder="0.08em"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Last Name</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="lastname-text">Text</Label>
                <Input
                  id="lastname-text"
                  value={config.lastName.text}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      lastName: {
                        ...prev.lastName,
                        text: e.target.value,
                      },
                    }))
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="lastname-x">X Position</Label>
                  <Input
                    id="lastname-x"
                    type="number"
                    value={config.lastName.x}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        lastName: {
                          ...prev.lastName,
                          x: Number(e.target.value),
                        },
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="lastname-y">Y Position</Label>
                  <Input
                    id="lastname-y"
                    type="number"
                    value={config.lastName.y}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        lastName: {
                          ...prev.lastName,
                          y: Number(e.target.value),
                        },
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="lastname-size">Font Size</Label>
                  <Input
                    id="lastname-size"
                    type="number"
                    value={config.lastName.fontSize}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        lastName: {
                          ...prev.lastName,
                          fontSize: Number(e.target.value),
                        },
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="lastname-weight">Font Weight</Label>
                  <Input
                    id="lastname-weight"
                    value={config.lastName.fontWeight}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        lastName: {
                          ...prev.lastName,
                          fontWeight: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="lastname-color">Color</Label>
                  <Input
                    id="lastname-color"
                    type="color"
                    value={config.lastName.color}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        lastName: {
                          ...prev.lastName,
                          color: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="lastname-font">Font Family</Label>
                  <Input
                    id="lastname-font"
                    value={config.lastName.fontFamily}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        lastName: {
                          ...prev.lastName,
                          fontFamily: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="lastname-letterspacing">Letter Spacing</Label>
                  <Input
                    id="lastname-letterspacing"
                    value={config.lastName.letterSpacing}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        lastName: {
                          ...prev.lastName,
                          letterSpacing: e.target.value,
                        },
                      }))
                    }
                    placeholder="0.08em"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Role</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="role-text">Text</Label>
                <Input
                  id="role-text"
                  value={config.role.text}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      role: {
                        ...prev.role,
                        text: e.target.value,
                      },
                    }))
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="role-x">X Position</Label>
                  <Input
                    id="role-x"
                    type="number"
                    value={config.role.x}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        role: {
                          ...prev.role,
                          x: Number(e.target.value),
                        },
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="role-y">Y Position</Label>
                  <Input
                    id="role-y"
                    type="number"
                    value={config.role.y}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        role: {
                          ...prev.role,
                          y: Number(e.target.value),
                        },
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="role-size">Font Size</Label>
                  <Input
                    id="role-size"
                    type="number"
                    value={config.role.fontSize}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        role: {
                          ...prev.role,
                          fontSize: Number(e.target.value),
                        },
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="role-weight">Font Weight</Label>
                  <Input
                    id="role-weight"
                    value={config.role.fontWeight}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        role: {
                          ...prev.role,
                          fontWeight: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="role-color">Color</Label>
                  <Input
                    id="role-color"
                    type="color"
                    value={config.role.color}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        role: {
                          ...prev.role,
                          color: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="role-font">Font Family</Label>
                  <Input
                    id="role-font"
                    value={config.role.fontFamily}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        role: {
                          ...prev.role,
                          fontFamily: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>QR Code</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground">
                QR Code mockup (draggable)
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="qr-x">X Position</Label>
                  <Input
                    id="qr-x"
                    type="number"
                    value={config.qrCode.x}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        qrCode: {
                          ...prev.qrCode,
                          x: Number(e.target.value),
                        },
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="qr-y">Y Position</Label>
                  <Input
                    id="qr-y"
                    type="number"
                    value={config.qrCode.y}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        qrCode: {
                          ...prev.qrCode,
                          y: Number(e.target.value),
                        },
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="qr-width">Width</Label>
                  <Input
                    id="qr-width"
                    type="number"
                    value={config.qrCode.width}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        qrCode: {
                          ...prev.qrCode,
                          width: Number(e.target.value),
                        },
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="qr-height">Height</Label>
                  <Input
                    id="qr-height"
                    type="number"
                    value={config.qrCode.height}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        qrCode: {
                          ...prev.qrCode,
                          height: Number(e.target.value),
                        },
                      }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configuration JSON</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={JSON.stringify({
                  ...config,
                  profilePicture: {
                    x: config.profilePicture.x,
                    y: config.profilePicture.y,
                    width: config.profilePicture.width,
                    height: config.profilePicture.height,
                  },
                }, null, 2)}
                readOnly
                className="font-mono text-xs h-48"
              />
            </CardContent>
          </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

