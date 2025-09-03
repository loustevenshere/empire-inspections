export default function PayPage() {
  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Pay Empire Electrical Solutions
          </h1>
          <p className="text-lg text-slate-600">
            Choose your preferred payment method below.
          </p>
        </div>

        {/* Payment Method Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Venmo Card */}
          <div className="bg-blue-100 rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Venmo</h3>
            <p className="text-slate-600">Coming soon</p>
          </div>

          {/* Cash App Card */}
          <div className="bg-green-100 rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Cash App</h3>
            <p className="text-slate-600">Coming soon</p>
          </div>

          {/* Zelle Card */}
          <div className="bg-purple-100 rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Zelle</h3>
            <p className="text-slate-600">Coming soon</p>
          </div>
        </div>
      </div>
    </main>
  );
}