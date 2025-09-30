// This hook is now deprecated - use the AnonymousUserProvider context instead
// Keeping for backward compatibility during migration
import { useAnonymousUser as useAnonymousUserContext } from "@/contexts/anonymous-user-context";

export const useAnonymousUser = useAnonymousUserContext;
