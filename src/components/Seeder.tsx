import { useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function Seeder() {
  const seedMedications = useMutation(api.medications.seed);
  const seedAcute = useMutation(api.acuteConditions.seed);

  useEffect(() => {
    // Auto-seed on mount (idempotent on backend)
    seedMedications();
    seedAcute();
  }, [seedMedications, seedAcute]);

  return null;
}
