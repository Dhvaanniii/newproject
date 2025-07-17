import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import { Brain, Triangle, Play, Award, Clock } from 'lucide-react';
import axios from 'axios';

const HomePage: React.FC = () => {
  const { user } = useAuth();

  // 🔽 Report generation state
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [emailReport, setEmailReport] = useState(false);
  const [downloadLink, setDownloadLink] = useState('');

  const handleDownloadReport = async () => {
    if (!fromDate || !toDate) {
      alert('Please select both start and end dates');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/report/generate', {
        username: user.username,
        start_date: fromDate,
        end_date: toDate,
        send_email: emailReport,
      });

      setDownloadLink(response.data.path);
      alert('Report generated successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to generate report.');
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome back, {user.realname}!
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Ready to challenge your mind with exciting puzzles?
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Funthinkers Category */}
          <Link to="/funthinkers" className="group">
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden transform group-hover:scale-105">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                      <Brain className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Funthinkers</h2>
                      <p className="text-blue-100">Brain Training Puzzles</p>
                    </div>
                  </div>
                  <Play className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-green-600 font-bold">B</span>
                    </div>
                    <p className="text-sm text-gray-600">Basic</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-yellow-600 font-bold">M</span>
                    </div>
                    <p className="text-sm text-gray-600">Medium</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-red-600 font-bold">H</span>
                    </div>
                    <p className="text-sm text-gray-600">Hard</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Award className="w-4 h-4" />
                    <span>Earn up to 3 stars</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>Progressive difficulty</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Tangles Category */}
          <Link to="/tangles" className="group">
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden transform group-hover:scale-105">
              <div className="bg-gradient-to-r from-orange-500 to-red-600 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                      <Triangle className="w-8 h-8 text-orange-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Tangles</h2>
                      <p className="text-orange-100">Geometric Puzzles</p>
                    </div>
                  </div>
                  <Play className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
                </div>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className="text-sm text-gray-500">1 / 200 levels</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-orange-500 to-red-600 h-2 rounded-full" style={{ width: '0.5%' }}></div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Award className="w-4 h-4" />
                    <span>200 challenging levels</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>Timed challenges</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Your Progress</h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Award className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-800">0</div>
              <div className="text-sm text-gray-600">Total Stars</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Play className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-800">0</div>
              <div className="text-sm text-gray-600">Levels Completed</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Brain className="w-8 h-8 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-800">0</div>
              <div className="text-sm text-gray-600">Funthinkers Done</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Triangle className="w-8 h-8 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-gray-800">0</div>
              <div className="text-sm text-gray-600">Tangles Solved</div>
            </div>
          </div>
        </div>

        {/* 🔽 Report Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">📄 Generate Your Report</h3>

          <div className="grid md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">From</label>
              <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="w-full border px-3 py-2 rounded-md" />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">To</label>
              <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="w-full border px-3 py-2 rounded-md" />
            </div>

            <div className="flex items-center mt-6">
              <input type="checkbox" checked={emailReport} onChange={(e) => setEmailReport(e.target.checked)} className="mr-2" />
              <label className="text-sm text-gray-600">Email me the report</label>
            </div>

            <button
              onClick={handleDownloadReport}
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Generate Report
            </button>
          </div>

          {downloadLink && (
            <div className="mt-4 text-center">
              <a
                href={`http://localhost:8000/${downloadLink}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                ⬇️ Click here to download your report
              </a>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default HomePage;
