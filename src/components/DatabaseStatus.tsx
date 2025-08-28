import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { CheckCircleIcon, XCircleIcon, AlertTriangleIcon, RefreshCwIcon, DatabaseIcon } from 'lucide-react';

const API_BASE_URL = 'http://localhost:3001/api';

export const DatabaseStatus = (): JSX.Element => {
  const [status, setStatus] = useState<'healthy' | 'degraded' | 'failed'>('degraded');
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  const [isRunningDiagnostics, setIsRunningDiagnostics] = useState(false);

  const checkStatus = async () => {
    setIsRunningDiagnostics(true);
    try {
      const response = await fetch(`${API_BASE_URL}/status`);
      const data = await response.json();
      setStatus(data.status);
    } catch (error) {
      setStatus('failed');
    } finally {
      setLastCheck(new Date());
      setIsRunningDiagnostics(false);
    }
  };

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = () => {
    switch (status) {
      case 'healthy':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'degraded':
        return <AlertTriangleIcon className="w-5 h-5 text-yellow-500" />;
      case 'failed':
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
      default:
        return <DatabaseIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'degraded':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'failed':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <DatabaseIcon className="w-6 h-6 text-[#0f4c81]" />
            <h3 className="text-lg font-semibold text-gray-900">Database Status</h3>
          </div>
          <button
            onClick={checkStatus}
            disabled={isRunningDiagnostics}
            className="flex items-center gap-2 px-3 py-2 bg-[#0f4c81] text-white rounded-md hover:bg-[#0375e5] transition-colors disabled:opacity-50"
          >
            <RefreshCwIcon className={`w-4 h-4 ${isRunningDiagnostics ? 'animate-spin' : ''}`} />
            {isRunningDiagnostics ? 'Checking...' : 'Refresh'}
          </button>
        </div>

        <div className={`p-4 rounded-lg border mb-4 ${getStatusColor()}`}>
          <div className="flex items-center gap-3">
            {getStatusIcon()}
            <div>
              <div className="font-medium">
                Connection Status: {status.toUpperCase()}
              </div>
              {lastCheck && (
                <div className="text-sm opacity-75">
                  Last checked: {lastCheck.toLocaleTimeString()}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};