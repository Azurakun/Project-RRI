import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  AlertTriangleIcon, 
  RefreshCwIcon,
  DatabaseIcon,
  WifiIcon,
  ShieldIcon
} from 'lucide-react';

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'failed';
  lastCheck: Date;
  uptime: number;
}

interface DiagnosticResult {
  environment: any;
  connectivity: any;
  authentication: any;
  permissions: any;
  performance: any;
  schema: any;
}

export const DatabaseStatus = (): JSX.Element => {
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [diagnostics, setDiagnostics] = useState<DiagnosticResult | null>(null);
  const [isRunningDiagnostics, setIsRunningDiagnostics] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Listen for health status changes
    const handleHealthChange = (event: CustomEvent) => {
      setHealthStatus({
        status: event.detail.status,
        lastCheck: event.detail.timestamp,
        uptime: Date.now() - event.detail.timestamp.getTime()
      });
    };

    window.addEventListener('database-health-change', handleHealthChange as EventListener);

    // Get initial status if monitor is available
    const monitor = (window as any).dbMonitor;
    if (monitor) {
      setHealthStatus(monitor.getHealthStatus());
    }

    return () => {
      window.removeEventListener('database-health-change', handleHealthChange as EventListener);
    };
  }, []);

  const runDiagnostics = async () => {
    setIsRunningDiagnostics(true);
    try {
      const dbDiagnostics = (window as any).dbDiagnostics;
      if (dbDiagnostics) {
        const results = await dbDiagnostics.runFullDiagnostics();
        setDiagnostics(results);
      }
    } catch (error) {
      console.error('Failed to run diagnostics:', error);
    } finally {
      setIsRunningDiagnostics(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'PASSED':
      case 'CONNECTED':
      case 'SUCCESS':
      case 'VALID':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'degraded':
      case 'INCOMPLETE':
      case 'NO_SESSION':
        return <AlertTriangleIcon className="w-5 h-5 text-yellow-500" />;
      case 'failed':
      case 'FAILED':
      case 'ERROR':
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
      default:
        return <DatabaseIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'PASSED':
      case 'CONNECTED':
      case 'SUCCESS':
      case 'VALID':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'degraded':
      case 'INCOMPLETE':
      case 'NO_SESSION':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'failed':
      case 'FAILED':
      case 'ERROR':
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
          <div className="flex items-center gap-2">
            <button
              onClick={runDiagnostics}
              disabled={isRunningDiagnostics}
              className="flex items-center gap-2 px-3 py-2 bg-[#0f4c81] text-white rounded-md hover:bg-[#0375e5] transition-colors disabled:opacity-50"
            >
              <RefreshCwIcon className={`w-4 h-4 ${isRunningDiagnostics ? 'animate-spin' : ''}`} />
              {isRunningDiagnostics ? 'Running...' : 'Run Diagnostics'}
            </button>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              {showDetails ? 'Hide Details' : 'Show Details'}
            </button>
          </div>
        </div>

        {/* Health Status */}
        {healthStatus && (
          <div className={`p-4 rounded-lg border mb-4 ${getStatusColor(healthStatus.status)}`}>
            <div className="flex items-center gap-3">
              {getStatusIcon(healthStatus.status)}
              <div>
                <div className="font-medium">
                  Connection Status: {healthStatus.status.toUpperCase()}
                </div>
                <div className="text-sm opacity-75">
                  Last checked: {healthStatus.lastCheck.toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Diagnostic Results */}
        {showDetails && diagnostics && (
          <div className="space-y-4">
            {/* Environment Check */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <WifiIcon className="w-5 h-5" />
                <h4 className="font-medium">Environment Configuration</h4>
                {getStatusIcon(diagnostics.environment.status)}
              </div>
              {diagnostics.environment.errors && diagnostics.environment.errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded p-3 mb-3">
                  <div className="text-sm text-red-700">
                    <strong>Issues found:</strong>
                    <ul className="list-disc list-inside mt-1">
                      {diagnostics.environment.errors.map((error: string, index: number) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>URL Present: {diagnostics.environment.checks.urlPresent ? '✅' : '❌'}</div>
                <div>Key Present: {diagnostics.environment.checks.keyPresent ? '✅' : '❌'}</div>
                <div>URL Format: {diagnostics.environment.checks.urlFormat ? '✅' : '❌'}</div>
                <div>HTTPS Protocol: {diagnostics.environment.checks.urlProtocol ? '✅' : '❌'}</div>
              </div>
            </div>

            {/* Connectivity Check */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <WifiIcon className="w-5 h-5" />
                <h4 className="font-medium">Network Connectivity</h4>
                {getStatusIcon(diagnostics.connectivity.status)}
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>Status: {diagnostics.connectivity.status}</div>
                <div>Response Time: {diagnostics.connectivity.responseTime || 'N/A'}</div>
                <div>Status Code: {diagnostics.connectivity.statusCode || 'N/A'}</div>
              </div>
            </div>

            {/* Authentication Check */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <ShieldIcon className="w-5 h-5" />
                <h4 className="font-medium">Authentication</h4>
                {getStatusIcon(diagnostics.authentication.status)}
              </div>
              <div className="text-sm">
                Status: {diagnostics.authentication.status}
                {diagnostics.authentication.user && (
                  <div>User ID: {diagnostics.authentication.user}</div>
                )}
              </div>
            </div>

            {/* Permissions Check */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <DatabaseIcon className="w-5 h-5" />
                <h4 className="font-medium">Table Permissions</h4>
              </div>
              <div className="grid grid-cols-1 gap-2 text-sm">
                {Object.entries(diagnostics.permissions).map(([table, perms]: [string, any]) => (
                  <div key={table} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="font-medium">{table}</span>
                    <div className="flex gap-2">
                      <span className={`px-2 py-1 rounded text-xs ${perms.select ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        SELECT: {perms.select ? '✅' : '❌'}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs ${perms.insert ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        INSERT: {perms.insert ? '✅' : '❌'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Check */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <RefreshCwIcon className="w-5 h-5" />
                <h4 className="font-medium">Performance Tests</h4>
              </div>
              <div className="space-y-2">
                {diagnostics.performance.map((test: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                    <span>{test.test.replace('_', ' ').toUpperCase()}</span>
                    <div className="flex items-center gap-2">
                      <span>{test.time}ms</span>
                      {getStatusIcon(test.status)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Schema Validation */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <DatabaseIcon className="w-5 h-5" />
                <h4 className="font-medium">Schema Validation</h4>
              </div>
              <div className="space-y-2">
                {Object.entries(diagnostics.schema).map(([table, schema]: [string, any]) => (
                  <div key={table} className="p-2 bg-gray-50 rounded">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{table}</span>
                      {getStatusIcon(schema.status)}
                    </div>
                    {schema.missingColumns && schema.missingColumns.length > 0 && (
                      <div className="text-xs text-red-600">
                        Missing columns: {schema.missingColumns.join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Quick Troubleshooting</h4>
          <div className="text-sm text-blue-700 space-y-1">
            <div>• Open browser console (F12) to see detailed logs</div>
            <div>• Run <code className="bg-blue-100 px-1 rounded">dbDiagnostics.runFullDiagnostics()</code> in console</div>
            <div>• Check <code className="bg-blue-100 px-1 rounded">dbMonitor.getHealthStatus()</code> for real-time status</div>
            <div>• Verify environment variables in .env file</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};