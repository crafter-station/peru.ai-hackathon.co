import { z } from "zod";

export const step1Schema = z.object({
  fullName: z.string().min(3, "Nombre completo requerido"),
  organization: z.string().min(2, "Organización requerida"),
  dni: z
    .string()
    .length(8, "DNI debe tener 8 dígitos")
    .regex(/^\d+$/, "Solo números permitidos"),
  ageRange: z.enum(["18-24", "25-34", "35-44", "45+"], {
    message: "Selecciona tu rango de edad",
  }),
  phoneNumber: z
    .string()
    .regex(/^\+51\d{9}$/, "Formato: +51XXXXXXXXX (9 dígitos)"),
  emergencyContactName: z
    .string()
    .min(3, "Nombre del contacto de emergencia requerido"),
  emergencyContactPhone: z
    .string()
    .regex(/^\+51\d{9}$/, "Formato: +51XXXXXXXXX (9 dígitos)"),
  emergencyContactRelationship: z.enum(
    ["parent", "sibling", "spouse", "friend", "other"],
    { message: "Selecciona la relación" }
  ),
});

export const step2Schema = z.object({
  profilePhotoUrl: z.string().min(1, "Foto de perfil requerida"),
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
  experienceLevel: z.enum(["beginner", "intermediate", "advanced"]),
  gender: z.enum(["male", "female", "other", "prefer-not-to-say"]).optional(),
  additionalNotes: z.string().optional(),
  techStack: z.array(z.string()).optional(),
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
