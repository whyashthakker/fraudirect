import { ReportForm } from "./_components/report-form";
import { ReportList } from "./_components/report-list";

export default function HomePage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Fraud Report Directory</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Submit a Report</h2>
          <ReportForm />
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-4">Recent Reports</h2>
          <ReportList />
        </div>
      </div>
    </div>
  )
}