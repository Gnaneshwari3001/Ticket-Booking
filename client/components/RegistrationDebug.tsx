import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { testFirebaseConnection, debugDatabaseRules } from "@/lib/firebase-debug";
import { userService } from "@/lib/realtime-database";
import { useAuth } from "@/contexts/AuthContext";
import { 
  AlertTriangle, 
  CheckCircle, 
  Database, 
  User,
  Settings
} from "lucide-react";

export const RegistrationDebug = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [testResults, setTestResults] = useState<any>({});
  const { currentUser } = useAuth();

  const runDiagnostics = async () => {
    const results: any = {};
    
    // Test 1: Firebase connection
    try {
      results.connection = await testFirebaseConnection();
    } catch (error) {
      results.connection = false;
      results.connectionError = error instanceof Error ? error.message : 'Unknown error';
    }

    // Test 2: Check if user is authenticated
    results.authenticated = !!currentUser;
    results.userId = currentUser?.uid;

    // Test 3: Try to read from database
    if (currentUser) {
      try {
        const profile = await userService.getUserProfile(currentUser.uid);
        results.profileExists = !!profile;
        results.profileData = profile;
      } catch (error) {
        results.profileExists = false;
        results.profileError = error instanceof Error ? error.message : 'Unknown error';
      }
    }

    setTestResults(results);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          variant="outline"
          size="sm"
          className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
        >
          <AlertTriangle className="w-4 h-4 mr-2" />
          Debug Registration
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96">
      <Card className="bg-white shadow-lg border-red-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              Registration Debug
            </span>
            <Button
              onClick={() => setIsOpen(false)}
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
            >
              ×
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Alert className="p-3">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              If registration isn't saving data, this tool helps identify the issue.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Button
              onClick={runDiagnostics}
              size="sm"
              className="w-full"
            >
              Run Diagnostics
            </Button>

            <Button
              onClick={debugDatabaseRules}
              size="sm"
              variant="outline"
              className="w-full"
            >
              <Settings className="w-4 h-4 mr-2" />
              Show Fix Instructions
            </Button>
          </div>

          {Object.keys(testResults).length > 0 && (
            <div className="space-y-2 text-xs">
              <div className="font-medium">Test Results:</div>
              
              <div className="flex items-center justify-between">
                <span>Firebase Connection:</span>
                {testResults.connection ? (
                  <Badge variant="default" className="text-xs bg-green-500">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    OK
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="text-xs">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Failed
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span>User Authenticated:</span>
                {testResults.authenticated ? (
                  <Badge variant="default" className="text-xs bg-green-500">
                    <User className="w-3 h-3 mr-1" />
                    Yes
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="text-xs">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    No
                  </Badge>
                )}
              </div>

              {testResults.authenticated && (
                <div className="flex items-center justify-between">
                  <span>Profile in DB:</span>
                  {testResults.profileExists ? (
                    <Badge variant="default" className="text-xs bg-green-500">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Exists
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="text-xs">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Missing
                    </Badge>
                  )}
                </div>
              )}

              {testResults.connectionError && (
                <div className="text-red-600 bg-red-50 p-2 rounded text-xs">
                  Error: {testResults.connectionError}
                </div>
              )}

              {testResults.profileError && (
                <div className="text-red-600 bg-red-50 p-2 rounded text-xs">
                  Profile Error: {testResults.profileError}
                </div>
              )}
            </div>
          )}

          <div className="text-xs text-muted-foreground border-t pt-2">
            <strong>Most Common Issues:</strong>
            <ul className="list-disc list-inside space-y-1 mt-1">
              <li>Database rules don't allow writes</li>
              <li>User not authenticated during registration</li>
              <li>Network connectivity issues</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
