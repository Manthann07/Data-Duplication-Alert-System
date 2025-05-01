import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Card } from '../components/ui/card';
import { Timer, Zap, Users, Clock } from 'lucide-react';

const PerformanceTest = () => {
  const [manualTime, setManualTime] = useState(0);
  const [automatedTime, setAutomatedTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState(null);
  
  // Sample dataset sizes for testing
  const testSizes = [1000, 5000, 10000];
  const [selectedSize, setSelectedSize] = useState(testSizes[0]);

  // Generate sample data with duplicates
  const generateTestData = (size) => {
    const data = [];
    for (let i = 0; i < size; i++) {
      data.push({
        id: i,
        name: `User ${Math.floor(i / 2)}`, // Creates duplicates
        email: `user${Math.floor(i / 2)}@example.com`,
        age: 20 + Math.floor(Math.random() * 40)
      });
    }
    return data;
  };

  // Simulated manual detection process
  const runManualDetection = async (data) => {
    const startTime = performance.now();
    
    // Simulate manual checking time (approximately 2 seconds per 100 records)
    const simulatedTime = (data.length / 100) * 2000;
    await new Promise(resolve => setTimeout(resolve, Math.min(simulatedTime, 3000))); // Cap at 3 seconds for demo
    
    const endTime = performance.now();
    return endTime - startTime;
  };

  // Automated detection process
  const runAutomatedDetection = async (data) => {
    const startTime = performance.now();
    
    // Our efficient algorithm (hash-based approach)
    const seen = new Map();
    const duplicates = [];
    
    data.forEach(item => {
      const key = `${item.name}-${item.email}`;
      if (seen.has(key)) {
        duplicates.push(item);
      } else {
        seen.set(key, item);
      }
    });
    
    const endTime = performance.now();
    return endTime - startTime;
  };

  const runPerformanceTest = async () => {
    setIsLoading(true);
    
    try {
      // Generate test data
      const testData = generateTestData(selectedSize);
      
      // Run manual detection
      const manualTestTime = await runManualDetection(testData);
      setManualTime(manualTestTime);
      
      // Run automated detection
      const automatedTestTime = await runAutomatedDetection(testData);
      setAutomatedTime(automatedTestTime);
      
      // Calculate improvements
      const improvement = ((manualTestTime - automatedTestTime) / manualTestTime) * 100;
      
      setTestResults({
        recordsProcessed: selectedSize,
        timeImprovement: improvement.toFixed(2),
        manualTime: (manualTestTime / 1000).toFixed(2),
        automatedTime: (automatedTestTime / 1000).toFixed(2)
      });
    } catch (error) {
      console.error('Performance test error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Performance Comparison</h1>
      
      <div className="grid gap-6 mb-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Test Configuration</h2>
          <div className="flex gap-4 mb-4">
            {testSizes.map(size => (
              <Button
                key={size}
                variant={selectedSize === size ? "default" : "outline"}
                onClick={() => setSelectedSize(size)}
              >
                {size.toLocaleString()} Records
              </Button>
            ))}
          </div>
          <Button
            onClick={runPerformanceTest}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>Running Test...</>
            ) : (
              <>Run Performance Test</>
            )}
          </Button>
        </Card>

        {testResults && (
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Manual Process</h3>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-gray-500" />
                <span className="text-2xl font-bold">{testResults.manualTime}s</span>
              </div>
              <Progress value={100} className="mb-2" />
              <p className="text-sm text-gray-500">
                Simulated time for manual duplicate detection
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Automated Process</h3>
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-blue-500" />
                <span className="text-2xl font-bold">{testResults.automatedTime}s</span>
              </div>
              <Progress 
                value={(testResults.automatedTime / testResults.manualTime) * 100} 
                className="mb-2" 
              />
              <p className="text-sm text-gray-500">
                Time taken by our automated system
              </p>
            </Card>

            <Card className="p-6 md:col-span-2 bg-blue-50">
              <h3 className="text-lg font-semibold mb-4">Performance Improvement</h3>
              <div className="grid gap-6 md:grid-cols-3">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-blue-500" />
                    <span className="text-2xl font-bold">
                      {testResults.recordsProcessed.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">Records Processed</p>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Timer className="w-5 h-5 text-green-500" />
                    <span className="text-2xl font-bold text-green-600">
                      {testResults.timeImprovement}%
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">Faster Than Manual</p>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-blue-500" />
                    <span className="text-2xl font-bold">
                      {(testResults.manualTime - testResults.automatedTime).toFixed(2)}s
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">Time Saved</p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceTest; 