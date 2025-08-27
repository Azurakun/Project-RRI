import { createClient } from '@supabase/supabase-js';

// ========================================
// COMPREHENSIVE DATABASE CONNECTIVITY DIAGNOSTICS
// ========================================

// Environment variables validation with detailed diagnostics
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Connection diagnostics utility
export class DatabaseDiagnostics {
  static async runFullDiagnostics() {
    console.group('🔍 COMPREHENSIVE DATABASE DIAGNOSTICS');
    
    const results = {
      environment: this.checkEnvironment(),
      connectivity: await this.testConnectivity(),
      authentication: await this.testAuthentication(),
      permissions: await this.testPermissions(),
      performance: await this.testPerformance(),
      schema: await this.validateSchema()
    };
    
    console.log('📊 DIAGNOSTIC RESULTS:', results);
    console.groupEnd();
    
    return results;
  }
  
  static checkEnvironment() {
    console.log('🔧 STEP 1: Environment Validation');
    
    const checks = {
      urlPresent: !!supabaseUrl,
      keyPresent: !!supabaseAnonKey,
      urlFormat: supabaseUrl?.includes('supabase.co') || false,
      keyLength: supabaseAnonKey?.length || 0,
      urlProtocol: supabaseUrl?.startsWith('https://') || false,
      mode: import.meta.env.MODE
    };
    
    console.table(checks);
    
    // Validation errors
    const errors = [];
    if (!checks.urlPresent) errors.push('VITE_SUPABASE_URL missing');
    if (!checks.keyPresent) errors.push('VITE_SUPABASE_ANON_KEY missing');
    if (!checks.urlFormat) errors.push('Invalid URL format');
    if (!checks.urlProtocol) errors.push('URL must use HTTPS');
    if (checks.keyLength < 100) errors.push('Key appears too short');
    
    if (errors.length > 0) {
      console.error('❌ Environment Issues:', errors);
      return { status: 'FAILED', errors, checks };
    }
    
    console.log('✅ Environment validation passed');
    return { status: 'PASSED', checks };
  }
  
  static async testConnectivity() {
    console.log('🌐 STEP 2: Network Connectivity Test');
    
    try {
      const startTime = Date.now();
      
      // Test basic HTTP connectivity
      const response = await fetch(`${supabaseUrl}/rest/v1/`, {
        method: 'HEAD',
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`
        }
      });
      
      const responseTime = Date.now() - startTime;
      
      const result = {
        status: response.ok ? 'CONNECTED' : 'FAILED',
        statusCode: response.status,
        responseTime: `${responseTime}ms`,
        headers: Object.fromEntries(response.headers.entries())
      };
      
      console.log('📡 Connectivity Result:', result);
      return result;
      
    } catch (error) {
      console.error('❌ Connectivity Failed:', error);
      return {
        status: 'FAILED',
        error: error.message,
        type: error.name
      };
    }
  }
  
  static async testAuthentication() {
    console.log('🔐 STEP 3: Authentication Test');
    
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.warn('⚠️ Auth Session Error:', error.message);
        return { status: 'NO_SESSION', error: error.message };
      }
      
      const result = {
        status: data.session ? 'AUTHENTICATED' : 'ANONYMOUS',
        user: data.session?.user?.id || null,
        expires: data.session?.expires_at || null
      };
      
      console.log('🔑 Auth Result:', result);
      return result;
      
    } catch (error) {
      console.error('❌ Auth Test Failed:', error);
      return { status: 'FAILED', error: error.message };
    }
  }
  
  static async testPermissions() {
    console.log('🛡️ STEP 4: Database Permissions Test');
    
    const tables = ['programs', 'schedules', 'events', 'organization_members'];
    const permissions = {};
    
    for (const table of tables) {
      try {
        // Test SELECT permission
        const { data: selectData, error: selectError } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        // Test INSERT permission (dry run)
        const { error: insertError } = await supabase
          .from(table)
          .insert([{}])
          .select()
          .limit(0); // This won't actually insert
        
        permissions[table] = {
          select: !selectError,
          insert: !insertError || insertError.message.includes('null value'),
          selectError: selectError?.message,
          insertError: insertError?.message
        };
        
      } catch (error) {
        permissions[table] = {
          select: false,
          insert: false,
          error: error.message
        };
      }
    }
    
    console.table(permissions);
    return permissions;
  }
  
  static async testPerformance() {
    console.log('⚡ STEP 5: Performance Test');
    
    const tests = [];
    
    // Test 1: Simple query
    const start1 = Date.now();
    try {
      await supabase.from('programs').select('count', { count: 'exact', head: true });
      tests.push({ test: 'count_query', time: Date.now() - start1, status: 'SUCCESS' });
    } catch (error) {
      tests.push({ test: 'count_query', time: Date.now() - start1, status: 'FAILED', error: error.message });
    }
    
    // Test 2: Data query
    const start2 = Date.now();
    try {
      await supabase.from('programs').select('*').limit(5);
      tests.push({ test: 'data_query', time: Date.now() - start2, status: 'SUCCESS' });
    } catch (error) {
      tests.push({ test: 'data_query', time: Date.now() - start2, status: 'FAILED', error: error.message });
    }
    
    console.table(tests);
    return tests;
  }
  
  static async validateSchema() {
    console.log('📋 STEP 6: Schema Validation');
    
    const expectedTables = {
      programs: ['id', 'name', 'frequency', 'color'],
      schedules: ['id', 'program_id', 'waktu', 'program_name', 'image_url'],
      events: ['id', 'title', 'description', 'event_date', 'image_url'],
      organization_members: ['id', 'name', 'position', 'photo_url']
    };
    
    const schemaResults = {};
    
    for (const [table, expectedColumns] of Object.entries(expectedTables)) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        if (error) {
          schemaResults[table] = { status: 'FAILED', error: error.message };
          continue;
        }
        
        const actualColumns = data && data.length > 0 ? Object.keys(data[0]) : [];
        const missingColumns = expectedColumns.filter(col => !actualColumns.includes(col));
        
        schemaResults[table] = {
          status: missingColumns.length === 0 ? 'VALID' : 'INCOMPLETE',
          expectedColumns,
          actualColumns,
          missingColumns
        };
        
      } catch (error) {
        schemaResults[table] = { status: 'ERROR', error: error.message };
      }
    }
    
    console.table(schemaResults);
    return schemaResults;
  }
}

// Enhanced error handling with retry mechanism
export class DatabaseErrorHandler {
  static async withRetry(operation, maxRetries = 3, delay = 1000) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🔄 Attempt ${attempt}/${maxRetries}`);
        const result = await operation();
        console.log(`✅ Operation succeeded on attempt ${attempt}`);
        return result;
      } catch (error) {
        console.warn(`❌ Attempt ${attempt} failed:`, error.message);
        
        if (attempt === maxRetries) {
          console.error(`💥 All ${maxRetries} attempts failed`);
          throw this.enhanceError(error);
        }
        
        // Exponential backoff
        const waitTime = delay * Math.pow(2, attempt - 1);
        console.log(`⏳ Waiting ${waitTime}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }
  
  static enhanceError(error) {
    const errorMap = {
      'JWT expired': {
        message: 'Session expired. Please refresh the page.',
        action: 'REFRESH_SESSION',
        severity: 'HIGH'
      },
      'permission denied': {
        message: 'Database access denied. Check RLS policies.',
        action: 'CHECK_PERMISSIONS',
        severity: 'HIGH'
      },
      'relation does not exist': {
        message: 'Database table not found. Check schema.',
        action: 'VERIFY_SCHEMA',
        severity: 'CRITICAL'
      },
      'connection refused': {
        message: 'Cannot connect to database server.',
        action: 'CHECK_CONNECTIVITY',
        severity: 'CRITICAL'
      },
      'timeout': {
        message: 'Database operation timed out.',
        action: 'RETRY_OPERATION',
        severity: 'MEDIUM'
      },
      'network error': {
        message: 'Network connectivity issue.',
        action: 'CHECK_NETWORK',
        severity: 'HIGH'
      }
    };
    
    const errorKey = Object.keys(errorMap).find(key => 
      error.message.toLowerCase().includes(key.toLowerCase())
    );
    
    if (errorKey) {
      const enhancement = errorMap[errorKey];
      error.enhancement = enhancement;
      error.troubleshooting = this.getTroubleshootingSteps(enhancement.action);
    }
    
    return error;
  }
  
  static getTroubleshootingSteps(action) {
    const steps = {
      REFRESH_SESSION: [
        'Refresh the browser page',
        'Clear browser cache and cookies',
        'Re-authenticate if needed'
      ],
      CHECK_PERMISSIONS: [
        'Verify RLS policies in Supabase dashboard',
        'Check user authentication status',
        'Validate API key permissions'
      ],
      VERIFY_SCHEMA: [
        'Check if tables exist in Supabase dashboard',
        'Verify table names and column names',
        'Run database migrations if needed'
      ],
      CHECK_CONNECTIVITY: [
        'Verify internet connection',
        'Check Supabase service status',
        'Validate environment variables'
      ],
      RETRY_OPERATION: [
        'Wait a moment and try again',
        'Check for high server load',
        'Consider breaking operation into smaller parts'
      ],
      CHECK_NETWORK: [
        'Test internet connectivity',
        'Check firewall settings',
        'Verify DNS resolution'
      ]
    };
    
    return steps[action] || ['Contact support for assistance'];
  }
}

// Validation with comprehensive error checking
if (!supabaseUrl) {
  const error = new Error('VITE_SUPABASE_URL environment variable is missing');
  error.troubleshooting = [
    'Check your .env file exists in project root',
    'Verify VITE_SUPABASE_URL is set correctly',
    'Restart the development server after adding env vars'
  ];
  throw error;
}

if (!supabaseAnonKey) {
  const error = new Error('VITE_SUPABASE_ANON_KEY environment variable is missing');
  error.troubleshooting = [
    'Check your .env file exists in project root',
    'Verify VITE_SUPABASE_ANON_KEY is set correctly',
    'Get the key from Supabase dashboard → Settings → API'
  ];
  throw error;
}

// Enhanced Supabase client with comprehensive configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'X-Client-Info': 'rri-jambi-admin',
      'X-Client-Version': '1.0.0'
    }
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Connection health monitoring with automatic recovery
export class ConnectionMonitor {
  private static instance: ConnectionMonitor;
  private healthStatus: 'healthy' | 'degraded' | 'failed' = 'healthy';
  private lastCheck: Date = new Date();
  private checkInterval: NodeJS.Timeout | null = null;
  
  static getInstance(): ConnectionMonitor {
    if (!ConnectionMonitor.instance) {
      ConnectionMonitor.instance = new ConnectionMonitor();
    }
    return ConnectionMonitor.instance;
  }
  
  startMonitoring(intervalMs: number = 30000) {
    console.log('🔍 Starting connection monitoring...');
    
    this.checkInterval = setInterval(async () => {
      await this.performHealthCheck();
    }, intervalMs);
    
    // Initial check
    this.performHealthCheck();
  }
  
  stopMonitoring() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }
  
  private async performHealthCheck() {
    try {
      const startTime = Date.now();
      
      const { data, error } = await supabase
        .from('programs')
        .select('count', { count: 'exact', head: true });
      
      const responseTime = Date.now() - startTime;
      
      if (error) {
        this.handleHealthCheckFailure(error);
        return;
      }
      
      // Update health status based on response time
      if (responseTime > 5000) {
        this.updateHealthStatus('degraded', `Slow response: ${responseTime}ms`);
      } else {
        this.updateHealthStatus('healthy', `Response time: ${responseTime}ms`);
      }
      
      this.lastCheck = new Date();
      
    } catch (error) {
      this.handleHealthCheckFailure(error);
    }
  }
  
  private handleHealthCheckFailure(error: any) {
    console.error('🔴 Health check failed:', error.message);
    this.updateHealthStatus('failed', error.message);
    
    // Attempt automatic recovery
    this.attemptRecovery();
  }
  
  private updateHealthStatus(status: 'healthy' | 'degraded' | 'failed', message: string) {
    if (this.healthStatus !== status) {
      const statusEmoji = {
        healthy: '🟢',
        degraded: '🟡',
        failed: '🔴'
      };
      
      console.log(`${statusEmoji[status]} Connection status: ${status.toUpperCase()} - ${message}`);
      this.healthStatus = status;
      
      // Emit custom event for UI updates
      window.dispatchEvent(new CustomEvent('database-health-change', {
        detail: { status, message, timestamp: new Date() }
      }));
    }
  }
  
  private async attemptRecovery() {
    console.log('🔧 Attempting connection recovery...');
    
    try {
      // Try to refresh the session
      const { error } = await supabase.auth.refreshSession();
      
      if (!error) {
        console.log('✅ Session refreshed successfully');
        // Retry health check
        setTimeout(() => this.performHealthCheck(), 1000);
      }
      
    } catch (error) {
      console.error('❌ Recovery attempt failed:', error);
    }
  }
  
  getHealthStatus() {
    return {
      status: this.healthStatus,
      lastCheck: this.lastCheck,
      uptime: Date.now() - this.lastCheck.getTime()
    };
  }
}

// Enhanced database operations with comprehensive error handling
export const dbOperations = {
  async select(table: string, query = '*', filters = {}) {
    return DatabaseErrorHandler.withRetry(async () => {
      console.log(`📖 SELECT from ${table}:`, { query, filters });
      
      let queryBuilder = supabase.from(table).select(query);
      
      Object.entries(filters).forEach(([key, value]) => {
        queryBuilder = queryBuilder.eq(key, value);
      });
      
      const { data, error } = await queryBuilder;
      
      if (error) {
        console.error(`❌ SELECT failed for ${table}:`, error);
        throw error;
      }
      
      console.log(`✅ SELECT successful for ${table}:`, data?.length, 'records');
      return data;
    });
  },
  
  async insert(table: string, data: any) {
    return DatabaseErrorHandler.withRetry(async () => {
      console.log(`📝 INSERT into ${table}:`, data);
      
      const { data: result, error } = await supabase
        .from(table)
        .insert(data)
        .select();
      
      if (error) {
        console.error(`❌ INSERT failed for ${table}:`, error);
        throw error;
      }
      
      console.log(`✅ INSERT successful for ${table}:`, result);
      return result;
    });
  },
  
  async update(table: string, id: string, data: any) {
    return DatabaseErrorHandler.withRetry(async () => {
      console.log(`✏️ UPDATE ${table} [${id}]:`, data);
      
      const { data: result, error } = await supabase
        .from(table)
        .update(data)
        .eq('id', id)
        .select();
      
      if (error) {
        console.error(`❌ UPDATE failed for ${table}:`, error);
        throw error;
      }
      
      console.log(`✅ UPDATE successful for ${table}:`, result);
      return result;
    });
  },
  
  async delete(table: string, id: string, soft = true) {
    return DatabaseErrorHandler.withRetry(async () => {
      console.log(`🗑️ DELETE from ${table} [${id}] (soft: ${soft})`);
      
      let query;
      
      if (soft) {
        query = supabase
          .from(table)
          .update({ is_active: false, updated_at: new Date().toISOString() })
          .eq('id', id);
      } else {
        query = supabase
          .from(table)
          .delete()
          .eq('id', id);
      }
      
      const { error } = await query;
      
      if (error) {
        console.error(`❌ DELETE failed for ${table}:`, error);
        throw error;
      }
      
      console.log(`✅ DELETE successful for ${table}`);
      return true;
    });
  }
};

// Auto-initialization and diagnostics
const initializeDatabase = async () => {
  console.log('🚀 Initializing database connection...');
  
  try {
    // Run comprehensive diagnostics
    const diagnostics = await DatabaseDiagnostics.runFullDiagnostics();
    
    // Start connection monitoring
    const monitor = ConnectionMonitor.getInstance();
    monitor.startMonitoring();
    
    // Make diagnostics available globally for debugging
    (window as any).dbDiagnostics = DatabaseDiagnostics;
    (window as any).dbMonitor = monitor;
    (window as any).supabase = supabase;
    
    console.log('✅ Database initialization complete');
    console.log('💡 Available debugging tools:');
    console.log('  - dbDiagnostics.runFullDiagnostics()');
    console.log('  - dbMonitor.getHealthStatus()');
    console.log('  - supabase (client instance)');
    
    return diagnostics;
    
  } catch (error) {
    console.error('💥 Database initialization failed:', error);
    throw error;
  }
};

// Initialize on module load
initializeDatabase().catch(error => {
  console.error('🚨 Critical database initialization error:', error);
});

// Types
export interface Program {
  id: string;
  name: string;
  frequency: string;
  color: string;
  created_at: string;
}

export interface Schedule {
  id: string;
  program_id: string;
  waktu: string;
  program_name: string;
  deskripsi: string;
  penyiar: string;
  kategori: string;
  durasi: string;
  image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface OrganizationMember {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  photo_url: string;
  bio: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  event_time: string;
  location: string;
  image_url: string;
  category: string;
  status: string;
  max_participants: number;
  contact_info: string;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default supabase;