import React from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { ArrowRight, BarChart2, Shield, Sparkles } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-16 md:py-24 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 mb-6">
            Get your personalized investment plan in 30 seconds.
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-10">
            Smart, simple, and responsible investment planning for young
            professionals.
          </p>
          <Link to="/plan">
            <Button
              size="lg"
              className="text-lg px-8 py-6 rounded-lg bg-blue-600 hover:bg-blue-700"
            >
              Start Planning <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why SmartInvest Planner?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-xl shadow-sm flex flex-col items-center text-center">
              <div className="bg-blue-100 p-3 rounded-full mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                No Ads or Promotions
              </h3>
              <p className="text-gray-600">
                We don't sell financial products or promote specific
                investments. Our recommendations are unbiased.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-xl shadow-sm flex flex-col items-center text-center">
              <div className="bg-blue-100 p-3 rounded-full mb-4">
                <Sparkles className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Simple, Clean UI</h3>
              <p className="text-gray-600">
                No complicated jargon or confusing interfaces. Just
                straightforward investment planning.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-xl shadow-sm flex flex-col items-center text-center">
              <div className="bg-blue-100 p-3 rounded-full mb-4">
                <BarChart2 className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Smart Logic</h3>
              <p className="text-gray-600">
                Our algorithm ensures proper financial hygiene before
                recommending investment strategies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to start your investment journey?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Create your personalized investment plan in just a few clicks.
          </p>
          <Link to="/plan">
            <Button
              size="lg"
              className="text-lg px-8 py-6 rounded-lg bg-blue-600 hover:bg-blue-700"
            >
              Start Planning <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>
            © {new Date().getFullYear()} SmartInvest Planner. All rights
            reserved.
          </p>
          <p className="mt-2">
            This is a demo application. Not financial advice.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
