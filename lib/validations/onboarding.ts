import { z } from "zod";

export const step1Schema = z.object({
  fullName: z.string().min(3, "Ingresa tu nombre completo"),
  organization: z.string().min(2, "Ingresa tu organización"),
  dni: z
    .string()
    .min(3, "Mínimo 3 caracteres")
    .max(50, "Máximo 50 caracteres")
    .regex(/^[A-Za-z0-9]+$/, "Solo letras y números"),
  ageRange: z.enum(["18-24", "25-34", "35-44", "45+"], {
    message: "Selecciona tu edad",
  }),
  phoneNumber: z
    .string()
    .min(8, "Número muy corto")
    .max(20, "Número muy largo")
    .regex(/^\+?[1-9]\d{1,14}$/, "Formato inválido. Ejemplo: +51987654321"),
  emergencyContactName: z
    .string()
    .min(3, "Ingresa el nombre del contacto"),
  emergencyContactPhone: z
    .string()
    .min(8, "Número muy corto")
    .max(20, "Número muy largo")
    .regex(/^\+?[1-9]\d{1,14}$/, "Formato inválido. Ejemplo: +51987654321"),
  emergencyContactRelationship: z.enum(
    ["parent", "sibling", "spouse", "friend", "other"],
    { message: "Selecciona la relación" }
  ),
});

export const step2Schema = z.object({
  profilePhotoUrl: z.string().min(1, "Sube tu foto de perfil"),
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
    message: "Completa todos los datos de la laptop",
    path: ["laptopBrand"],
  }
);

export const step3Schema = z.object({
  experienceLevel: z.enum(["beginner", "intermediate", "advanced"]),
  gender: z.enum(["male", "female", "other", "prefer-not-to-say"]).optional(),
  additionalNotes: z.string().optional(),
  techStack: z.array(z.string()).optional(),
});

export const step4Schema = z.object({
  rulesAccepted: z.boolean().refine((val) => val === true, {
    message: "Acepta las reglas del hackathon",
  }),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "Acepta los términos y condiciones",
  }),
  dataConsentAccepted: z.boolean().refine((val) => val === true, {
    message: "Autoriza el uso de datos",
  }),
  mediaReleaseAccepted: z.boolean().refine((val) => val === true, {
    message: "Autoriza el uso de fotos y videos",
  }),
  ageVerified: z.boolean().refine((val) => val === true, {
    message: "Confirma que tienes 18+ años",
  }),
});

export type Step1Data = z.infer<typeof step1Schema>;
export type Step2Data = z.infer<typeof step2Schema>;
export type Step3Data = z.infer<typeof step3Schema>;
export type Step4Data = z.infer<typeof step4Schema>;
