import { Sparkles, TrendingUp } from "lucide-react"

const Header = () => {
  return (
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-2xl shadow-lg">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-2 text-white">
                CryptoLive
                <Sparkles className="w-6 h-6 text-indigo-600" />
              </h1>
              <p className="text-gray-600 mt-1">Real-time cryptocurrency tracker</p>
            </div>
          </div>
        </header>
  )
}

export default Header
