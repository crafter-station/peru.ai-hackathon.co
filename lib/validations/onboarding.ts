import { z } from "zod";

// Combined schema for Step 1 (INFO + SEGURIDAD merged)
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
  profilePhotoUrl: z.string().min(1, "Sube tu foto para generar el avatar IA"),
  hasLaptop: z.boolean(),
  laptopBrand: z.string().optional(),
}).refine(
  (data) => {
    if (data.hasLaptop) {
      return !!data.laptopBrand;
    }
    return true;
  },
  {
    message: "Ingresa la marca de la laptop",
    path: ["laptopBrand"],
  }
);

// Legacy step2Schema kept for backward compatibility (deprecated)
export const step2Schema = z.object({
  profilePhotoUrl: z.string().min(1, "Sube tu foto para generar el avatar IA"),
  hasLaptop: z.boolean(),
  laptopBrand: z.string().optional(),
}).refine(
  (data) => {
    if (data.hasLaptop) {
      return !!data.laptopBrand;
    }
    return true;
  },
  {
    message: "Ingresa la marca de la laptop",
    path: ["laptopBrand"],
  }
);

// CONFIG step - no longer needed, commented out
// export const step3Schema = z.object({
//   experienceLevel: z.enum(["beginner", "intermediate", "advanced"]),
//   gender: z.enum(["male", "female", "other", "prefer-not-to-say"]).optional(),
//   additionalNotes: z.string().optional(),
//   techStack: z.array(z.string()).optional(),
// });

// Simplified Step 4 - single accept all checkbox
export const step4Schema = z.object({
  allTermsAccepted: z.boolean().refine((val) => val === true, {
    message: "Debes aceptar todos los términos para continuar",
  }),
});

export type Step1Data = z.infer<typeof step1Schema>;
export type Step2Data = z.infer<typeof step2Schema>;
// export type Step3Data = z.infer<typeof step3Schema>;
export type Step4Data = z.infer<typeof step4Schema>;
