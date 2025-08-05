import { useMedications } from "@/hooks/useMedications";
import { MedicationCard } from "@/components/medications/MedicationCard";
import { QueryStatus } from "@/components/ui/query-status";
import { Medication } from "@/types";

export default function PatientDashboard() {
  const { data: medications, isLoading, isError } = useMedications();

  return (
    <div className="p-6 font-arabic min-h-screen bg-background/50">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-primary mb-2">لوحة التحكم</h1>
        <p className="text-muted-foreground mb-8">مرحباً بك! هنا يمكنك تتبع أدويتك واستشاراتك.</p>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">🧾 قائمة الأدوية الخاصة بك</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <QueryStatus
              isLoading={isLoading}
              isError={isError}
              data={medications}
              loadingMessage="جاري تحميل الأدوية..."
              errorMessage="حدث خطأ أثناء تحميل الأدوية."
              emptyMessage="لا توجد أدوية في قائمتك حالياً."
            />
            {medications?.map((med: Medication, index: number) => (<MedicationCard key={med.id} medication={med} index={index} />))}
          </div>
        </div>
      </div>
    </div>
  );
}