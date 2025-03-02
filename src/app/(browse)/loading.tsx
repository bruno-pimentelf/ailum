export default function HomeLoading() {
  return (
    <div className="container mx-auto py-10">
      <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-6"></div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div 
            key={i}
            className="block p-6 bg-white rounded-lg border border-gray-200 shadow-md"
          >
            <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-4"></div>
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  )
} 