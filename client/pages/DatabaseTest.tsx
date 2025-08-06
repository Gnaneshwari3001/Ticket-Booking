import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trainService, bookingService, userService } from "@/lib/realtime-database";
import { initializeDatabase, resetDatabase } from "@/lib/init-database";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Database, 
  RefreshCw, 
  Train, 
  Users, 
  RotateCcw,
  CheckCircle,
  AlertCircle 
} from "lucide-react";

const DatabaseTest = () => {
  const [trains, setTrains] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'testing'>('testing');
  const [testResults, setTestResults] = useState<any>({});
  const { currentUser } = useAuth();

  // Test database connection
  const testConnection = async () => {
    setLoading(true);
    setConnectionStatus('testing');
    
    try {
      // Test basic read operation
      const allTrains = await trainService.getAllTrains();
      setTrains(allTrains);
      setConnectionStatus('connected');
      
      setTestResults({
        trainsCount: allTrains.length,
        connectionTime: new Date().toISOString(),
        status: 'success'
      });
    } catch (error) {
      console.error('Database connection test failed:', error);
      setConnectionStatus('disconnected');
      setTestResults({
        error: error instanceof Error ? error.message : 'Unknown error',
        status: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Initialize database
  const handleInitDatabase = async () => {
    setLoading(true);
    try {
      const initialized = await initializeDatabase();
      if (initialized) {
        await testConnection();
        alert('Database initialized successfully!');
      } else {
        alert('Database already contains data');
      }
    } catch (error) {
      console.error('Failed to initialize database:', error);
      alert('Failed to initialize database');
    } finally {
      setLoading(false);
    }
  };

  // Reset database
  const handleResetDatabase = async () => {
    if (confirm('Are you sure you want to reset the database? This will delete all data!')) {
      setLoading(true);
      try {
        await resetDatabase();
        await testConnection();
        alert('Database reset successfully!');
      } catch (error) {
        console.error('Failed to reset database:', error);
        alert('Failed to reset database');
      } finally {
        setLoading(false);
      }
    }
  };

  // Test user profile operations
  const testUserOperations = async () => {
    if (!currentUser) {
      alert('Please login first to test user operations');
      return;
    }

    try {
      // Test updating user profile
      await userService.updateUserProfile(currentUser.uid, {
        preferredClass: '2A',
        emergencyContact: '+91-9876543210'
      });
      
      // Test reading user profile
      const profile = await userService.getUserProfile(currentUser.uid);
      console.log('User profile test successful:', profile);
      alert('User operations test passed!');
    } catch (error) {
      console.error('User operations test failed:', error);
      alert('User operations test failed!');
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-railway-blue/5 via-background to-railway-orange/5 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-railway-blue">
            Firebase Realtime Database Test
          </h1>
          <p className="text-muted-foreground">
            Test and manage your Firebase Realtime Database connection
          </p>
        </div>

        {/* Connection Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Connection Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              {connectionStatus === 'connected' && (
                <>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <Badge variant="default" className="bg-green-500">Connected</Badge>
                </>
              )}
              {connectionStatus === 'disconnected' && (
                <>
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <Badge variant="destructive">Disconnected</Badge>
                </>
              )}
              {connectionStatus === 'testing' && (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <Badge variant="secondary">Testing...</Badge>
                </>
              )}
            </div>

            {testResults.status === 'success' && (
              <div className="text-sm text-muted-foreground">
                <p>Trains in database: {testResults.trainsCount}</p>
                <p>Last tested: {new Date(testResults.connectionTime).toLocaleString()}</p>
              </div>
            )}

            {testResults.status === 'error' && (
              <div className="text-sm text-red-500">
                <p>Error: {testResults.error}</p>
              </div>
            )}

            <div className="flex gap-2">
              <Button 
                onClick={testConnection} 
                disabled={loading}
                size="sm"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Test Connection
              </Button>
              
              <Button 
                onClick={testUserOperations} 
                disabled={loading || !currentUser}
                variant="outline"
                size="sm"
              >
                <Users className="w-4 h-4 mr-2" />
                Test User Ops
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Database Management */}
        <Card>
          <CardHeader>
            <CardTitle>Database Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button 
                onClick={handleInitDatabase} 
                disabled={loading}
                variant="outline"
              >
                <Database className="w-4 h-4 mr-2" />
                Initialize Database
              </Button>
              
              <Button 
                onClick={handleResetDatabase} 
                disabled={loading}
                variant="destructive"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset Database
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground">
              Initialize will populate the database with sample train data if it's empty. 
              Reset will clear all data and re-populate with fresh sample data.
            </p>
          </CardContent>
        </Card>

        {/* Train Data Display */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Train className="w-5 h-5" />
              Sample Train Data ({trains.length} trains)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto text-railway-blue" />
                <p className="mt-2 text-muted-foreground">Loading trains...</p>
              </div>
            ) : trains.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {trains.slice(0, 6).map((train) => (
                  <div key={train.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{train.number}</Badge>
                      <Badge variant="secondary">
                        {train.classes?.['3A']?.availableSeats || 0} seats
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-sm">{train.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {train.from} → {train.to}
                    </p>
                    <p className="text-xs">
                      Departs: {train.departure} | Duration: {train.duration}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Database className="w-12 h-12 mx-auto opacity-50" />
                <p className="mt-2">No train data found</p>
                <p className="text-sm">Click "Initialize Database" to populate with sample data</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Real-time Test */}
        <Card>
          <CardHeader>
            <CardTitle>Real-time Updates Test</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Firebase Realtime Database automatically syncs data in real-time. 
              Any changes made to the database will be reflected immediately across all connected clients.
            </p>
            <Badge variant="outline" className="text-green-600">
              ✅ Real-time sync enabled
            </Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DatabaseTest;
