import React from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/config/routes';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col items-center text-center space-y-8">
          {/* Logo/Brand */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Quizzard
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl">
              Master Your Knowledge with AI-Powered Quizzes
            </p>
          </div>

          {/* Main Description */}
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl">
            Transform your learning experience with intelligent quizzes, personalized study plans, 
            and comprehensive progress tracking. Join thousands of students achieving their goals.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button
              size="lg"
              onClick={() => navigate(ROUTES.AUTH)}
              className="text-lg px-8 py-6 h-auto"
            >
              Get Started - Login
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate(ROUTES.AUTH)}
              className="text-lg px-8 py-6 h-auto"
            >
              Sign Up Free
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-16 w-full max-w-5xl">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Smart Quizzes
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                AI-powered quiz generation tailored to your learning needs and progress
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Track Progress
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Monitor your improvement with detailed analytics and performance insights
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Achieve Goals
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Personalized study plans designed to help you reach your learning objectives
              </p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-3 gap-8 mt-16 w-full max-w-3xl">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">10k+</div>
              <div className="text-gray-600 dark:text-gray-400 mt-2">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 dark:text-purple-400">50k+</div>
              <div className="text-gray-600 dark:text-gray-400 mt-2">Quizzes Created</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 dark:text-green-400">95%</div>
              <div className="text-gray-600 dark:text-gray-400 mt-2">Success Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-gray-600 dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} Quizzard. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
