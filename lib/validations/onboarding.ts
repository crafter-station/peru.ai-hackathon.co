import { z } from "zod";

export const step1Schema = z.object({
  fullName: z.string().min(3, "Nombre completo requerido"),
  dni: z
    .string()
    .length(8, "DNI debe tener 8 dígitos")
    .regex(/^\d+$/, "Solo números permitidos"),
  dateOfBirth: z.date().max(new Date(), "Fecha inválida"),
  phoneNumber: z
    .string()
    .regex(/^\+51\d{9}$/, "Formato: +51XXXXXXXXX (9 dígitos)"),
});

export const step2Schema = z.object({
  profilePhotoUrl: z.string().optional(),
  hasLaptop: z.boolean(),
  laptopBrand: z.string().optional(),
  laptopModel: z.string().optional(),
  laptopSerialNumber: z.string().optional(),
}).refine(
  (data) => {
    if (data.hasLaptop) {
      return !!(data.laptopBrand && data.laptopModel && data.laptopSerialNumber);
    }
    return true;
  },
  {
    message: "Todos los campos de laptop son requeridos",
    path: ["laptopBrand"],
  }
);

export const step3Schema = z.object({
  dietaryPreferences: z.array(z.string()).optional().default([]),
  foodAllergies: z.string().optional(),
  tshirtSize: z.enum(["XS", "S", "M", "L", "XL", "XXL"]),
  techStack: z.array(z.string()).optional().default([]),
  experienceLevel: z.enum(["beginner", "intermediate", "advanced"]),
});

export const step4Schema = z.object({
  rulesAccepted: z.boolean().refine((val) => val === true, {
    message: "Debes aceptar las reglas del hackathon",
  }),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "Debes aceptar los términos y condiciones",
  }),
  dataConsentAccepted: z.boolean().refine((val) => val === true, {
    message: "Debes autorizar el uso de datos",
  }),
  mediaReleaseAccepted: z.boolean().refine((val) => val === true, {
    message: "Debes autorizar el uso de fotos/videos",
  }),
  ageVerified: z.boolean().refine((val) => val === true, {
    message: "Debes confirmar que tienes 18+ años",
  }),
});

export type Step1Data = z.infer<typeof step1Schema>;
export type Step2Data = z.infer<typeof step2Schema>;
export type Step3Data = z.infer<typeof step3Schema>;
export type Step4Data = z.infer<typeof step4Schema>;
