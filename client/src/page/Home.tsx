import { Shield, Globe, Lock, ArrowRight, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function WorkHistoryWelcome() {

  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100">
      {/* Header */}
      <header className="px-6 py-6">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              WorkHistoryLedger
            </span>
          </div>
          <div className="flex items-center space-x-6">
            <a href="#" className="text-gray-600 hover:text-orange-500 transition-colors">About</a>
            <a href="#" className="text-gray-600 hover:text-orange-500 transition-colors">Security</a>
            <button onClick={() => navigate('/employee')} className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors cursor-pointer">
              Get Started
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-12 pb-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Secure Your
            <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent"> Work History</span>
            <br />On The Blockchain
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            WorkHistoryLedger provides zero-knowledge, verifiable work history tracking through trusted global companies. 
            Secure, private, and permanently accessible employment records powered by distributed blockchain technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-xl text-lg font-semibold flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all">
              <span>Start Building Your Ledger</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="border-2 border-gray-300 hover:border-orange-500 text-gray-700 hover:text-orange-500 px-8 py-4 rounded-xl text-lg font-semibold transition-colors">
              View Demo
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 bg-gradient-to-r from-orange-100 to-orange-200 rounded-xl flex items-center justify-center mb-6">
              <Shield className="w-7 h-7 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Zero-Knowledge Privacy</h3>
            <p className="text-gray-600 leading-relaxed">
              Your employment data is cryptographically secured with zero-knowledge proofs. Verify your history without exposing sensitive information.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 bg-gradient-to-r from-orange-100 to-orange-200 rounded-xl flex items-center justify-center mb-6">
              <Globe className="w-7 h-7 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Global Distribution</h3>
            <p className="text-gray-600 leading-relaxed">
              Powered by a network of trusted companies worldwide. Your work history is validated and stored across multiple nodes for maximum reliability.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 bg-gradient-to-r from-orange-100 to-orange-200 rounded-xl flex items-center justify-center mb-6">
              <Lock className="w-7 h-7 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Immutable Records</h3>
            <p className="text-gray-600 leading-relaxed">
              Once verified, your work history becomes part of an immutable blockchain ledger. Tamper-proof and permanently accessible.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-12 text-center mb-16">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl font-bold text-orange-400 mb-2">10,000+</div>
              <div className="text-gray-300">Verified Employees</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-400 mb-2">500+</div>
              <div className="text-gray-300">Partner Companies</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-400 mb-2">50+</div>
              <div className="text-gray-300">Countries</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-400 mb-2">99.9%</div>
              <div className="text-gray-300">Uptime</div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-xl text-gray-600 mb-12">Simple, secure, and transparent</p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Connect & Verify</h3>
              <p className="text-gray-600">
                Connect your employment accounts through our secure API. We verify your work history with partner companies.
              </p>
            </div>

            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Generate Hashes</h3>
              <p className="text-gray-600">
                Your employment data is converted into cryptographic hashes that prove authenticity without revealing details.
              </p>
            </div>

            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Share Securely</h3>
              <p className="text-gray-600">
                Share verifiable proofs of your work history with potential employers while maintaining complete privacy control.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-3xl p-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Secure Your Professional Journey?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who trust WorkHistoryLedger to manage and verify their employment history on the blockchain.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-xl text-lg font-semibold flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all">
              <Zap className="w-5 h-5" />
              <span>Get Started Now</span>
            </button>
            <button className="text-orange-600 hover:text-orange-700 px-8 py-4 rounded-xl text-lg font-semibold transition-colors">
              Learn More →
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-800">WorkHistoryLedger</span>
            </div>
            <div className="text-gray-600">
              © 2025 WorkHistoryLedger. Securing professional futures.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}