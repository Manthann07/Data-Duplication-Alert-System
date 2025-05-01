import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ArrowRight, Database, Shield, BarChart2, CheckCircle } from 'lucide-react';

const GetStarted = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-1/4 -left-1/4 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-30 animate-pulse delay-1000"></div>
      </div>

      {/* Content */}
      <div className="relative">
        {/* Header */}
        <header className="border-b border-gray-100 bg-white/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4">
            <nav className="flex justify-between items-center h-16">
              <div className="flex items-center gap-2">
                <Database className="w-8 h-8 text-blue-600" />
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                  DDAS
                </span>
              </div>
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/signin')}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Sign In
                </Button>
                <Button 
                  onClick={() => navigate('/signin')}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Sign Up
                </Button>
              </div>
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <section className="pt-20 pb-32">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-6xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text leading-tight">
                Eliminate Data Duplicates with Intelligence
              </h1>
              <p className="text-xl text-gray-600 mb-12 leading-relaxed">
                Our advanced Data Duplication Alert System helps you maintain data integrity 
                by automatically detecting and managing duplicate entries in real-time.
              </p>
              <div className="flex justify-center gap-4">
                <Button 
                  size="lg"
                  onClick={() => navigate('/signin')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
                >
                  Get Started Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/performance')}
                  className="px-8 py-6 text-lg rounded-full"
                >
                  View Performance Demo
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-16">Why Choose Our Solution?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="group p-8 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-16">Key Benefits</h2>
              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
                  >
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-2">{benefit.title}</h3>
                      <p className="text-gray-600">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-100 py-8">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center">
              <p className="text-gray-600">© 2024 DDAS. All rights reserved.</p>
              <Button 
                onClick={() => navigate('/signin')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Start Free Trial
              </Button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

const features = [
  {
    icon: <Shield className="w-7 h-7 text-blue-600" />,
    title: "Smart Detection",
    description: "Advanced algorithms automatically identify potential duplicates with high accuracy using machine learning."
  },
  {
    icon: <Database className="w-7 h-7 text-blue-600" />,
    title: "Real-time Monitoring",
    description: "Continuous monitoring of your data ensures immediate detection and notification of duplicate entries."
  },
  {
    icon: <BarChart2 className="w-7 h-7 text-blue-600" />,
    title: "Detailed Analytics",
    description: "Comprehensive reports and insights help you understand and improve your data quality."
  }
];

const benefits = [
  {
    title: "Save Time and Resources",
    description: "Automated duplicate detection saves hours of manual review and cleaning time."
  },
  {
    title: "Improve Data Quality",
    description: "Maintain clean, accurate datasets by preventing duplicate entries before they become problems."
  },
  {
    title: "Reduce Errors",
    description: "Minimize the risk of errors and inconsistencies in your data management process."
  },
  {
    title: "Easy Integration",
    description: "Seamlessly integrates with your existing systems and workflows."
  }
];

export default GetStarted; 